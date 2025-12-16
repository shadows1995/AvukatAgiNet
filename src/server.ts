import express from "express";
import bodyParser from "body-parser";
import { sendSaleRequest } from "./garantiClient.cjs";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import path from "path";
import cron from 'node-cron';
import dotenv from "dotenv";
import { runJobBot } from "./services/jobBot.js";
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Builder } from 'xml2js';
import { COURTHOUSES } from '../data/courthouses.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the dist directory (one level up from src where server.js resides)
const staticPath = path.join(__dirname, '../dist');
console.log('📂 Static Path resolved to:', staticPath);

if (fs.existsSync(staticPath)) {
    console.log('✅ Static directory exists.');
    console.log('   Contents:', fs.readdirSync(staticPath));
    const assetsPath = path.join(staticPath, 'assets');
    if (fs.existsSync(assetsPath)) {
        console.log('   Assets Contents:', fs.readdirSync(assetsPath));
    } else {
        console.log('   ❌ No assets folder found in dist');
    }
} else {
    console.error('❌ Static directory DOES NOT exist at:', staticPath);
}

// Log all requests
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

app.use(express.static(staticPath));

// Initialize Supabase Admin Client
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

import { sendSms, notifyNewJob } from "./services/notificationService.js";

// Endpoint: Notify users about a new job
app.post('/api/notify-new-job', async (req, res) => {
    const { city, courthouse, jobType, jobId, createdBy, date, offeredFee, isOutside } = req.body;

    const result = await notifyNewJob(supabase, {
        city,
        courthouse,
        jobType,
        jobId,
        createdBy,
        date,
        offeredFee,
        isOutside
    });

    if (result.success) {
        res.json(result);
    } else {
        res.status(500).json(result);
    }
});

// Endpoint: Notify applicant about approval
app.post('/api/notify-application-approved', async (req, res) => {
    const { applicantId, jobTitle } = req.body;

    if (!applicantId) {
        return res.status(400).json({ error: 'Missing applicantId' });
    }

    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('phone, full_name')
            .eq('uid', applicantId)
            .single();

        if (error || !user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.phone) {
            return res.status(400).json({ error: 'User has no phone number' });
        }

        const message = `Avukat Ağı - Sayın Meslektaşımız, "${jobTitle}" görevi için başvurunuz kabul edilmiştir. Görevi yapmaya başlayabilirsiniz. Detaylar için uygulamayı kontrol ediniz.`;

        const response = await sendSms(user.phone, message);

        res.json({ message: 'Notification sent', response });

    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint: Health Check
app.get('/api/health', (req, res) => {
    res.json({ ok: true, time: new Date().toISOString() });
});

// Endpoint: General SMS sending (protected)
app.post('/api/send-sms', async (req, res) => {
    const { phone, message } = req.body;
    const authHeader = req.headers.authorization;

    console.log("Incoming /api/send-sms request", phone);

    if (!authHeader) {
        return res.status(401).json({ error: 'Missing Authorization header' });
    }

    if (!phone || !message) {
        return res.status(400).json({ error: 'Missing phone or message' });
    }

    try {
        // Extract token
        const token = authHeader.replace('Bearer ', '');

        // Verify user with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        console.log(`📨 Authenticated SMS request from user ${user.id} to ${phone}`);

        const result = await sendSms(phone, message);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(500).json(result);
        }

    } catch (err: any) {
        console.error('Server error during SMS send:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// --- Payment Endpoints (3D Secure) ---
import { generateDtPaymentForm, verifyGarantiCallback } from "./services/garantiPaymentService.js";

// Endpoint: Initiate 3D Payment
app.post('/api/payment/initiate', async (req, res) => {
    const { userId, plan, period, price, cardData, billingInfo } = req.body;

    if (!userId || !cardData || !price) {
        return res.status(400).json({ error: 'Missing required payment fields' });
    }

    try {
        const { data: user, error } = await supabase.from('users').select('email, full_name').eq('uid', userId).single();
        if (error || !user) return res.status(404).json({ error: 'User not found' });

        // Generate Order ID
        const orderId = `AVG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Prepare Request for Form Generation
        const formData = generateDtPaymentForm({
            orderId: orderId,
            amount: parseFloat(price),
            installmentCount: "", // No installments for now
            cardNumber: cardData.number.replace(/\s/g, ''),
            expMonth: cardData.expiry.split('/')[0],
            expYear: cardData.expiry.split('/')[1],
            cvv: cardData.cvc,
            cardHolderName: cardData.name,
            customerEmail: user.email || 'noreply@avukatagi.net',
            customerIp: req.ip || '127.0.0.1',
            userId: userId
        });

        // Store temporary transaction state if needed (Optional: create 'transactions' table)
        // For now, we rely on the Callback carrying the OrderID and potentially UserID metadata if we had a way to pass custom fields.
        // Garanti doesn't easily support custom pass-through fields in Form mode except potentially hijacking 'terminaluserid' or similar, but that's risky.
        // Better approach: We will parse userid from 'oid' if we encoded it there, OR we must save the OrderID->UserID mapping in DB.

        // Let's create a Pending Transaction in DB to track who this order belongs to.
        // We'll create a `payment_transactions` table or just store in a simple local cache/log if DB migration is too heavy.
        // Given constraints, I'll encode UserID in OrderID or similar? No, OrderID has length limits.
        // Let's insert a row into a new `payment_logs` table if it existed.
        // As a Quick Fix: I'll repurpose `terminaluserid` field in the Form to store the `userId`. 
        // Docs say `terminaluserid` (Üye işyeri kullanıcı adı). Garanti might validate this.
        // Safe bet: Update `users` table with "last_pending_order_id" = orderId.
        await supabase.from('users').update({
            last_order_id: orderId,
            last_order_plan: plan,
            last_order_period: period
        }).eq('uid', userId);

        res.json(formData);

    } catch (err: any) {
        console.error('Payment Init Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Endpoint: Payment Callback FAIL
app.post('/api/payment/callback/fail', async (req, res) => {
    console.log('❌ Payment Failed Callback Body:', req.body);
    console.log('❌ Payment Failed Callback Headers:', req.headers);

    const body = req.body || {};
    const errorMsg = body.mderrormessage || body.errmsg || 'Ödeme başarısız oldu (Bilinmeyen Hata).';

    // Redirect to frontend error page
    res.redirect(`https://avukatagi.net/#/payment-failed?msg=${encodeURIComponent(errorMsg)}&code=${body.procreturncode}&md=${body.mdstatus}&hashparams=${encodeURIComponent(body.hashparams || '')}&oid=${body.orderid}`);
});

// Endpoint: Payment Callback SUCCESS
app.post('/api/payment/callback/success', async (req, res) => {
    console.log('✅ Payment Success Callback:', req.body);

    // 1. Verify Hash
    const isValid = verifyGarantiCallback(req.body);
    if (!isValid) {
        console.error('❌ Hash Mismatch! Possible Fraud.');
        return res.redirect('https://avukatagi.net/#/payment-failed?msg=Guvenlik_Hatasi');
    }

    // 2. Check ProcReturnCode (must be 00)
    if (req.body.procreturncode !== '00') {
        console.error('❌ ProcReturnCode Not 00:', req.body.procreturncode);
        return res.redirect(`https://avukatagi.net/#/payment-failed?msg=${encodeURIComponent(req.body.errmsg || 'Islem onaylanmadi')}&code=${req.body.procreturncode}`);
    }

    // 3. Fulfill Order
    const orderId = req.body.orderid; // "AVG-..."

    // Find who this order belongs to
    // We stored `last_order_id` in users table.
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('last_order_id', orderId)
        .single();

    if (error || !user) {
        console.error('❌ Could not find user for OrderID:', orderId);
        return res.redirect('https://avukatagi.net/#/payment-failed?msg=Kullanici_Bulunamadi');
    }

    // Update Premium Status
    const plan = user.last_order_plan || 'pro';
    const period = user.last_order_period || 'monthly';
    const amount = parseFloat(req.body.txnamount) / 100; // Convert back to Major

    const updateData = {
        is_premium: true,
        membership_type: plan,
        premium_plan: period,
        premium_price: amount,
        premium_since: new Date().toISOString(),
        premium_until: new Date(Date.now() + ((period === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000)).toISOString(),
        updated_at: new Date().toISOString(),
        last_order_id: null // Clear it
    };

    await supabase.from('users').update(updateData).eq('uid', user.uid);

    console.log(`🎉 User ${user.uid} upgraded via 3D Secure!`);

    // Redirect to HashRouter path
    res.redirect('https://avukatagi.net/#/payment-success');
});

app.get("/api/garanti/test-sale", (req, res) => {
    res.status(405).send("Method Not Allowed. Please use POST to submit a sale request.");
});

app.post("/api/garanti/test-sale", async (req, res) => {
    try {
        const { amount, cardNumber, expMonth, expYear, cvv, email, userId, plan, period, billingInfo } = req.body;

        const orderId = Date.now().toString();

        const result = await sendSaleRequest({
            orderId,
            amountMajor: parseFloat(amount),
            cardNumber,
            expMonth,
            expYear,
            cvv,
            customerEmail: email,
        });

        if (result.approved && userId) {
            // Update user membership in Supabase
            const updateData = {
                is_premium: true,
                membership_type: plan,
                premium_plan: period,
                premium_price: parseFloat(amount),
                premium_since: new Date().toISOString(),
                premium_until: new Date(Date.now() + ((period === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000)).toISOString(),
                updated_at: new Date().toISOString(),
                billing_address: billingInfo?.address,
                tc_id: billingInfo?.tcId
            };

            // const fs = require('fs'); // Removed: using top-level import
            fs.appendFileSync('debug_log.txt', `\n--- Supabase Update Attempt ---\nUser: ${userId}\nPlan: ${plan}\nData: ${JSON.stringify(updateData, null, 2)}\n`);

            const { data, error } = await supabase.from('users').update(updateData).eq('uid', userId).select();

            if (error) {
                console.error("Supabase update error:", error);
                fs.appendFileSync('debug_log.txt', `Error: ${JSON.stringify(error, null, 2)}\n-------------------------------\n`);
            } else {
                console.log(`User ${userId} upgraded to ${plan}`);
                fs.appendFileSync('debug_log.txt', `Success: Updated ${data?.length} rows.\n-------------------------------\n`);
            }
        } else {
            // const fs = require('fs'); // Removed: using top-level import
            fs.appendFileSync('debug_log.txt', `\n--- Supabase Update Skipped ---\nApproved: ${result.approved}\nUserId: ${userId}\n-------------------------------\n`);
        }

        res.json(result);
    } catch (err: any) {
        console.error(err);
        // const fs = require('fs'); // Removed: using top-level import
        try {
            fs.appendFileSync('debug_log.txt', `\n--- SALE REQUEST ERROR ---\nError: ${err.message}\nStack: ${err.stack}\n--------------------------\n`);
        } catch (e) { }

        res.status(500).json({ error: "Garanti test sale failed", details: err?.message });
    }
});

// Endpoint: RSS Feed for Zapier/Telegram
app.get('/rss', async (req, res) => {
    try {
        const { data: jobs, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('status', 'open') // Only active/open jobs
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw error;

        const feedObj = {
            rss: {
                $: {
                    version: "2.0",
                    "xmlns:atom": "http://www.w3.org/2005/Atom"
                },
                channel: {
                    title: "AvukatAğı Yeni Görevler",
                    link: "https://avukatagi.net",
                    description: "AvukatAğı üzerinde yayınlanan en yeni görevler.",
                    language: "tr-TR",
                    lastBuildDate: new Date().toUTCString(),
                    item: jobs?.map(job => {
                        const cityCourthouses = COURTHOUSES[job.city] || [];
                        const isKnown = cityCourthouses.includes(job.courthouse);

                        // If not known, treat as Outside
                        const isOutside = !isKnown;

                        let title = '';
                        let locationLine = '';

                        if (isOutside) {
                            title = `${job.city} (Adliye Dışı) - ${job.courthouse}`;
                            locationLine = `<strong>Görev Yeri:</strong> ${job.courthouse}`;
                        } else {
                            title = `${job.city} - ${job.courthouse} - ${job.job_type}`;
                            locationLine = `<strong>Adliye:</strong> ${job.courthouse}`;
                        }

                        // Format date to DD/MM/YYYY
                        let formattedDate = job.date;
                        if (job.date && job.date.includes('-')) {
                            const parts = job.date.split('-');
                            if (parts.length === 3) {
                                formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
                            }
                        }

                        return {
                            title: title,
                            link: `https://avukatagi.net/job/${job.job_id}`,
                            description: `
                                <strong>Şehir:</strong> ${job.city}<br>
                                ${locationLine}<br>
                                <strong>Görev Türü:</strong> ${job.job_type}<br>
                                <strong>Tarih:</strong> ${formattedDate} ${job.time}<br>
                                <strong>Ücret:</strong> ${job.offered_fee} TL
                            `.trim(),
                            pubDate: new Date(job.created_at).toUTCString(),
                            guid: {
                                $: { isPermaLink: "false" },
                                _: job.job_id
                            }
                        };
                    })
                }
            }
        };

        const builder = new Builder();
        const xml = builder.buildObject(feedObj);

        res.set('Content-Type', 'application/xml');
        res.send(xml);

    } catch (err: any) {
        console.error('RSS Generation Error:', err);
        res.status(500).send('Error generating RSS feed');
    }
});

// Handle React routing, return all requests to React app
// This must be the last route
app.get(/.*/, (req, res) => {
    // Log if we are serving index.html for a non-html request (likely a missing asset)
    if (req.url.includes('.js') || req.url.includes('.css') || req.url.includes('.png') || req.url.includes('.jpg')) {
        console.warn(`⚠️  MISSING ASSET: Serving index.html for ${req.url} - File likely does not exist in dist/assets`);
    }
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});


// Endpoint: Manually trigger Job Bot
app.post('/api/trigger-bot', async (req, res) => {
    try {
        console.log('🤖 Manual Trigger: Starting Job Bot...');
        await runJobBot(supabase);
        res.json({ message: 'Job Bot triggered successfully. Check server logs for details.' });
    } catch (err: any) {
        console.error('Manual Trigger Error:', err);
        res.status(500).json({ error: 'Failed to trigger bot', details: err.message });
    }
});

// Job Bot Schedule (Every 2 minutes)
cron.schedule('*/2 * * * *', async () => {
    console.log('🤖 Cron Job: Triggering Job Bot...');
    await runJobBot(supabase);
});

// Telegram Service Imports
import { sendTelegramMessage, setTelegramWebhook } from './services/telegramService.js';

// --- Telegram Webhook Endpoint ---
// This endpoint receives updates from Telegram (e.g. /start 123456)
app.post('/api/telegram/webhook', async (req, res) => {
    const secretToken = req.headers['x-telegram-bot-api-secret-token'];
    const EXPECTED_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

    // 1. Security Check
    if (EXPECTED_SECRET && secretToken !== EXPECTED_SECRET) {
        console.warn('⚠️ Telegram Webhook: Invalid Secret Token');
        return res.status(403).send('Forbidden');
    }

    try {
        const update = req.body;
        // We only care about messages with text
        if (!update.message || !update.message.text) {
            return res.status(200).send('OK');
        }

        const messageText = update.message.text.trim();
        const chatId = update.message.chat.id.toString();
        const userIdFromTelegram = update.message.from?.id?.toString();

        console.log(`📩 Telegram Message from ${chatId}: ${messageText}`);

        // Handle /start CODE
        if (messageText.startsWith('/start')) {
            const parts = messageText.split(' ');
            if (parts.length === 2) {
                const code = parts[1].trim();

                // Validate Code in DB
                // Find unused code that hasn't expired
                const { data: linkRecord, error: fetchError } = await supabase
                    .from('telegram_link_codes')
                    .select('*')
                    .eq('code', code)
                    .is('used_at', null)
                    .gt('expires_at', new Date().toISOString())
                    .single();

                if (fetchError || !linkRecord) {
                    await sendTelegramMessage(chatId, '❌ Bu kod geçersiz veya süresi dolmuş. Lütfen uygulamadan yeni bir kod alınız.');
                    return res.status(200).send('OK');
                }

                // Code is valid! Link the user.
                const avukatUserId = linkRecord.user_id;

                // Update User Table
                const { error: updateError } = await supabase
                    .from('users')
                    .update({
                        telegram_chat_id: chatId,
                        telegram_notifications_enabled: true,
                        telegram_connected_at: new Date().toISOString()
                    })
                    .eq('uid', avukatUserId);

                if (updateError) {
                    console.error('❌ Failed to link Telegram user:', updateError);
                    await sendTelegramMessage(chatId, '❌ Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.');
                    return res.status(200).send('OK');
                }

                // Mark code as used
                await supabase
                    .from('telegram_link_codes')
                    .update({ used_at: new Date().toISOString() })
                    .eq('id', linkRecord.id);

                await sendTelegramMessage(chatId, '✅ Hesabınız başarıyla eşleşti! Artık platformdaki önemli bildirimleri buradan alacaksınız.');
                console.log(`✅ Telegram Linked: User ${avukatUserId} -> Chat ${chatId}`);
            } else {
                await sendTelegramMessage(chatId, '👋 Merhaba! AvukatAğı botuna hoş geldiniz. Hesabınızı bağlamak için uygulamadaki "Ayarlar" sayfasından alacağınız kodu kullanın.');
            }
        }

        res.status(200).send('OK');
    } catch (err) {
        console.error('❌ Telegram Webhook Error:', err);
        // Always return 200 to Telegram to prevent retry loops
        res.status(200).send('OK');
    }
});

// --- Generate Link Code Endpoint ---
app.post('/api/telegram/link-code', async (req, res) => {
    const { token } = req.body;

    if (!token) return res.status(400).json({ error: 'Missing token' });

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) return res.status(401).json({ error: 'Unauthorized' });

        const userId = user.id;

        // 1. Check if there is already an active code
        const { data: existingCode } = await supabase
            .from('telegram_link_codes')
            .select('code, expires_at')
            .eq('user_id', userId)
            .is('used_at', null)
            .gt('expires_at', new Date().toISOString())
            .maybeSingle();

        if (existingCode) {
            console.log(`♻️ Reusing existing active code for user ${userId}`);
            return res.json({ code: existingCode.code, expiresAt: existingCode.expires_at });
        }

        // 2. Clean up old unused codes for this user to keep DB clean
        await supabase
            .from('telegram_link_codes')
            .delete()
            .eq('user_id', userId)
            .is('used_at', null);

        // 3. Generate new 6-digit random code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // 4. Insert into DB
        const { error: insertError } = await supabase
            .from('telegram_link_codes')
            .insert({
                user_id: userId,
                code: code,
                expires_at: expiresAt.toISOString()
            });

        if (insertError) {
            console.error('❌ Failed to generate link code:', insertError);
            return res.status(500).json({ error: 'Failed to generate code' });
        }

        res.json({ code, expiresAt });

    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- Setup Webhook Manual Endpoint (Optional/Admin) ---
app.post('/api/telegram/setup-webhook', async (req, res) => {
    // Basic protection (or check admin role)
    const { secret } = req.body;
    if (secret !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    try {
        const baseUrl = process.env.PUBLIC_BASE_URL || 'https://avukatagi.net'; // Ensure valid URL
        const webhookUrl = `${baseUrl}/api/telegram/webhook`;
        const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

        console.log(`Setting Telegram Webhook to: ${webhookUrl}`);
        const result = await setTelegramWebhook(webhookUrl, webhookSecret);
        res.json(result);
    } catch (err: any) {
        console.error('Webhook setup error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

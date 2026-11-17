import express from "express";
import bodyParser from "body-parser";
import { sendSaleRequest } from "./garantiClient.cjs";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import cron from 'node-cron';
import dotenv from "dotenv";
import { runJobBot } from "./services/jobBot.js";
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Builder } from 'xml2js';
import { COURTHOUSES } from '../data/courthouses.js';
import { ALL_SEO_ENTRIES, getSeoEntryBySlug, FAQ_ITEMS, getCourthouseSlug } from '../data/seoData.js';
import { verifyGarantiCallback } from "./services/garantiPaymentService.js";
import { getOrInitCampaignState, saveCampaignState, rotateToNextCampaign, sendMarketingBatch, sendTestMarketingEmail, buildMarketingEmailHtml, generateNextCampaignContent } from "./services/marketingService.js";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // Critical for Garanti Callback
// app.use(express.urlencoded({ extended: true })); // Removed in favor of bodyParser above
// Serve static files from the dist directory (one level up from src where server.js resides)
const staticPath = path.join(__dirname, '../dist');
console.log('📂 Static Path resolved to:', staticPath);
if (fs.existsSync(staticPath)) {
    console.log('✅ Static directory exists.');
    console.log('   Contents:', fs.readdirSync(staticPath));
    const assetsPath = path.join(staticPath, 'assets');
    if (fs.existsSync(assetsPath)) {
        console.log('   Assets Contents:', fs.readdirSync(assetsPath));
    }
    else {
        console.log('   ❌ No assets folder found in dist');
    }
}
else {
    console.error('❌ Static directory DOES NOT exist at:', staticPath);
}
// Log all requests
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});
// Dynamic XML Sitemap covering all public pages, FAQ, 81 cities, and all courthouses
app.get('/sitemap.xml', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const staticUrls = [
        { loc: 'https://avukatagi.net/', changefreq: 'daily', priority: '1.0' },
        { loc: 'https://avukatagi.net/adliyeler', changefreq: 'weekly', priority: '0.9' },
        { loc: 'https://avukatagi.net/how-it-works', changefreq: 'weekly', priority: '0.9' },
        { loc: 'https://avukatagi.net/sss', changefreq: 'weekly', priority: '0.9' },
        { loc: 'https://avukatagi.net/yasal-mevzuat', changefreq: 'monthly', priority: '0.8' },
        { loc: 'https://avukatagi.net/about', changefreq: 'monthly', priority: '0.8' },
        { loc: 'https://avukatagi.net/register', changefreq: 'monthly', priority: '0.8' },
        { loc: 'https://avukatagi.net/login', changefreq: 'monthly', priority: '0.6' },
        { loc: 'https://avukatagi.net/terms', changefreq: 'yearly', priority: '0.4' },
        { loc: 'https://avukatagi.net/privacy', changefreq: 'yearly', priority: '0.4' },
        { loc: 'https://avukatagi.net/distance-sales-agreement', changefreq: 'yearly', priority: '0.4' }
    ];
    const dynamicUrls = ALL_SEO_ENTRIES.map(entry => ({
        loc: `https://avukatagi.net/tevkil/${entry.slug}`,
        changefreq: 'weekly',
        priority: entry.type === 'city' ? '0.8' : '0.7'
    }));
    const allUrls = [...staticUrls, ...dynamicUrls];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls
        .map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`)
        .join('\n')}\n</urlset>`;
    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
});
app.use(express.static(staticPath));
// Initialize Supabase Admin Client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseServiceKey);
import { sendSms, notifyNewJob } from "./services/notificationService.js";
// Endpoint: Notify users about a new job
app.post('/api/notify-new-job', async (req, res) => {
    const { city, courthouse, jobType, jobId, createdBy, date, time, offeredFee, isOutside } = req.body;
    const result = await notifyNewJob(supabase, {
        city,
        courthouse,
        jobType,
        jobId,
        createdBy,
        date,
        time,
        offeredFee,
        isOutside
    });
    if (result.success) {
        res.json(result);
    }
    else {
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
            .select('uid, phone, full_name')
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
        // --- PUSH: Trigger Application Accepted Notification ---
        sendPushNotification({
            user_id: user.uid, // Applicant ID (wait, is .uid correct from DB select? Yes)
            title: 'Başvurunuz Onaylandı! 🎉',
            body: `"${jobTitle}" görevi için onaylandınız. Detayları görmek için dokunun.`,
            data: { type: 'application_approved' }
        }).catch(err => console.error("Async App Approved Push Error:", err));
        res.json({ message: 'Notification sent', response });
    }
    catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Endpoint: Health Check
app.get('/api/health', (req, res) => {
    res.json({ ok: true, time: new Date().toISOString() });
});
// Endpoint: Debug Telegram Env variables (Internal diagnostic)
app.get('/api/debug-telegram-env', (req, res) => {
    res.json({
        globalChatId: process.env.TELEGRAM_GLOBAL_CHAT_ID || 'MISSING',
        botTokenSet: !!process.env.TELEGRAM_BOT_TOKEN
    });
});
app.get('/api/debug-log', (req, res) => {
    try {
        const logPath = path.join(process.cwd(), 'notification.log');
        if (fs.existsSync(logPath)) {
            res.type('text/plain').send(fs.readFileSync(logPath, 'utf8'));
        }
        else {
            res.type('text/plain').send('Log file not found or empty.');
        }
    }
    catch (e) {
        res.type('text/plain').send('Error reading log: ' + e.message);
    }
});
// Endpoint: Activate Beta Trial (Securely)
app.post('/api/activate-beta', async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).json({ error: 'Missing token' });
    }
    try {
        // Did the user provide a valid token?
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        // Fetch current user details
        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('premium_until, claimed_beta_promo')
            .eq('uid', user.id)
            .single();
        if (fetchError || !userData) {
            return res.status(404).json({ error: 'User not found in database' });
        }
        if (userData.claimed_beta_promo) {
            return res.status(400).json({ error: 'Bu promosyondan daha önce yararlandınız.' });
        }
        // Calculate new premium_until
        const now = new Date();
        let currentUntil = userData.premium_until ? new Date(userData.premium_until) : now;
        // If their premium expired, start from now
        if (currentUntil < now) {
            currentUntil = now;
        }
        // Extend by 2 months
        const newUntil = new Date(currentUntil);
        newUntil.setMonth(newUntil.getMonth() + 2);
        // Determine if we should update premium_since (only if not currently active premium)
        let updatePayload = {
            is_premium: true,
            membership_type: 'premium_plus',
            premium_until: newUntil.toISOString(),
            premium_price: 0,
            premium_plan: 'beta',
            claimed_beta_promo: true
        };
        if (currentUntil <= now) {
            updatePayload.premium_since = now.toISOString();
        }
        // Update user with service_role permissions
        const { error: updateError } = await supabase
            .from('users')
            .update(updatePayload)
            .eq('uid', user.id);
        if (updateError) {
            console.error('Beta activation DB error:', updateError);
            return res.status(500).json({ error: 'Database update failed' });
        }
        console.log(`✅ User ${user.id} activated BETA trial.`);
        res.json({ success: true });
    }
    catch (err) {
        console.error('Beta activation server error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
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
        }
        else {
            return res.status(500).json(result);
        }
    }
    catch (err) {
        console.error('Server error during SMS send:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});
// --- Payment Endpoints (3D Secure) ---
import { generateDtPaymentForm } from "./services/garantiPaymentService.js";
// Endpoint: Initiate 3D Payment
app.post('/api/payment/initiate', async (req, res) => {
    const { userId, plan, period, price, cardData, billingInfo } = req.body;
    if (!userId || !cardData || !price) {
        return res.status(400).json({ error: 'Missing required payment fields' });
    }
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('email, full_name, is_premium, membership_type, premium_plan, premium_until')
            .eq('uid', userId)
            .single();
        if (error || !user)
            return res.status(404).json({ error: 'User not found' });
        // --- Price Validation Logic ---
        let finalPrice = parseFloat(price);
        // Check for Premium -> Premium Plus Discount Eligibility
        // Conditions: Premium User, Yearly Plan, Upgrading to Premium Plus Yearly, > 4 months remaining
        if (plan === 'premium_plus' && period === 'yearly') {
            const isPremium = user.is_premium;
            const isYearly = user.premium_plan === 'yearly';
            const isPremiumMembership = user.membership_type === 'premium';
            let hasTimeLeft = false;
            if (user.premium_until) {
                const expiryDate = new Date(user.premium_until);
                const now = new Date();
                const fourMonthsLater = new Date();
                fourMonthsLater.setMonth(now.getMonth() + 4);
                if (expiryDate > fourMonthsLater) {
                    hasTimeLeft = true;
                }
            }
            const isEligibleForDiscount = isPremium && isYearly && isPremiumMembership && hasTimeLeft;
            if (isEligibleForDiscount) {
                console.log(`✅ User ${userId} is eligible for Premium+ Upgrade Discount. Price: 500 TL`);
                // If the frontend sent 500, we accept it. Or we enforce it here.
                // Let's enforce/validate.
                // If user sent something else but IS eligible, we could technically allow 500, but let's just validate what was sent matches expectations.
                // Actually, safer to OVERRIDE or Validate.
                // If client says 500 and is eligible -> OK.
                // If client says 1399 but is eligible -> OK (user pays full price, weird but allowed).
                // If client says 500 but NOT eligible -> REJECT or Correction.
                // Better approach: Trust the price sent BUT strict check if it's the discounted one.
                if (Math.abs(finalPrice - 500) < 1) {
                    // OK, authorized
                }
                else if (Math.abs(finalPrice - 1399) < 1) {
                    // OK, paying full price
                }
                else {
                    // Invalid price for this plan
                    return res.status(400).json({ error: 'Invalid price for this plan.' });
                }
            }
            else {
                // Not eligible, must pay full price (1399)
                if (Math.abs(finalPrice - 500) < 1) {
                    return res.status(400).json({ error: 'Not eligible for discount.' });
                }
            }
        }
        // Generate Order ID
        const orderId = `AVG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
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
    }
    catch (err) {
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
    res.redirect(`https://avukatagi.net/payment-failed?msg=${encodeURIComponent(errorMsg)}&code=${body.procreturncode}&md=${body.mdstatus}&hashparams=${encodeURIComponent(body.hashparams || '')}&oid=${body.orderid}`);
});
// Endpoint: Payment Callback SUCCESS
app.post('/api/payment/callback/success', async (req, res) => {
    console.log('✅ Payment Success Callback:', req.body);
    // 1. Verify Hash
    const isValid = verifyGarantiCallback(req.body);
    if (!isValid) {
        console.error('❌ Hash Mismatch! Possible Fraud.');
        return res.redirect('https://avukatagi.net/payment-failed?msg=Guvenlik_Hatasi');
    }
    // 2. Check ProcReturnCode (must be 00)
    if (req.body.procreturncode !== '00') {
        console.error('❌ ProcReturnCode Not 00:', req.body.procreturncode);
        return res.redirect(`https://avukatagi.net/payment-failed?msg=${encodeURIComponent(req.body.errmsg || 'Islem onaylanmadi')}&code=${req.body.procreturncode}`);
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
        return res.redirect('https://avukatagi.net/payment-failed?msg=Kullanici_Bulunamadi');
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
    // Redirect to BrowserRouter path
    res.redirect('https://avukatagi.net/payment-success');
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
            }
            else {
                console.log(`User ${userId} upgraded to ${plan}`);
                fs.appendFileSync('debug_log.txt', `Success: Updated ${data?.length} rows.\n-------------------------------\n`);
            }
        }
        else {
            // const fs = require('fs'); // Removed: using top-level import
            fs.appendFileSync('debug_log.txt', `\n--- Supabase Update Skipped ---\nApproved: ${result.approved}\nUserId: ${userId}\n-------------------------------\n`);
        }
        res.json(result);
    }
    catch (err) {
        console.error(err);
        // const fs = require('fs'); // Removed: using top-level import
        try {
            fs.appendFileSync('debug_log.txt', `\n--- SALE REQUEST ERROR ---\nError: ${err.message}\nStack: ${err.stack}\n--------------------------\n`);
        }
        catch (e) { }
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
        if (error)
            throw error;
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
                        }
                        else {
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
    }
    catch (err) {
        console.error('RSS Generation Error:', err);
        res.status(500).send('Error generating RSS feed');
    }
});
// Helper to verify admin request
async function verifyAdminRequest(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: "No token provided" });
        return false;
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
        res.status(401).json({ error: "Invalid token" });
        return false;
    }
    const { data: profile } = await supabase.from('users').select('role').eq('uid', user.id).single();
    if (profile?.role !== 'admin') {
        res.status(403).json({ error: "Unauthorized" });
        return false;
    }
    return true;
}
// Endpoint: Get Marketing Stats & Active AI Campaign State
app.get('/api/admin/marketing-stats', async (req, res) => {
    try {
        if (!(await verifyAdminRequest(req, res)))
            return;
        const campaignState = await getOrInitCampaignState(supabase);
        const { count: sentCount } = await supabase.from('marketing_emails').select('*', { count: 'exact', head: true }).eq('sent', true);
        const { count: unsentCount } = await supabase.from('marketing_emails').select('*', { count: 'exact', head: true }).eq('sent', false);
        res.json({
            sent: sentCount || 0,
            unsent: unsentCount || 0,
            total: (sentCount || 0) + (unsentCount || 0),
            campaignState,
            previewHtml: buildMarketingEmailHtml(campaignState.currentCampaign)
        });
    }
    catch (err) {
        console.error('Marketing Stats Error:', err);
        res.status(500).json({ error: 'Failed to fetch stats', details: err.message });
    }
});
// Endpoint: Send a test marketing email to a single address (e.g., vahdetbicak@gmail.com)
app.post('/api/admin/marketing-send-test', async (req, res) => {
    try {
        if (!(await verifyAdminRequest(req, res)))
            return;
        const { email } = req.body || {};
        const targetEmail = (email || 'vahdetbicak@gmail.com').trim();
        const result = await sendTestMarketingEmail(supabase, targetEmail);
        res.json({
            message: `Test e-postası (${result.subject}) başarıyla ${targetEmail} adresine gönderildi!`,
            ...result
        });
    }
    catch (err) {
        console.error('Marketing Test Send Error:', err);
        res.status(500).json({ error: 'Test gönderimi başarısız.', details: err.message });
    }
});
// Endpoint: Send a batch of marketing emails (manual or on-demand)
app.post('/api/admin/send-marketing', async (req, res) => {
    try {
        if (!(await verifyAdminRequest(req, res)))
            return;
        const result = await sendMarketingBatch(supabase, { isAutoCron: false });
        res.json({
            message: result.message,
            count: result.sentCount,
            rotatedToNewCampaign: result.rotatedToNewCampaign,
            campaignNumber: result.campaignNumber,
            subject: result.subject
        });
    }
    catch (err) {
        console.error('Marketing Bulk Send Error:', err);
        res.status(500).json({ error: 'Gönderim başarısız.', details: err.message });
    }
});
// Endpoint: Update Marketing Automation Settings (autoSendEnabled, dailyLimit)
app.post('/api/admin/marketing-settings', async (req, res) => {
    try {
        if (!(await verifyAdminRequest(req, res)))
            return;
        const { autoSendEnabled, dailyLimit } = req.body;
        const state = await getOrInitCampaignState(supabase);
        if (typeof autoSendEnabled === 'boolean') {
            state.autoSendEnabled = autoSendEnabled;
        }
        if (typeof dailyLimit === 'number' && dailyLimit >= 1 && dailyLimit <= 1000) {
            state.dailyLimit = Math.floor(dailyLimit);
        }
        await saveCampaignState(supabase, state);
        res.json({ message: 'Otomasyon ayarları güncellendi.', campaignState: state });
    }
    catch (err) {
        console.error('Marketing Settings Update Error:', err);
        res.status(500).json({ error: 'Ayarlar güncellenemedi.', details: err.message });
    }
});
// Endpoint: Generate / Rotate AI Campaign Email
app.post('/api/admin/marketing-rotate', async (req, res) => {
    try {
        if (!(await verifyAdminRequest(req, res)))
            return;
        const { resetQueue } = req.body || {};
        const state = await getOrInitCampaignState(supabase);
        let updatedState;
        if (resetQueue) {
            updatedState = await rotateToNextCampaign(supabase, state, true);
        }
        else {
            // Generate new content for the next angle without resetting the current sent progress
            const nextTempNum = state.campaignNumber + 1;
            const newContent = await generateNextCampaignContent(nextTempNum, [
                ...state.history,
                {
                    campaignNumber: state.campaignNumber,
                    angleId: state.currentCampaign.angleId,
                    angleTitle: state.currentCampaign.angleTitle,
                    subject: state.currentCampaign.subject,
                    startedAt: state.startedAt,
                    totalSent: 0
                }
            ]);
            state.currentCampaign = newContent;
            await saveCampaignState(supabase, state);
            updatedState = state;
        }
        res.json({
            message: resetQueue
                ? `Yeni Kampanya #${updatedState.campaignNumber} (${updatedState.currentCampaign.angleTitle}) oluşturuldu ve alıcı listesi sıfırlandı.`
                : `Aktif kampanya metni yeni bir tema (${updatedState.currentCampaign.angleTitle}) ile güncellendi.`,
            campaignState: updatedState,
            previewHtml: buildMarketingEmailHtml(updatedState.currentCampaign)
        });
    }
    catch (err) {
        console.error('Marketing Rotate Error:', err);
        res.status(500).json({ error: 'Yeni kampanya oluşturulamadı.', details: err.message });
    }
});
// Endpoint: Add new emails to marketing_emails list (preserves existing sent status, queues new ones as sent=false)
app.post('/api/admin/marketing-add-emails', async (req, res) => {
    try {
        if (!(await verifyAdminRequest(req, res)))
            return;
        const { rawText } = req.body || {};
        if (!rawText || typeof rawText !== 'string') {
            return res.status(400).json({ error: 'Lütfen eklenecek e-posta listesini girin.' });
        }
        const lines = rawText
            .split(/[\r\n;]+/)
            .map((l) => l.replace(/"/g, '').trim())
            .filter((l) => l.length > 0);
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const validRowsMap = new Map();
        let invalidCount = 0;
        for (const line of lines) {
            const parts = line.split(',').map(p => p.trim());
            const email = (parts[0] || '').toLowerCase();
            // Skip CSV header if pasted
            if (email === 'email' || email === 'e-posta')
                continue;
            if (!emailRegex.test(email) || email.includes('..') || email.includes('.@') || email.startsWith('.')) {
                invalidCount++;
                continue;
            }
            const firstName = parts.length > 1 ? parts[1] : '';
            const lastName = parts.length > 2 ? parts.slice(2).join(' ') : '';
            validRowsMap.set(email, {
                email,
                first_name: firstName,
                last_name: lastName,
                sent: false
            });
        }
        const rowsToInsert = Array.from(validRowsMap.values());
        if (rowsToInsert.length === 0) {
            return res.status(400).json({ error: 'Geçerli bir e-posta adresi bulunamadı.', invalidCount });
        }
        const batchSize = 500;
        for (let i = 0; i < rowsToInsert.length; i += batchSize) {
            const batch = rowsToInsert.slice(i, i + batchSize);
            const { error } = await supabase
                .from('marketing_emails')
                .upsert(batch, { onConflict: 'email', ignoreDuplicates: true });
            if (error)
                throw error;
        }
        res.json({
            message: `${rowsToInsert.length} geçerli e-posta işlendi ve yeni adresler gönderim kuyruğuna eklendi.${invalidCount > 0 ? ` (${invalidCount} geçersiz satır atlandı)` : ''}`,
            processedCount: rowsToInsert.length,
            invalidCount
        });
    }
    catch (err) {
        console.error('Marketing Add Emails Error:', err);
        res.status(500).json({ error: 'E-postalar eklenirken hata oluştu.', details: err.message });
    }
});
// Automated Daily Marketing Email Cron Job
// Checks every hour between 10:00 and 18:00 Turkey Time; sends up to dailyLimit (100) emails/day automatically
cron.schedule('0 * * * *', async () => {
    try {
        const now = new Date();
        const trTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Istanbul" }));
        const hourOfDay = trTime.getHours();
        if (hourOfDay < 10 || hourOfDay > 18) {
            return;
        }
        console.log('📧 Cron: Checking Automated Marketing Email Queue...');
        const result = await sendMarketingBatch(supabase, { isAutoCron: true });
        if (result.sentCount > 0) {
            console.log(`📧 Cron: Auto-sent ${result.sentCount} marketing emails for Campaign #${result.campaignNumber} ("${result.subject}").`);
        }
        else {
            console.log(`📧 Cron: Marketing check skipped (${result.message})`);
        }
    }
    catch (err) {
        console.error('❌ Cron Marketing Auto-Send Error:', err.message || err);
    }
});
// Removed React routing wildcard from middle of file to place it at the end
// Endpoint: Manually trigger Job Bot
app.post('/api/trigger-bot', async (req, res) => {
    try {
        console.log('🤖 Manual Trigger: Starting Job Bot...');
        await runJobBot(supabase);
        res.json({ message: 'Job Bot triggered successfully. Check server logs for details.' });
    }
    catch (err) {
        console.error('Manual Trigger Error:', err);
        res.status(500).json({ error: 'Failed to trigger bot', details: err.message });
    }
});
// Job Bot Schedule (Every 20 minutes)
cron.schedule('*/20 * * * *', async () => {
    console.log('🤖 Cron Job: Triggering Job Bot...');
    await runJobBot(supabase);
});
// --- Push Notification Cron Jobs ---
// 1. Premium Expiry Warning (Daily at 10:00 AM)
cron.schedule('0 10 * * *', async () => {
    console.log('⏰ Cron: Checking Premium Expiry...');
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD
        // Find users whose premium expires tomorrow (simple string match on ISO date part might be tricky due to timezones, range is better)
        // Range: tomorrow 00:00 to tomorrow 23:59
        const rangeStart = `${tomorrowStr}T00:00:00.000Z`;
        const rangeEnd = `${tomorrowStr}T23:59:59.999Z`;
        const { data: expiringUsers, error } = await supabase
            .from('users')
            .select('uid, full_name, premium_until')
            .gte('premium_until', rangeStart)
            .lte('premium_until', rangeEnd);
        if (error) {
            console.error('❌ Failed to fetch expiring users:', error);
            return;
        }
        if (expiringUsers && expiringUsers.length > 0) {
            console.log(`⚠️ Founding ${expiringUsers.length} users expiring tomorrow.`);
            await Promise.all(expiringUsers.map(u => sendPushNotification({
                user_id: u.uid,
                title: 'Üyeliğiniz Sona Eriyor',
                body: 'Premium avantajlarını kaybetmemek için üyeliğinizi yenilemeyi unutmayın.',
                data: { type: 'premium_expiry' }
            })));
        }
    }
    catch (err) {
        console.error('Cron Expiry Error:', err);
    }
});
// 2. Job Application Window Timeout (Every minute)
// Notify Job Owner when the application period (5m or 15m) ends so they can select an applicant.
cron.schedule('* * * * *', async () => {
    // Logic: Find jobs created X minutes ago where status is still 'open' (or 'collecting_applications'?)
    // AvukatAgi jobs are 'open' until assigned.
    // Urgent: 5 mins, Normal: 15 mins.
    // We look for jobs created between (Now - Window - 1min) and (Now - Window) to trigger *once*.
    const now = Date.now();
    const oneMin = 60 * 1000;
    // Check for Normal Jobs (15 min window)
    // Created between 15-16 mins ago
    const win15_start = new Date(now - 15 * oneMin - oneMin).toISOString();
    const win15_end = new Date(now - 15 * oneMin).toISOString();
    // Check for Urgent Jobs (5 min window)
    const win5_start = new Date(now - 5 * oneMin - oneMin).toISOString();
    const win5_end = new Date(now - 5 * oneMin).toISOString();
    // We can do complex queries or just fetch active jobs and filter in memory if volume is low.
    // Let's use specific queries for efficiency.
    try {
        // Fetch potential timeout jobs
        // We need: created_at, job_type (to know if urgent), uid (owner), job_id
        // NOTE: 'urgent' status logic depends on fee or job details. Let's assume frontend logic 'Acil' maps to something.
        // Actually, user said: "acil işlerde 5dk, normal işlerde 15dk".
        // How do we know if it is urgent? 
        // Logic from CreateJob: If fee > X it might be urgent? Or `is_urgent` flag?
        // Looking at `notifyNewJob` logic, it doesn't explicitly save 'is_urgent'.
        // Assuming ALL jobs are 15 mins for now unless we find an 'urgent' field.
        // If 'job_type' contains 'Acil'? 
        // Let's implement generic 15 min notification for now.
        const { data: jobs, error } = await supabase
            .from('jobs')
            .select('job_id, user_id, city, courthouse, created_at, job_type')
            .eq('status', 'open')
            .gte('created_at', win15_start)
            .lte('created_at', win15_end);
        if (jobs && jobs.length > 0) {
            console.log(`⏳ Job Timeout Check: Found ${jobs.length} jobs passing 15m mark.`);
            await Promise.all(jobs.map(job => sendPushNotification({
                user_id: job.user_id, // Notify Owner
                title: 'Başvuru Süresi Doldu',
                body: `${job.city} ${job.courthouse} göreviniz için başvuruları inceleyip atama yapabilirsiniz.`,
                data: { jobId: job.job_id, type: 'job_timeout' }
            })));
        }
    }
    catch (err) {
        console.error('Job Timeout Cron Error:', err);
    }
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
            }
            else {
                await sendTelegramMessage(chatId, '👋 Merhaba! AvukatAğı botuna hoş geldiniz. Hesabınızı bağlamak için uygulamadaki "Ayarlar" sayfasından alacağınız kodu kullanın.');
            }
        }
        res.status(200).send('OK');
    }
    catch (err) {
        console.error('❌ Telegram Webhook Error:', err);
        // Always return 200 to Telegram to prevent retry loops
        res.status(200).send('OK');
    }
});
// --- Generate Link Code Endpoint ---
app.post('/api/telegram/link-code', async (req, res) => {
    const { token } = req.body;
    if (!token)
        return res.status(400).json({ error: 'Missing token' });
    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user)
            return res.status(401).json({ error: 'Unauthorized' });
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
    }
    catch (err) {
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
    }
    catch (err) {
        console.error('Webhook setup error:', err.message);
        res.status(500).json({ error: err.message });
    }
});
const port = process.env.PORT || 3001;
// --- Push Notifications Integration ---
import { sendPushNotification } from './services/pushService.js';
// Helper: Notify users of new job (Push)
// Called within /api/notify-new-job logic
async function sendNewJobPush(parsedJob) {
    try {
        if (!parsedJob.targetUsers || parsedJob.targetUsers.length === 0) {
            console.log(`📣 No users found in targetUsers for push notification.`);
            return;
        }
        console.log(`📣 Sending New Job Push to ${parsedJob.targetUsers.length} users.`);
        // Format Date (YYYY-MM-DD -> DD/MM/YYYY)
        let formattedDate = parsedJob.date;
        if (parsedJob.date && parsedJob.date.includes('-')) {
            const parts = parsedJob.date.split('-');
            if (parts.length === 3) {
                formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
        }
        // Rich Notification Content
        const timeStr = parsedJob.time ? `⏰ ${parsedJob.time}` : '';
        const title = `Yeni Görev: ${parsedJob.jobType}`;
        const body = `${parsedJob.city} - ${parsedJob.courthouse}\n📅 ${formattedDate} ${timeStr}\n💰 ${parsedJob.offeredFee} TL\nDetaylar için dokunun.`;
        // Use Promise.all for speed
        await Promise.all(parsedJob.targetUsers.map((uid) => sendPushNotification({
            user_id: uid,
            title,
            body,
            data: { jobId: parsedJob.jobId, type: 'new_job' }
        })));
    }
    catch (err) {
        console.error('❌ Push Logic Error inside sendNewJobPush:', err);
    }
}
// Update /api/notify-new-job to call this
// NOTE: We are patching the existing route handler logic below by redefining the route or injecting calls.
// Since I can't easily inject into the middle of the existing handler with 'replace_file_content' without replacing the whole block, 
// I will create a separate helper and call it. 
// However, the cleanest way is to MODIFY the existing route handler. 
// --- Admin Push Endpoint ---
app.post('/api/admin/send-push', async (req, res) => {
    const { userIds, title, body, filters } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Missing Authorization header' });
    }
    try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        // Logic: EITHER userIds OR filters must be provided
        let targetUserIds = [];
        if (userIds && Array.isArray(userIds) && userIds.length > 0) {
            targetUserIds = userIds;
        }
        else if (filters) {
            // Build query based on filters
            let query = supabase.from('users').select('uid');
            if (filters.isPremium !== undefined && filters.isPremium !== 'all') {
                // Assuming isPremium is boolean or 'true'/'false' string from frontend
                const isPremiumBool = filters.isPremium === true || filters.isPremium === 'true';
                query = query.eq('is_premium', isPremiumBool);
            }
            if (filters.city && filters.city !== '' && filters.city !== 'all') {
                query = query.eq('city', filters.city);
            }
            // Fetch users
            const { data: usersData, error: usersError } = await query;
            if (usersError) {
                console.error("Error fetching filtered users:", usersError);
                return res.status(500).json({ error: 'Error fetching users' });
            }
            if (usersData) {
                targetUserIds = usersData.map(u => u.uid);
            }
        }
        else {
            return res.status(400).json({ error: 'Invalid payload: Provide userIds or filters' });
        }
        if (!title || !body) {
            return res.status(400).json({ error: 'Invalid payload: Missing title or body' });
        }
        if (targetUserIds.length === 0) {
            return res.json({ sent: 0, message: "No users matching criteria found." });
        }
        console.log(`👮 Admin Push: Sending to ${targetUserIds.length} users (Requested by ${user.email}).`);
        // Chunking recommended for large batches, but Promise.all is okay for < 1000 for now.
        // Actually, let's limit it or chunk it if massive. For now, simple loop is fine.
        const results = await Promise.all(targetUserIds.map(uid => sendPushNotification({
            user_id: uid,
            title,
            body,
            data: { type: 'admin_msg' }
        })));
        res.json({ sent: results.length });
    }
    catch (err) {
        console.error('Admin Push Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Endpoint: Delete Account
app.post('/api/delete-account', async (req, res) => {
    const { uid, token } = req.body;
    if (!uid || !token) {
        return res.status(400).json({ error: 'Missing uid or token' });
    }
    try {
        // 1. Verify User Ownership
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user || user.id !== uid) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token or user mismatch.' });
        }
        console.log(`🗑️ Deleting account for user: ${uid}`);
        // Get current user details to preserve phone
        const { data: currentUser } = await supabase.from('users').select('phone').eq('uid', uid).single();
        const originalPhone = currentUser?.phone || 'unknown';
        // 2. Soft Delete / Anonymize Public Data (Preserve transaction history integrity)
        // We set email to a unique dummy value to release the original email.
        // We set phone to "DEL_originalPhone" to release the original phone valid format but keep record.
        const anonymizedEmail = `deleted_${uid}_${Date.now()}@avukatagi.net`;
        const anonymizedPhone = `DEL_${originalPhone}`;
        const { error: updateError } = await supabase
            .from('users')
            .update({
            full_name: 'Silinmiş Kullanıcı',
            email: anonymizedEmail,
            phone: anonymizedPhone,
            about_me: null,
            avatar_url: null,
            job_status: 'passive',
            telegram_chat_id: null,
            telegram_notifications_enabled: false,
            sms_notifications_enabled: false,
            // Optional: clear other PII
        })
            .eq('uid', uid);
        if (updateError) {
            console.error('Failed to anonymize user data:', updateError);
            return res.status(500).json({ error: 'Failed to clear user data.' });
        }
        // 3. Delete from Supabase Auth (This prevents login and effectively "deletes" the account access)
        // 3. Delete from Supabase Auth (This prevents login and effectively "deletes" the account access)
        const { error: deleteError } = await supabase.auth.admin.deleteUser(uid);
        if (deleteError) {
            console.error('Failed to delete auth user (likely due to FK constraints). Attempting Fallback (Ban & Email Release)...', deleteError);
            // FALLBACK: If we can't delete (due to relations), we MUST prevent login and release the old email from Auth.
            // 1. Update Auth Email to the anonymized one (so old email is free).
            // 2. Ban the user for 100 years.
            const { error: banError } = await supabase.auth.admin.updateUserById(uid, {
                email: anonymizedEmail,
                ban_duration: "876000h", // ~100 years
                user_metadata: { deleted: true }
            });
            if (banError) {
                console.error('CRITICAL: Failed to BAN user after deletion failure:', banError);
                return res.status(500).json({ error: 'Failed to delete or ban account. Please contact support.' });
            }
            console.log(`✅ User ${uid} BANNED and Email Anonymized (Fallback Success).`);
        }
        console.log(`✅ Account deleted successfully: ${uid}`);
        res.json({ success: true, message: 'Hesap başarıyla silindi ve veriler anonimleştirildi.' });
    }
    catch (err) {
        console.error('Delete Account Error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});
// --- REFERRAL SYSTEM ENDPOINTS ---
// 1. Generate Referral Code
app.post('/api/referral/generate', async (req, res) => {
    const { token } = req.body;
    if (!token)
        return res.status(401).json({ error: 'Missing token' });
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user)
            return res.status(401).json({ error: 'Unauthorized' });
        const uid = user.id;
        const { data: existingUser, error: checkError } = await supabase.from('users').select('referral_code').eq('uid', uid).single();
        if (checkError && checkError.code !== 'PGRST116')
            return res.status(500).json({ error: 'Database error' });
        if (existingUser && existingUser.referral_code) {
            return res.json({ referral_code: existingUser.referral_code });
        }
        let generatedCode;
        let isUnique = false;
        let attempts = 0;
        while (!isUnique && attempts < 5) {
            generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
            // Using update since the user row is created on signup via trigger
            const { error: updateError } = await supabase.from('users').update({ referral_code: generatedCode }).eq('uid', uid);
            // Ignore if 0 rows but no duplicate key error - actually if it fails uniquely it throws 23505 duplicate key
            if (!updateError) {
                // Confirm it was actually updated
                const { data: confirmCheck } = await supabase.from('users').select('referral_code').eq('uid', uid).single();
                if (confirmCheck && confirmCheck.referral_code === generatedCode) {
                    isUnique = true;
                }
                else if (!confirmCheck) {
                    return res.status(500).json({ error: 'User does not exist in users table yet.' });
                }
            }
            else if (updateError.code !== '23505') {
                return res.status(500).json({ error: 'Could not update user referral code.' });
            }
            else {
                attempts++;
            }
        }
        if (!isUnique)
            return res.status(500).json({ error: 'Could not generate a unique code, try again.' });
        res.json({ referral_code: generatedCode });
    }
    catch (err) {
        console.error('Error generating referral code:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 2. Apply Referral Code
app.post('/api/referral/apply', async (req, res) => {
    const { token, referralCode } = req.body;
    if (!token || !referralCode)
        return res.status(400).json({ error: 'Missing parameters' });
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user)
            return res.status(401).json({ error: 'Unauthorized' });
        const uid = user.id;
        const { data: currentUser, error: userError } = await supabase.from('users')
            .select('uid, referred_by, referral_code, is_premium, membership_type, premium_until, premium_plan')
            .eq('uid', uid)
            .single();
        if (userError || !currentUser)
            return res.status(500).json({ error: 'User not found' });
        if (currentUser.referred_by) {
            return res.status(400).json({ error: 'You have already used a referral code' });
        }
        if (currentUser.referral_code === referralCode) {
            return res.status(400).json({ error: 'You cannot use your own referral code' });
        }
        const { data: friendUser, error: friendError } = await supabase.from('users')
            .select('uid, is_premium, membership_type, premium_until, premium_plan')
            .eq('referral_code', referralCode)
            .single();
        if (friendError || !friendUser)
            return res.status(400).json({ error: 'Invalid referral code' });
        const extendPremium = (dbUser) => {
            let newUntil = dbUser.premium_until;
            const nowMs = Date.now();
            if (!newUntil || new Date(newUntil).getTime() < nowMs) {
                newUntil = new Date(nowMs + (30 * 24 * 60 * 60 * 1000)).toISOString();
            }
            else {
                newUntil = new Date(new Date(newUntil).getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString();
            }
            let newType = dbUser.membership_type;
            if (newType !== 'premium_plus')
                newType = 'premium';
            return { membership_type: newType, is_premium: true, premium_until: newUntil };
        };
        const currentUpdates = { ...extendPremium(currentUser), referred_by: friendUser.uid };
        const friendUpdates = extendPremium(friendUser);
        await supabase.from('users').update(currentUpdates).eq('uid', uid);
        await supabase.from('users').update(friendUpdates).eq('uid', friendUser.uid);
        res.json({ message: 'Referral applied successfully', premium_until: currentUpdates.premium_until });
    }
    catch (err) {
        console.error('Error applying referral:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 3. Get Referrals
app.post('/api/referral/list', async (req, res) => {
    const { token } = req.body;
    if (!token)
        return res.status(401).json({ error: 'Missing token' });
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user)
            return res.status(401).json({ error: 'Unauthorized' });
        const uid = user.id;
        const { data: referrals, error } = await supabase.from('users')
            .select('full_name, created_at')
            .eq('referred_by', uid)
            .order('created_at', { ascending: false });
        if (error)
            return res.status(500).json({ error: 'Database error' });
        res.json({ referrals: referrals || [] });
    }
    catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Handle React routing, return all requests to React app
// This must be the absolute last route
// --- JOB ASSIGNMENT AND REWARD ENDPOINT ---
app.post('/api/jobs/assign', async (req, res) => {
    const { token, jobId, applicationId, applicantId, applicantName, jobTitle } = req.body;
    if (!token || !jobId || !applicationId || !applicantId)
        return res.status(400).json({ error: 'Missing parameters' });
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user)
            return res.status(401).json({ error: 'Unauthorized' });
        // 1. Verify job ownership and status
        const { data: jobInfo, error: jobError } = await supabase.from('jobs').select('status, created_by').eq('job_id', jobId).single();
        if (jobError || !jobInfo)
            return res.status(404).json({ error: 'Job not found' });
        if (jobInfo.created_by !== user.id)
            return res.status(403).json({ error: 'Forbidden. Not your job.' });
        if (jobInfo.status !== 'open')
            return res.status(400).json({ error: 'Job is not open.' });
        // 2. Perform updates (Job to in_progress)
        const { error: jobUpdateError } = await supabase.from('jobs').update({
            selected_applicant: applicantId,
            status: 'in_progress'
        }).eq('job_id', jobId);
        if (jobUpdateError)
            throw jobUpdateError;
        // 3. Update application
        const { error: appUpdateError } = await supabase.from('applications').update({
            status: 'accepted'
        }).eq('application_id', applicationId);
        if (appUpdateError)
            throw appUpdateError;
        // 4. Notifications
        await supabase.from('notifications').insert([
            {
                user_id: applicantId,
                title: "Başvurunuz Kabul Edildi! 🎉",
                message: `Tebrikler! "${jobTitle}" görevi için seçildiniz. Görev sahibiyle iletişime geçebilirsiniz.`,
                type: "success",
                read: false,
                created_at: new Date().toISOString(),
                metadata: { jobId: jobId, type: 'application_accepted_applicant' }
            },
            {
                user_id: user.id,
                title: "Görev Atandı ✅ +15 Gün Premium",
                message: `"${jobTitle}" görevi Av. ${applicantName}'e atandı. Görev Verme Ödülü olarak +15 Gün Premium kazandınız.`,
                type: "info",
                read: false,
                created_at: new Date().toISOString(),
                metadata: { jobId: jobId, type: 'application_accepted_owner' }
            }
        ]);
        // 5. Reward Owner (+15 days)
        const { data: ownerData } = await supabase.from('users').select('is_premium, membership_type, premium_until').eq('uid', user.id).single();
        if (ownerData) {
            let newUntil = ownerData.premium_until;
            const nowMs = Date.now();
            if (!newUntil || new Date(newUntil).getTime() < nowMs) {
                newUntil = new Date(nowMs + (15 * 24 * 60 * 60 * 1000)).toISOString();
            }
            else {
                newUntil = new Date(new Date(newUntil).getTime() + (15 * 24 * 60 * 60 * 1000)).toISOString();
            }
            let newType = ownerData.membership_type;
            if (newType !== 'premium_plus')
                newType = 'premium';
            await supabase.from('users').update({
                membership_type: newType,
                is_premium: true,
                premium_until: newUntil
            }).eq('uid', user.id);
        }
        res.json({ success: true, message: 'Görev başarıyla atandı ve 15 gün premium kazandınız!' });
    }
    catch (err) {
        console.error('Error assigning job:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const escapeHtmlAttr = (str) => str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const buildFaqHtmlSection = (items = FAQ_ITEMS) => `<section><h2>Sıkça Sorulan Sorular</h2>${items
    .map(f => `<article><h3>${f.question}</h3><p>${f.answer}</p></article>`)
    .join('')}</section>`;
const buildFaqJsonLdScript = (items = FAQ_ITEMS) => `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer }
    }))
})}</script>`;
const PUBLIC_SEO_ROUTES = {
    '/': {
        title: "AvukatAğı — Türkiye'nin Avukat Tevkil ve Görev Paylaşım Platformu",
        description: "AvukatAğı (avukatagi.net), Türkiye'nin 81 ilindeki avukatları tek çatı altında buluşturan güvenli tevkil, duruşma takibi, icra ve dosya inceleme platformudur.",
        heading: "AvukatAğı — Meslektaşlarınızla Güçlerinizi Birleştirin",
        bodyHtml: `<p>AvukatAğı, Türkiye'nin 81 ilindeki tüm adliyelerde avukatlar arası güvenli görev paylaşımı (tevkil), duruşma takibi, icra işlemi, haciz ve dosya inceleme platformudur.</p><ul><li>81 il ve tüm adliyelerde anında meslektaş desteği</li><li>Anında SMS, Telegram (@AvukatAgiBot) ve mobil bildirim</li><li>15 dakikalık adil başvuru toplama ve meslektaş değerlendirme sistemi</li><li>Yeni üyelere özel 2 Ay Ücretsiz Beta Premium+</li></ul><nav><a href="/how-it-works">Nasıl Çalışır?</a> | <a href="/adliyeler">81 İl ve Adliyeler</a> | <a href="/sss">Sıkça Sorulan Sorular</a> | <a href="/yasal-mevzuat">Yasal Mevzuat</a> | <a href="/about">Hakkımızda</a> | <a href="/register">Ücretsiz Üye Ol</a> | <a href="/login">Giriş Yap</a></nav>${buildFaqHtmlSection(FAQ_ITEMS.slice(0, 7))}`,
        extraHead: buildFaqJsonLdScript(FAQ_ITEMS.slice(0, 7))
    },
    '/sss': {
        title: "Sıkça Sorulan Sorular (SSS) | AvukatAğı",
        description: "AvukatAğı tevkil sistemi, üyelik, ücretlendirme, yetki belgesi, bildirimler ve görev iptal kuralları hakkında sıkça sorulan sorular ve cevapları.",
        heading: "Sıkça Sorulan Sorular — AvukatAğı",
        bodyHtml: `<p>AvukatAğı platformu hakkında merak ettiğiniz tüm sorular ve yanıtları.</p>${buildFaqHtmlSection(FAQ_ITEMS)}`,
        extraHead: buildFaqJsonLdScript(FAQ_ITEMS)
    },
    '/adliyeler': {
        title: "81 İl ve Tüm Adliyeler Tevkil Rehberi | AvukatAğı",
        description: "Türkiye'nin 81 ilindeki tüm adliyeler için AvukatAğı tevkil ağı. Duruşma, icra, haciz ve dosya inceleme görevleri için adliyenizi seçin.",
        heading: "Türkiye Adliyeleri Tevkil Rehberi (81 İl)",
        bodyHtml: `<p>Türkiye genelindeki 81 il ve tüm adliyeler için AvukatAğı tevkil sayfaları:</p><ul>${ALL_SEO_ENTRIES.map(e => `<li><a href="/tevkil/${e.slug}">${e.type === 'city' ? `${e.city} Adliyeleri Tevkil` : `${e.courthouse} Tevkil (${e.city})`}</a></li>`).join('')}</ul>`
    },
    '/how-it-works': {
        title: "Nasıl Çalışır? | AvukatAğı",
        description: "AvukatAğı tevkil sistemi nasıl çalışır? 3 adımda görev oluşturun, başvurular arasından güvenilir meslektaşınızı seçin ve işinizi tamamlayın.",
        heading: "AvukatAğı Nasıl Çalışır?",
        bodyHtml: `<p>1. Görev Oluştur: Şehir, adliye, tarih ve ücreti belirterek saniyeler içinde tevkil ilanı açın. 2. Avukat Seç: Başvuru süresi sonunda uzmanlık ve puanlara göre en uygun meslektaşı seçin. 3. İşi Tamamla: WhatsApp veya telefon ile iletişim kurup süreci güvenle tamamlayın.</p>`
    },
    '/yasal-mevzuat': {
        title: "Yasal Mevzuat ve Baro Kuralları | AvukatAğı",
        description: "AvukatAğı platformunun 1136 sayılı Avukatlık Kanunu, TBB Meslek Kuralları ve KVKK uyumluluğu hakkında bilgilendirme.",
        heading: "Yasal Mevzuat ve Mesleki Uyum",
        bodyHtml: `<p>AvukatAğı yalnızca baro levhasına kayıtlı avukatların mesleki yardımlaşma ve tevkil süreçlerini kolaylaştırmak amacıyla Avukatlık Kanunu ve TBB Meslek Kuralları çerçevesinde hizmet verir.</p>`
    },
    '/about': {
        title: "Hakkımızda | AvukatAğı",
        description: "Türkiye'nin avukatlar arası dijital tevkil ve mesleki dayanışma ağı AvukatAğı hakkında detaylı bilgi.",
        heading: "AvukatAğı Hakkında",
        bodyHtml: `<p>AvukatAğı, avukatların adliye dışı ve şehir dışı duruşma, icra, haciz ve dosya inceleme süreçlerinde zaman ve maliyet tasarrufu sağlaması için geliştirilmiş profesyonel bir hukuk ağıdır.</p>`
    },
    '/register': {
        title: "Ücretsiz Üye Ol | AvukatAğı",
        description: "AvukatAğı'na ücretsiz kayıt olun, 2 Ay Ücretsiz Beta Premium+ ayrıcalığı ile 81 ildeki tevkil görevlerine erişin.",
        heading: "AvukatAğı'na Ücretsiz Kayıt Olun",
        bodyHtml: `<p>Baro sicil bilgilerinizle ücretsiz kayıt olarak hem tevkil ilanı açabilir hem de izlediğiniz adliyelerdeki açık görevlere başvurabilirsiniz.</p>`
    },
    '/login': {
        title: "Giriş Yap | AvukatAğı",
        description: "AvukatAğı hesabınıza giriş yapın ve açık tevkil görevlerini görüntüleyin.",
        heading: "AvukatAğı Giriş",
        bodyHtml: `<p>AvukatAğı avukat paneline giriş yapın.</p>`
    },
    '/terms': {
        title: "Kullanım Koşulları | AvukatAğı",
        description: "AvukatAğı platformu kullanım koşulları ve üyelik şartları.",
        heading: "Kullanım Koşulları",
        bodyHtml: `<p>AvukatAğı kullanım koşulları ve yasal şartlar.</p>`
    },
    '/privacy': {
        title: "Gizlilik Politikası ve KVKK | AvukatAğı",
        description: "AvukatAğı kişisel verilerin korunması (KVKK) ve gizlilik politikası.",
        heading: "Gizlilik Politikası",
        bodyHtml: `<p>AvukatAğı gizlilik politikası ve KVKK aydınlatma metni.</p>`
    },
    '/distance-sales-agreement': {
        title: "Mesafeli Satış Sözleşmesi | AvukatAğı",
        description: "AvukatAğı Premium ve Premium+ üyelik paketleri mesafeli satış sözleşmesi.",
        heading: "Mesafeli Satış Sözleşmesi",
        bodyHtml: `<p>AvukatAğı platformu üyelik paketlerine ilişkin mesafeli satış sözleşmesi ve bilgilendirme metni.</p>`
    }
};
function getCourthouseSeoMeta(cleanPath) {
    if (PUBLIC_SEO_ROUTES[cleanPath]) {
        return PUBLIC_SEO_ROUTES[cleanPath];
    }
    if (cleanPath.startsWith('/tevkil/')) {
        const slug = cleanPath.replace('/tevkil/', '');
        const entry = getSeoEntryBySlug(slug);
        if (!entry)
            return undefined;
        const isCity = entry.type === 'city';
        const displayName = isCity ? `${entry.city} Adliyeleri` : entry.courthouse;
        const title = isCity
            ? `${entry.city} Tevkil Platformu — ${entry.city} Avukat Görev Paylaşımı | AvukatAğı`
            : `${entry.courthouse} Tevkil — ${entry.city} Avukat Görevlendirme | AvukatAğı`;
        const description = isCity
            ? `${entry.city} ili ve ilçelerindeki tüm adliyelerde duruşma, icra, haciz ve dosya inceleme için AvukatAğı üzerinden güvenle tevkil verin veya görev alın.`
            : `${entry.courthouse} (${entry.city}) için duruşma, icra işlemi, haciz ve dosya inceleme tevkil görevleri. Baro kayıtlı meslektaşlarla anında görev paylaşımı yapın.`;
        const canonical = `https://avukatagi.net/tevkil/${entry.slug}`;
        const siblingLinks = entry.courthousesInCity
            .filter(ch => ch !== entry.courthouse)
            .map(ch => `<li><a href="/tevkil/${getCourthouseSlug(entry.city, ch)}">${ch} Tevkil</a></li>`)
            .join('');
        const localFaqs = [
            {
                q: `${displayName} için tevkil görevi nasıl oluşturulur?`,
                a: `AvukatAğı'na ücretsiz üye olduktan sonra ${entry.city}${isCity ? '' : ` / ${entry.courthouse}`} seçimi yaparak saniyeler içinde ücretsiz tevkil ilanı oluşturabilirsiniz.`
            },
            {
                q: `${displayName} görevlerinden anlık bildirim nasıl alırım?`,
                a: `Ayarlar bölümünden ${displayName} tercihinizi ekleyerek yeni görev açıldığında anında SMS, Telegram (@AvukatAgiBot) ve mobil bildirim alabilirsiniz.`
            }
        ];
        const extraHead = `<script type="application/ld+json">${JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LegalService',
            name: `AvukatAğı — ${displayName} Tevkil Ağı`,
            description,
            url: canonical,
            areaServed: { '@type': 'City', name: entry.city },
            provider: { '@type': 'Organization', name: 'AvukatAğı', url: 'https://avukatagi.net/' }
        })}</script>`;
        return {
            title,
            description,
            heading: `${displayName} Tevkil ve Avukat Görevlendirme Ağı`,
            bodyHtml: `<p>${description}</p><ul><li>Duruşma Temsili (900 TL+)</li><li>Haciz ve Dosya İnceleme (700 TL+)</li><li>İcra İşlemleri (600 TL+)</li><li>Dilekçe ve Adliye Dışı İşlemler</li></ul>${localFaqs.map(f => `<article><h3>${f.q}</h3><p>${f.a}</p></article>`).join('')}${siblingLinks ? `<section><h2>${entry.city} İlindeki Diğer Adliyeler</h2><ul>${siblingLinks}</ul></section>` : ''}<p><a href="/register">Ücretsiz Üye Ol</a> | <a href="/adliyeler">Tüm Adliyeler</a></p>`,
            extraHead
        };
    }
    return undefined;
}
let cachedIndexHtml = null;
app.get(/.*/, (req, res) => {
    if (/\.(js|css|png|jpe?g|svg|ico|webp|woff2?|map)$/i.test(req.path)) {
        console.warn(`⚠️  MISSING ASSET: 404 for ${req.url}`);
        return res.status(404).send('Not Found');
    }
    const indexPath = path.join(__dirname, '../dist', 'index.html');
    if (!cachedIndexHtml && fs.existsSync(indexPath)) {
        cachedIndexHtml = fs.readFileSync(indexPath, 'utf8');
    }
    if (!cachedIndexHtml) {
        return res.sendFile(indexPath);
    }
    const cleanPath = req.path === '/' ? '/' : req.path.replace(/\/+$/, '');
    const seo = getCourthouseSeoMeta(cleanPath);
    let html = cachedIndexHtml;
    if (seo) {
        const canonical = `https://avukatagi.net${cleanPath === '/' ? '/' : cleanPath}`;
        const safeTitle = escapeHtmlAttr(seo.title);
        const safeDesc = escapeHtmlAttr(seo.description);
        html = html
            .replace(/<title>.*?<\/title>/, `<title>${safeTitle}</title>`)
            .replace(/<meta name="description"[\s\S]*?\/>/, `<meta name="description" content="${safeDesc}" />`)
            .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
            .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${safeTitle}" />`)
            .replace(/<meta property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${safeDesc}" />`)
            .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
            .replace(`<div id="root"></div>`, `<div id="root"><main style="max-width:800px;margin:40px auto;padding:20px;font-family:sans-serif"><h1>${seo.heading}</h1>${seo.bodyHtml}</main></div>`);
        if (seo.extraHead) {
            html = html.replace('</head>', `${seo.extraHead}\n</head>`);
        }
    }
    else {
        html = html.replace(`<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />`, `<meta name="robots" content="noindex, nofollow" />`);
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

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

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the dist directory (one level up from src where server.cjs resides)
app.use(express.static(path.join(__dirname, '../dist')));

// Initialize Supabase Admin Client
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper to send SMS via NetGSM XML API
// Helper to send SMS via NetGSM XML API
async function sendSms(phone: string, message: string) {
    try {
        // Clean phone number (remove spaces, ensure 10 digits if possible, or 90 prefix)
        const cleanPhone = phone.replace(/\D/g, '');

        // NetGSM REST API v2 - XML format
        const url = 'https://api.netgsm.com.tr/sms/send/xml';

        const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<mainbody>
    <header>
        <company dil="TR">Netgsm</company>
        <usercode>${process.env.NETGSM_USERNAME}</usercode>
        <password>${process.env.NETGSM_PASSWORD}</password>
        <type>1:n</type>
        <msgheader>${process.env.NETGSM_HEADER}</msgheader>
    </header>
    <body>
        <msg><![CDATA[${message}]]></msg>
        <no>${cleanPhone}</no>
    </body>
</mainbody>`;

        console.log(`📱 Sending SMS to ${cleanPhone} via XML API...`);

        const response = await axios.post(url, xmlData, {
            headers: {
                'Content-Type': 'application/xml'
            }
        });

        const responseCode = response.data.toString().trim().substring(0, 2);

        if (responseCode === '00' || responseCode === '01') {
            console.log(`✅ SMS sent successfully to ${cleanPhone}. Code: ${responseCode}`);
            return { success: true, code: responseCode, data: response.data };
        } else {
            console.log(`❌ SMS failed to ${cleanPhone}. Code: ${responseCode}`);
            return { success: false, code: responseCode, data: response.data };
        }
    } catch (error: any) {
        console.error(`❌ Error sending SMS to ${phone}:`, error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
        }
        return { success: false, error: error.message };
    }
}

// Cron Job: Run Job Bot every hour
cron.schedule('0 * * * *', () => {
    console.log('🤖 Running Job Bot...');
    runJobBot(supabase);
});

// Cron Job: Check for expired premium memberships daily at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily premium expiration check...');
    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from('users')
        .update({
            is_premium: false,
            membership_type: 'free',
            premium_plan: null,
            premium_price: null,
            premium_since: null,
            premium_until: null
        })
        .lt('premium_until', now)
        .eq('is_premium', true)
        .select();

    if (error) {
        console.error('Error checking expired memberships:', error);
    } else {
        console.log(`Expired memberships updated: ${data?.length || 0} users reverted to free.`);
    }
});

// Admin Bot Status Endpoints
app.get('/api/admin/bot-status', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('system_settings')
            .select('value')
            .eq('key', 'job_bot_enabled')
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        const enabled = data?.value === 'true' || data?.value === true;
        res.json({ enabled });
    } catch (error: any) {
        console.error('Error fetching bot status:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/admin/bot-status', async (req, res) => {
    try {
        const { enabled } = req.body;
        const { error } = await supabase
            .from('system_settings')
            .upsert({
                key: 'job_bot_enabled',
                value: String(enabled),
                updated_at: new Date().toISOString()
            });

        if (error) throw error;
        res.json({ success: true, enabled });
    } catch (error: any) {
        console.error('Error updating bot status:', error);
        res.status(500).json({ error: error.message });
    }
});

// Manual trigger for testing expiration check
app.post("/api/cron/check-expiration", async (req, res) => {
    console.log('Manual premium expiration check triggered...');
    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from('users')
        .update({
            is_premium: false,
            membership_type: 'free',
            premium_plan: null,
            premium_price: null,
            premium_since: null,
            premium_until: null
        })
        .lt('premium_until', now)
        .eq('is_premium', true)
        .select();

    if (error) {
        console.error('Error checking expired memberships:', error);
        res.status(500).json({ error: error.message });
    } else {
        console.log(`Expired memberships updated: ${data?.length} users reverted to free.`);
        res.json({ message: "Expiration check completed", updatedCount: data?.length });
    }
});

// Endpoint: Notify users about a new job
app.post('/api/notify-new-job', async (req, res) => {
    const { city, courthouse, jobType, jobId, createdBy, date, offeredFee } = req.body;
    console.log('📨 SMS Request received:', { city, courthouse, jobType, createdBy, date, offeredFee });

    if (!courthouse || !jobType) {
        console.log('❌ Missing required fields');
        return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(`✅ New Job Notification Triggered: ${courthouse} - ${jobType}`);

    try {
        // 1. Find Premium/Premium+ users
        let query = supabase
            .from('users')
            .select('uid, phone, full_name, membership_type, preferred_courthouses')
            .in('membership_type', ['premium', 'premium_plus'])
            .not('phone', 'is', null);

        const { data: users, error } = await query;

        if (error) {
            console.error('❌ Error fetching users:', error);
            return res.status(500).json({ error: error.message });
        }

        console.log(`📊 Total premium users found: ${users?.length || 0}`);
        if (!users || users.length === 0) {
            console.log('⚠️ No premium users found.');
            return res.json({ message: 'No users to notify', count: 0 });
        }

        // Helper to normalize strings for comparison (robust, generic and diacritic-insensitive)
        const normalizeString = (str: string) => {
            if (!str) return '';
            // 1. Turkish-aware lowercase (handles İ/i, I/ı correctly)
            let s = str.toLocaleLowerCase('tr-TR');
            // 2. Normalize unicode and strip diacritics (ğ, ü, ş, ö, ç, ı vs.)
            s = s.normalize('NFD').replace(/\p{Diacritic}/gu, '');
            // 3. Normalize again to composed form
            s = s.normalize('NFC');
            // 4. Trim and collapse multiple spaces
            s = s.trim().replace(/\s+/g, ' ');
            return s;
        };

        // 2. Filter users by courthouse preference
        const targetCourthouse = normalizeString(courthouse);
        console.log(`🔍 Filtering users for courthouse: '${courthouse}'`);
        console.log(`   Normalized Target: '${targetCourthouse}'`);

        // Helper: remove parentheses and their content for a more relaxed comparison
        const stripParentheses = (str: string) => {
            if (!str) return '';
            return str.replace(/\([^)]*\)/g, '').trim().replace(/\s+/g, ' ');
        };

        const targetCourthouseStripped = stripParentheses(targetCourthouse);

        const usersToNotify = users.filter((user: any) => {
            try {
                const prefs = user.preferred_courthouses;

                if (!prefs) {
                    return false;
                }

                let userCourthouses: string[] = [];

                // Normalize user preferences into an array of plain strings
                if (Array.isArray(prefs)) {
                    userCourthouses = prefs.map((p: any) => {
                        if (typeof p === 'string') return p;
                        if (p && typeof p === 'object') {
                            // Common patterns if JSONB is used: { name: '...' } / { label: '...' }
                            return p.name || p.label || '';
                        }
                        return '';
                    }).filter(Boolean);
                } else if (typeof prefs === 'string') {
                    const trimmed = prefs.trim();
                    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                        // JSON array as text
                        try {
                            const parsed = JSON.parse(trimmed);
                            if (Array.isArray(parsed)) {
                                userCourthouses = parsed.map((p: any) => {
                                    if (typeof p === 'string') return p;
                                    if (p && typeof p === 'object') return p.name || p.label || '';
                                    return '';
                                }).filter(Boolean);
                            } else {
                                userCourthouses = [trimmed];
                            }
                        } catch (e) {
                            userCourthouses = [trimmed];
                        }
                    } else if (trimmed.includes(',')) {
                        // Comma separated list
                        userCourthouses = trimmed.split(',').map(s => s.trim()).filter(Boolean);
                    } else {
                        // Single courthouse as plain text
                        userCourthouses = [trimmed];
                    }
                }

                // Check for match: generic rule for all courthouses (handles parentheses variations)
                const isMatch = userCourthouses.some(c => {
                    if (typeof c !== 'string') return false;
                    const normalizedPref = normalizeString(c);
                    const normalizedPrefStripped = stripParentheses(normalizedPref);

                    // Exact match
                    if (normalizedPref === targetCourthouse) return true;

                    // Match when one side has extra parentheses detail (e.g. "... (merkez)")
                    if (normalizedPrefStripped && normalizedPrefStripped === targetCourthouseStripped) return true;

                    return false;
                });

                if (isMatch) {
                    console.log(`   ✅ Match found: ${user.full_name} (${user.phone})`);
                }

                return isMatch;
            } catch (filterError: any) {
                console.error(`❌ Error filtering user ${user.full_name}:`, filterError.message);
                return false;
            }
        });

        console.log(`🎯 Users matching courthouse '${targetCourthouse}': ${usersToNotify.length}`);

        if (usersToNotify.length === 0) {
            return res.json({ message: 'No matching users for this courthouse', count: 0 });
        }

        // 3. Send SMS to filtered users
        // Format date if present
        let dateStr = '';
        if (date) {
            try {
                // Assuming date is YYYY-MM-DD
                const [y, m, d] = date.split('-');
                dateStr = `${d}.${m}.${y} tarihli, `;
            } catch (e) {
                dateStr = `${date} tarihli, `;
            }
        }

        const feeStr = offeredFee ? `${offeredFee} TL ücretli ` : '';

        const message = `Sayın Meslektaşımız, ${courthouse} adliyesinde, ${dateStr}${feeStr}yeni bir ${jobType} görevi açıldı. Hemen incelemek için AvukatAğı uygulamasını ziyaret ediniz.`;

        let sentCount = 0;
        for (const user of usersToNotify) {
            if (user.phone) {
                console.log(`📱 Sending SMS to ${user.full_name} (${user.phone})`);
                const result = await sendSms(user.phone, message);
                if (result) {
                    sentCount++;
                    console.log(`✅ SMS sent successfully to ${user.phone}`);
                } else {
                    console.log(`❌ Failed to send SMS to ${user.phone}`);
                }
            }
        }

        res.json({ message: 'Notifications sent', count: sentCount, totalTargets: usersToNotify.length });

    } catch (err: any) {
        console.error('❌ SERVER ERROR in /api/notify-new-job:');
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        console.error('Request body:', req.body);
        res.status(500).json({ error: 'Internal server error', details: err.message });
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

// Endpoint: Delete user account
app.post('/api/delete-account', async (req, res) => {
    const { uid, token } = req.body;

    if (!uid) {
        return res.status(400).json({ error: 'Missing uid' });
    }

    try {
        // Optional: Verify the token matches the uid if provided
        if (token) {
            const { data: { user }, error } = await supabase.auth.getUser(token);
            if (error || !user || user.id !== uid) {
                return res.status(401).json({ error: 'Unauthorized: Token invalid or does not match uid' });
            }
        }

        console.log(`🗑️ Deleting user account: ${uid}`);

        // Delete the user from Supabase Auth
        const { error } = await supabase.auth.admin.deleteUser(uid);

        if (error) {
            console.error('❌ Error deleting user:', error);
            return res.status(500).json({ error: error.message });
        }

        console.log(`✅ User deleted successfully: ${uid}`);
        res.json({ message: 'Account deleted successfully' });

    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
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

            const fs = require('fs');
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
            const fs = require('fs');
            fs.appendFileSync('debug_log.txt', `\n--- Supabase Update Skipped ---\nApproved: ${result.approved}\nUserId: ${userId}\n-------------------------------\n`);
        }

        res.json(result);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: "Garanti test sale failed", details: err?.message });
    }
});

// Handle React routing, return all requests to React app
// This must be the last route
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

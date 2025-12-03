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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the dist directory (one level up from src where server.js resides)
app.use(express.static(path.join(__dirname, '../dist')));

// Initialize Supabase Admin Client
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

import { sendSms, notifyNewJob } from "./services/notificationService.js";

// ... (existing imports)

// Endpoint: Notify users about a new job
app.post('/api/notify-new-job', async (req, res) => {
    const { city, courthouse, jobType, jobId, createdBy, date, offeredFee } = req.body;

    const result = await notifyNewJob(supabase, {
        city,
        courthouse,
        jobType,
        jobId,
        createdBy,
        date,
        offeredFee
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

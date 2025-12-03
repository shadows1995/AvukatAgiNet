import express from "express";
import bodyParser from "body-parser";
import { sendSaleRequest } from "./garantiClient.cjs";
import dotenv from "dotenv";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Supabase Admin Client
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

import cron from 'node-cron';

// Daily check for expired memberships (runs at midnight)
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily premium expiration check...');
    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
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
        console.log(`Expired memberships updated: ${data.length} users reverted to free.`);
    }
});

// Manual trigger for testing expiration check
app.post("/api/cron/check-expiration", async (req, res) => {
    console.log('Manual premium expiration check triggered...');
    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
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

app.get("/", (req, res) => {
    res.send("Garanti BBVA Test Server is running.");
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
            amountMajor: parseFloat(amount), // e.g. "100.00"
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
                premium_until: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString(),
                updated_at: new Date().toISOString(),
                billing_address: billingInfo?.address,
                tc_id: billingInfo?.tcId
            };

            const fs = require('fs');
            fs.appendFileSync('debug_log.txt', `\n--- Supabase Update Attempt ---\nUser: ${userId}\nPlan: ${plan}\nData: ${JSON.stringify(updateData, null, 2)}\n`);

            const { data, error } = await supabaseAdmin.from('users').update(updateData).eq('uid', userId).select();

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

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Manual .env parsing (to avoid dotenv dependency issues)
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '../.env');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            const env = {};
            content.split('\n').forEach(line => {
                const parts = line.split('=');
                if (parts.length >= 2 && !line.trim().startsWith('#')) {
                    const key = parts[0].trim();
                    const value = parts.slice(1).join('=').trim();
                    env[key] = value;
                }
            });
            return env;
        }
    } catch (e) {
        console.error('⚠️ Could not read .env file:', e.message);
    }
    return {};
}

const env = loadEnv() as any;
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY;
const API_URL = 'https://www.avukatagi.net/api/send-sms';

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials in .env');
    process.exit(1);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
    console.log('--- 🧪 Live SMS DEBUG Script (No Deps - ESM) ---');
    console.log('Using Node.js native fetch');
    console.log('Target API:', API_URL);
    console.log('Supabase URL:', SUPABASE_URL);

    // 1. Authenticate via REST API (No supabase-js needed)
    console.log('\n🔐 Please log in to Supabase:');
    const email = await askQuestion('Email: ');
    const password = await askQuestion('Password: ');

    console.log(`\n⏳ Logging in as ${email}...`);

    try {
        const authUrl = `${SUPABASE_URL}/auth/v1/token?grant_type=password`;
        const authResp = await fetch(authUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY
            },
            body: JSON.stringify({ email, password })
        });

        const authData = await authResp.json();

        if (!authResp.ok) {
            console.error('❌ Login failed:', authData.error_description || authData.msg || 'Unknown error');
            process.exit(1);
        }

        console.log('✅ Login successful! Token received.');
        const token = authData.access_token;

        // 2. Prepare Data
        const phone = await askQuestion('\n📱 Enter phone number (e.g. 5551234567): ');
        const message = await askQuestion('💬 Enter message content: ');

        // 3. Send Request
        console.log(`\n📨 Sending request to ${API_URL}...`);

        const smsResp = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ phone, message })
        });

        console.log(`\nSTATUS: ${smsResp.status} ${smsResp.statusText}`);
        const smsText = await smsResp.text();
        console.log('BODY:', smsText);

        try {
            const json = JSON.parse(smsText);
            if (smsResp.ok && json.success) {
                console.log('\n✅ TEST PASSED: SMS sent successfully.');
            } else {
                console.log('\n❌ TEST FAILED: Server returned error.');
            }
        } catch (e) {
            console.log('\n⚠️ Response is not JSON.');
        }

    } catch (err) {
        console.error('\n❌ NETWORK ERROR:', err.message);
        if (err.cause) console.error('Cause:', err.cause);
    }

    rl.close();
}

main();

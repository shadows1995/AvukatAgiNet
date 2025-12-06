const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const dotenv = require('dotenv');
const readline = require('readline');

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';
const API_URL = 'https://www.avukatagi.net/api/send-sms';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
    console.log('--- 🧪 Live SMS Test Script (CJS) ---');
    console.log('Target API:', API_URL);

    // 1. Authenticate
    console.log('\n🔐 Please log in to Supabase (needs a valid user email/pass):');
    const email = await askQuestion('Email: ');
    const password = await askQuestion('Password: ');

    console.log(`\n⏳ Logging in as ${email}...`);
    const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (authError || !session) {
        console.error('❌ Login failed:', authError?.message);
        process.exit(1);
    }

    console.log('✅ Login successful! Token received.');
    const token = session.access_token;

    // 2. Prepare Data
    const phone = await askQuestion('\n📱 Enter phone number to send SMS to (e.g. 5551234567): ');
    const message = await askQuestion('💬 Enter message content: ');

    // 3. Send Request
    console.log(`\n📨 Sending request to ${API_URL}...`);

    try {
        const response = await axios.post(API_URL, {
            phone,
            message
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            validateStatus: () => true
        });

        console.log(`\nSTATUS: ${response.status} ${response.statusText}`);
        console.log('BODY:', JSON.stringify(response.data, null, 2));

        if (response.status === 200 && response.data.success) {
            console.log('\n✅ TEST PASSED: SMS sent successfully.');
        } else {
            console.log('\n❌ TEST FAILED: Server returned error.');
        }

    } catch (err) {
        console.error('\n❌ NETWORK/CLIENT ERROR:', err.message);
    }

    rl.close();
}

main();

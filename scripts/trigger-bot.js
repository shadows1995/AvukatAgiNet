import { createClient } from '@supabase/supabase-js';
import { runJobBot } from '../src/services/jobBot.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🚀 Manually triggering Job Bot...');

// Force enable for this test run if needed, or just rely on the function's check
// We will temporarily update the setting to true to ensure it runs, then revert if needed
// But runJobBot checks the DB, so let's just run it. 
// If it skips because of settings, the log will say so.

runJobBot(supabase)
    .then(() => {
        console.log('✅ Job Bot execution finished.');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Job Bot execution failed:', err);
        process.exit(1);
    });

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { runJobBot } from "../src/services/jobBot.ts";
import path from "path";
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

import fs from 'fs';
import util from 'util';

const logFile = fs.createWriteStream('bot_test.log', { flags: 'w' });
const logStdout = process.stdout;

console.log = function (...args) {
    logFile.write(util.format(...args) + '\n');
    logStdout.write(util.format(...args) + '\n');
};

console.error = function (...args) {
    logFile.write(util.format(...args) + '\n');
    logStdout.write(util.format(...args) + '\n');
};

console.log('🚀 Starting Job Bot Test...');

runJobBot(supabase).then(() => {
    console.log('✅ Job Bot Test Completed.');
}).catch((err) => {
    console.error('❌ Job Bot Test Failed:', err);
});

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { runJobBot } from "./src/services/jobBot.js";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🚀 Starting Job Bot Test Wrapper...');

try {
    await runJobBot(supabase);
    console.log('✅ Job Bot logic finished.');
} catch (err) {
    console.error('❌ Job Bot threw error:', err);
}

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY; // Use Anon key to simulate frontend

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testToggle() {
    console.log("🔐 Logging in as Bot Admin...");

    const { data: { user }, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'bot@avukatagi.net',
        password: 'bot-secure-password-123!'
    });

    if (loginError || !user) {
        console.error("❌ Login failed:", loginError);
        return;
    }

    console.log("✅ Logged in as:", user.email);

    console.log("📝 Trying to update 'job_bot_enabled'...");

    const { data, error } = await supabase
        .from('system_settings')
        .upsert({
            key: 'job_bot_enabled',
            value: 'true',
            updated_at: new Date().toISOString()
        })
        .select();

    if (error) {
        console.error("❌ Update failed (Likely RLS):", error);
    } else {
        console.log("✅ Update successful:", data);
    }
}

testToggle();

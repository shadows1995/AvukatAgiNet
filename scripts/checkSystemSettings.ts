import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSettings() {
    console.log("🔍 Checking 'system_settings' table...");

    // 1. Try to select
    const { data, error } = await supabase
        .from('system_settings')
        .select('*');

    if (error) {
        console.error("❌ Error selecting from system_settings:", error);
    } else {
        console.log("✅ Table exists. Rows:", data);
    }

    // 2. Try to upsert
    console.log("📝 Trying to upsert 'job_bot_enabled'...");
    const { data: upsertData, error: upsertError } = await supabase
        .from('system_settings')
        .upsert({
            key: 'job_bot_enabled',
            value: 'true',
            updated_at: new Date().toISOString()
        })
        .select();

    if (upsertError) {
        console.error("❌ Error upserting:", upsertError);
    } else {
        console.log("✅ Upsert successful:", upsertData);
    }
}

checkSettings();

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

async function checkRLS() {
    console.log("🔍 Checking RLS policies for 'system_settings'...");

    const { data, error } = await supabase
        .rpc('get_policies_for_table', { table_name: 'system_settings' });

    if (error) {
        // Fallback: try to fetch policies from pg_policies if RPC not available
        console.log("⚠️ RPC failed, trying direct query on pg_policies (requires admin)...");
        // This might fail if we don't have direct SQL access via client, but let's try
        // Actually, we can't run SQL directly via JS client without an RPC.
        // So we will just try to create a policy if one doesn't exist.
        console.log("❌ Cannot list policies directly via JS client without custom RPC.");
    } else {
        console.log("📋 Policies:", data);
    }
}

// Since we can't easily list policies, let's just create a SQL file to fix them.
console.log("💡 Creating SQL to fix RLS...");

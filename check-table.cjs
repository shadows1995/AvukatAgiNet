const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runTest() {
    console.log("Checking marketing_emails table...");
    const { data: emails, count, error: countError } = await supabase
        .from('marketing_emails')
        .select('*', { count: 'exact', head: true });
        
    if (countError) {
        console.error("❌ marketing_emails table error:", countError.message);
    } else {
        console.log("✅ marketing_emails table exists. Row count:", count);
    }
}

runTest();

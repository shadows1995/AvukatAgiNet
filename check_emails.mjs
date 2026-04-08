import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkEmails() {
    const { data: unsentEmails, error } = await supabase
        .from('marketing_emails')
        .select('*')
        .eq('sent', false)
        .limit(100);

    if (error) {
        console.error("DB Error:", error);
        return;
    }

    console.log(`Checking ${unsentEmails.length} emails...`);
    let invalidCount = 0;
    
    // Regular expression for simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    unsentEmails.forEach(e => {
        if (!emailRegex.test(e.email)) {
            console.log(`Invalid email found: "${e.email}"`);
            invalidCount++;
        }
    });

    console.log(`Found ${invalidCount} invalid emails.`);
    if (invalidCount === 0) {
        console.log("Simulating Mailtrap request...");
        
        const MAILTRAP_TOKEN = '6f03fcbc60f27b98ec05e5bc932eb05c';
        const payload = {
            from: { email: "hello@avukatagi.net", name: "AvukatAğı" },
            to: unsentEmails.map((e) => ({ email: e.email, name: `${e.first_name || ''} ${e.last_name || ''}`.trim() })),
            template_uuid: "029f73fa-3a7a-4850-a6ab-4241898bd502",
            template_variables: {}
        };

        console.log("Investigating to[9]:", JSON.stringify(payload.to[9]));
        try {
            import('fs').then(fs => fs.writeFileSync('fetch_result.txt', `to[9] is: ${JSON.stringify(payload.to[9])}`, 'utf8'));
        } catch (e) {
            console.error(e);
        }
    }
}

checkEmails();

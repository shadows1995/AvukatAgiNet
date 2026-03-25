import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function importCsv() {
    try {
        const filePath = path.resolve('istanbul_email_only_with_names_v2.csv');
        console.log("Reading CSV from:", filePath);
        
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n').filter(line => line.trim().length > 0);
        
        const headers = lines[0].split(',');
        console.log("Headers detected:", headers);
        
        let validRows = [];
        let errorCount = 0;
        
        for (let i = 1; i < lines.length; i++) {
            // Strip out all rogue quotes immediately
            let cleanLine = lines[i].replace(/"/g, '').trim();
            if (!cleanLine) continue;
            
            let parts = cleanLine.split(',');
            
            if (parts.length >= 1) {
                const email = parts[0].trim().toLowerCase();
                
                // Extremely basic email validation format
                if (!email.includes('@') || !email.includes('.')) {
                    errorCount++;
                    continue;
                }

                const firstName = parts.length > 1 ? parts[1].trim() : '';
                const lastName = parts.length > 2 ? parts.slice(2).join(' ').trim() : '';

                validRows.push({
                    email: email,
                    first_name: firstName,
                    last_name: lastName,
                    sent: false
                });
            }
        }
        
        console.log(`Parsed ${validRows.length} valid rows. Ignored ${errorCount} malformed lines.`);
        console.log(`Initiating database insert in batches...`);
        
        const batchSize = 500;
        let successCount = 0;

        for (let i = 0; i < validRows.length; i += batchSize) {
            const batch = validRows.slice(i, i + batchSize);
            const { error } = await supabase
                .from('marketing_emails')
                .upsert(batch, { onConflict: 'email', ignoreDuplicates: true });
                
            if (error) {
                console.error(`Batch insert error at index ${i}:`, error.message);
            } else {
                successCount += batch.length;
                console.log(`Successfully upserted batch ${i} to ${i + batch.length} (${Math.round((i + batch.length) / validRows.length * 100)}%)`);
            }
        }
        
        console.log(`\nImport Complete! Successfully processed ${successCount} emails into the marketing_emails table.`);
    } catch (err) {
        console.error("Fatal Error during script execution:", err);
    }
}

importCsv();

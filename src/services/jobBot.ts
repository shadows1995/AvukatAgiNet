import { SupabaseClient } from "@supabase/supabase-js";
import { generateJobDetails } from "./geminiService.js";
import { COURTHOUSES } from "../../data/courthouses.js";

// Bot User Configuration
const BOT_EMAIL = 'bot@avukatagi.net';
const BOT_PASSWORD = 'bot-secure-password-123!';

export const runJobBot = async (supabase: SupabaseClient) => {
    console.log('🤖 Job Bot: Starting run...');

    try {
        // 1. Check if Bot is Enabled
        const { data: settings, error: settingsError } = await supabase
            .from('system_settings')
            .select('value')
            .eq('key', 'job_bot_enabled')
            .single();

        if (settingsError && settingsError.code !== 'PGRST116') {
            console.error('🤖 Job Bot: Error checking settings:', settingsError);
            return;
        }

        const isEnabled = settings?.value === true || settings?.value === 'true';
        if (!isEnabled) {
            console.log('🤖 Job Bot: Disabled in settings. Skipping.');
            return;
        }

        // 2. Ensure Bot User Exists
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        const botUser = (users as any[])?.find(u => u.email === BOT_EMAIL);

        let botUserId = botUser?.id;

        if (!botUser) {
            console.log('🤖 Job Bot: Bot user not found. Creating...');
            const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
                email: BOT_EMAIL,
                password: BOT_PASSWORD,
                email_confirm: true,
                user_metadata: {
                    full_name: 'Sistem Botu',
                    is_bot: true
                }
            });

            if (createError || !newUser.user) {
                console.error('🤖 Job Bot: Failed to create bot user:', createError);
                return;
            }

            botUserId = newUser.user.id;

            // Create public user profile
            const { error: profileError } = await supabase.from('users').insert({
                uid: botUserId,
                email: BOT_EMAIL,
                full_name: 'Sistem Botu',
                role: 'admin',
                is_premium: true,
                membership_type: 'premium_plus',
                city: 'İstanbul',
                baro_city: 'İstanbul',
                baro_number: '00000',
                phone: '5550000000'
            });

            if (profileError) {
                console.error('🤖 Job Bot: Failed to create bot profile:', profileError);
            }

            console.log('🤖 Job Bot: Bot user created successfully.');
        } else {
            botUserId = botUser.id;
        }

        // 3. Select Random Courthouses
        const allCourthouses: { city: string, name: string }[] = [];
        Object.entries(COURTHOUSES).forEach(([city, list]) => {
            list.forEach(ch => allCourthouses.push({ city, name: ch }));
        });

        // Pick 3 random courthouses
        const selectedCourthouses = [];
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * allCourthouses.length);
            selectedCourthouses.push(allCourthouses[randomIndex]);
        }

        console.log(`🤖 Job Bot: Selected ${selectedCourthouses.length} courthouses for potential jobs.`);

        // 4. Process Each Courthouse
        for (const ch of selectedCourthouses) {
            const today = new Date().toISOString().split('T')[0];

            const { data: existingJobs } = await supabase
                .from('jobs')
                .select('job_id')
                .eq('courthouse', ch.name)
                .eq('date', today)
                .limit(1);

            if (existingJobs && existingJobs.length > 0) {
                console.log(`🤖 Job Bot: Job already exists for ${ch.name} today. Skipping.`);
                continue;
            }

            // Generate Content
            console.log(`🤖 Job Bot: Generating content for ${ch.name}...`);
            const jobDetails = await generateJobDetails(ch.name);

            if (!jobDetails) {
                console.error(`🤖 Job Bot: Failed to generate content for ${ch.name}.`);
                continue;
            }

            // Insert Job
            // Calculate Time (Turkey Time UTC+3)
            const now = new Date();
            const trTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Istanbul" }));
            const currentHour = trTime.getHours();
            const currentMin = trTime.getMinutes();

            let minHour = 9;
            const maxHour = 17;

            // If currently after 9, start from current hour
            if (currentHour >= 9) {
                minHour = currentHour;
            }

            let randomHour = Math.floor(Math.random() * (maxHour - minHour + 1)) + minHour;
            let randomMin = Math.floor(Math.random() * 60);

            // Ensure it is in the future relative to now
            if (randomHour === currentHour) {
                // Add 15-45 mins buffer
                randomMin = currentMin + 15 + Math.floor(Math.random() * 30);
                if (randomMin >= 60) {
                    randomHour++;
                    randomMin -= 60;
                }
            }

            // Cap at 17:00
            if (randomHour >= 17) {
                randomHour = 17;
                randomMin = 0;
            }

            // If it's already past 17:00, we still set it to 17:00 as per "same day" rule, 
            // even if it might be expired. The bot should ideally run earlier.

            const timeString = `${String(randomHour).padStart(2, '0')}:${String(randomMin).padStart(2, '0')}`;

            // Calculate Application Deadline (Same as job time)
            // Construct deadline in UTC
            // Job Time (TRT) -> UTC
            // Formula: TRT - 3 hours = UTC
            const deadlineDate = new Date(now);
            deadlineDate.setUTCHours(randomHour - 3, randomMin, 0, 0);

            const { error: insertError } = await supabase.from('jobs').insert({
                title: jobDetails.title,
                description: jobDetails.description,
                city: ch.city,
                courthouse: ch.name,
                date: today,
                time: timeString,
                job_type: jobDetails.jobType,
                offered_fee: jobDetails.offeredFee,
                created_by: botUserId,
                owner_name: jobDetails.ownerName,
                owner_phone: '555' + Math.floor(1000000 + Math.random() * 9000000),
                status: 'open',
                applications_count: Math.floor(Math.random() * (6 - 4 + 1)) + 4, // Random between 4 and 6
                is_urgent: false,
                application_deadline: deadlineDate.toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });

            if (insertError) {
                console.error(`🤖 Job Bot: Error inserting job for ${ch.name}:`, insertError);
            } else {
                console.log(`🤖 Job Bot: ✅ Job created for ${ch.name} by ${jobDetails.ownerName}`);
            }
        }

    } catch (err) {
        console.error('🤖 Job Bot: Critical error:', err);
    }
};

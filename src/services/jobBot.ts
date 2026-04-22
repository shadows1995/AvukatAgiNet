import { SupabaseClient } from "@supabase/supabase-js";
import { generateJobDetails } from "./geminiService.js";
import { COURTHOUSES } from "../../data/courthouses.js";
import { notifyNewJob } from "./notificationService.js";

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
        const { data: existingProfile } = await supabase
            .from('users')
            .select('uid')
            .eq('email', BOT_EMAIL)
            .single();

        let botUserId = existingProfile?.uid;

        if (!botUserId) {
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
                // If it already exists in auth but not in users profile table, we need to handle that.
                if (createError && (createError as any).code === 'email_exists') {
                    console.log('🤖 Job Bot: Auth user exists but missing profile. Attempting to recover...');
                    // Try to list users to find it (might need pagination, but let's hope it works or we just error)
                    const { data: { users } } = await supabase.auth.admin.listUsers({ perPage: 1000 });
                    const authUser = (users as any[]).find(u => u.email === BOT_EMAIL);
                    if (authUser) {
                        botUserId = authUser.id;
                    } else {
                        console.error('🤖 Job Bot: Could not find existing auth user ID.');
                        return;
                    }
                } else {
                    console.error('🤖 Job Bot: Failed to create bot user:', createError);
                    return;
                }
            } else {
                botUserId = newUser.user.id;
            }

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

            console.log('🤖 Job Bot: Bot user profile created successfully.');
        }

        // 3. Check Day Rules
        const now = new Date();
        const trTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Istanbul" }));
        const dayOfWeek = trTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const hourOfDay = trTime.getHours();

        // Rule: Only run between 09:00 and 23:00
        if (hourOfDay < 9 || hourOfDay > 22) {
            console.log(`🤖 Job Bot: Outside operating hours (09:00-23:00). Current hour (Turkey time): ${hourOfDay}. Skipping.`);
            return;
        }

        // Rule 2: No jobs on weekends
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            console.log('🤖 Job Bot: It is weekend. No jobs will be created.');
            return;
        }

        // Rule 1: "Duruşma" only on Tuesday (2) and Thursday (4)
        let allowedJobTypes: string[] = ["İcra İşlemi", "Dosya İnceleme", "Haciz", "Dilekçe", "Diğer"];
        if (dayOfWeek === 2 || dayOfWeek === 4) {
            allowedJobTypes.push("Duruşma");
        }

        // 4. Select Random Courthouses
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

        console.log(`🤖 Job Bot: Selected ${selectedCourthouses.length} courthouses for potential jobs. Allowed types: ${allowedJobTypes.join(', ')}`);

        // 5. Process Each Courthouse
        for (let i = 0; i < selectedCourthouses.length; i++) {
            const ch = selectedCourthouses[i];
            // Get current time in Turkey properly for today and tomorrow
            const nowRaw = new Date();
            const trNowStr = nowRaw.toLocaleString("en-US", { timeZone: "Europe/Istanbul" });
            const trNow = new Date(trNowStr);
            
            const targetDateObj = new Date(trNow);
            let daysToAdd = Math.random() < 0.5 ? 1 : 2; // Next 1 or 2 days
            targetDateObj.setDate(targetDateObj.getDate() + daysToAdd);
            
            // Resmi Tatiller ve Hafta Sonu Kontrolü
            const fixedHolidays = ['01-01', '04-23', '05-01', '05-19', '07-15', '08-30', '10-29'];
            const movingHolidays = [
                '2024-04-10', '2024-04-11', '2024-04-12', '2024-06-16', '2024-06-17', '2024-06-18', '2024-06-19', // 2024
                '2025-03-30', '2025-03-31', '2025-04-01', '2025-06-06', '2025-06-07', '2025-06-08', '2025-06-09', // 2025
                '2026-03-20', '2026-03-21', '2026-03-22', '2026-05-27', '2026-05-28', '2026-05-29', '2026-05-30', // 2026
            ];

            const isHolidayOrWeekend = (d: Date) => {
                const dayOfWeek = d.getDay();
                if (dayOfWeek === 0 || dayOfWeek === 6) return true; // Sunday or Saturday
                const mmdd = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                if (fixedHolidays.includes(mmdd)) return true;
                const yyyymmdd = `${d.getFullYear()}-${mmdd}`;
                if (movingHolidays.includes(yyyymmdd)) return true;
                return false;
            };

            // İleri sarcak kadar devam et
            while (isHolidayOrWeekend(targetDateObj)) {
                targetDateObj.setDate(targetDateObj.getDate() + 1);
            }

            // Format YYYY-MM-DD for Turkey
            const year = targetDateObj.getFullYear();
            const month = String(targetDateObj.getMonth() + 1).padStart(2, '0');
            const day = String(targetDateObj.getDate()).padStart(2, '0');
            const targetDate = `${year}-${month}-${day}`;

            const { data: existingJobs } = await supabase
                .from('jobs')
                .select('job_id')
                .eq('courthouse', ch.name)
                .eq('date', targetDate)
                .limit(1);

            /*
            if (existingJobs && existingJobs.length > 0) {
                console.log(`🤖 Job Bot: Job already exists for ${ch.name} today. Skipping.`);
                continue;
            }
            */

            // Generate Content
            console.log(`🤖 Job Bot: Generating content for ${ch.name}...`);
            const jobDetails = await generateJobDetails(ch.name, allowedJobTypes);

            if (!jobDetails) {
                console.error(`🤖 Job Bot: Failed to generate content for ${ch.name}.`);
                continue;
            }

            // Insert Job
            // Calculate Time (Business Hours: 09:00 - 18:00)
            const randomHour = Math.floor(Math.random() * (18 - 9)) + 9; // 9 to 17 (meaning up to 17:59)
            const randomMin = Math.floor(Math.random() * 60);

            const timeString = `${String(randomHour).padStart(2, '0')}:${String(randomMin).padStart(2, '0')}`;

            // Calculate Application Deadline (15 minutes from creation... wait, from creation NOW)
            const deadlineDate = new Date(nowRaw); // Save deadline in UTC equivalent time because Supabase expects UTC timestamp
            deadlineDate.setMinutes(deadlineDate.getMinutes() + 15);

            const { data: insertedJob, error: insertError } = await supabase.from('jobs').insert({
                title: jobDetails.title,
                description: jobDetails.description,
                city: ch.city,
                courthouse: ch.name,
                date: targetDate, // Randomly next 1 or 2 days in Turkey Time
                time: timeString,
                job_type: jobDetails.jobType,
                offered_fee: jobDetails.offeredFee,
                created_by: botUserId,
                owner_name: jobDetails.ownerName,
                owner_phone: '555' + Math.floor(1000000 + Math.random() * 9000000),
                status: 'open',
                applications_count: Math.floor(Math.random() * (12 - 8 + 1)) + 8, // Random between 8 and 12
                is_urgent: false,
                application_deadline: deadlineDate.toISOString()
                // created_at and updated_at are handled by the database default value (now())
            }).select().single();

            if (insertError) {
                console.error(`🤖 Job Bot: Error inserting job for ${ch.name}:`, insertError);
            } else {
                console.log(`🤖 Job Bot: ✅ Job created for ${ch.name} by ${jobDetails.ownerName}`);



                // ... (inside the loop)

                // Trigger SMS Notification
                try {
                    await notifyNewJob(supabase, {
                        city: ch.city,
                        courthouse: ch.name,
                        jobType: jobDetails.jobType,
                        jobId: insertedJob.job_id,
                        createdBy: botUserId,
                        date: targetDate,
                        time: timeString,
                        offeredFee: String(jobDetails.offeredFee)
                    });
                    console.log(`🤖 Job Bot: 📨 Notification triggered for job ${insertedJob.job_id}`);
                } catch (notifyError) {
                    console.error('🤖 Job Bot: Failed to trigger notification:', notifyError);
                }
            }

            // Wait 2 minutes 13 seconds (133000 ms) before processing the next courthouse
            if (i < selectedCourthouses.length - 1) {
                console.log(`🤖 Job Bot: Waiting 2 minutes 13 seconds before creating the next job...`);
                await new Promise(resolve => setTimeout(resolve, 133000));
            }
        }

    } catch (err) {
        console.error('🤖 Job Bot: Critical error:', err);
    }
};

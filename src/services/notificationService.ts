import { SupabaseClient } from "@supabase/supabase-js";
import axios from "axios";
import { COURTHOUSES } from "../../data/courthouses.js";
import { sendTelegramMessage } from "./telegramService.js";
import { sendPushNotification } from "./pushService.js";
import fs from 'fs';
import path from 'path';

export function customLog(...args: any[]) {
    try {
        const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
        const time = new Date().toISOString();
        const logLine = `[${time}] ${msg}\n`;
        fs.appendFileSync(path.join(process.cwd(), 'notification.log'), logLine);
        console.log(...args);
    } catch (e) { console.log(...args); }
}

export function customError(...args: any[]) {
    try {
        const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
        const time = new Date().toISOString();
        const logLine = `[ERROR ${time}] ${msg}\n`;
        fs.appendFileSync(path.join(process.cwd(), 'notification.log'), logLine);
        console.error(...args);
    } catch (e) { console.error(...args); }
}

// Helper to send SMS via NetGSM XML API
export async function sendSms(phone: string, message: string) {
    // ... (existing sendSms implementation)
    console.log('📨 sendSms called', phone, message);
    try {
        // Clean phone number (remove spaces, ensure 10 digits if possible, or 90 prefix)
        const cleanPhone = phone.replace(/\D/g, '');

        // NetGSM REST API v2 - XML format
        const url = 'https://api.netgsm.com.tr/sms/send/xml';

        const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<mainbody>
    <header>
        <company dil="TR">Netgsm</company>
        <usercode>${process.env.NETGSM_USERNAME}</usercode>
        <password>${process.env.NETGSM_PASSWORD}</password>
        <type>1:n</type>
        <msgheader>${process.env.NETGSM_HEADER}</msgheader>
    </header>
    <body>
        <msg><![CDATA[${message}]]></msg>
        <no>${cleanPhone}</no>
    </body>
</mainbody>`;

        // console.log(`📱 Sending SMS to ${cleanPhone} via XML API...`);

        const response = await axios.post(url, xmlData, {
            headers: {
                'Content-Type': 'application/xml'
            },
            timeout: 10000 // 10 seconds timeout
        });

        const responseCode = response.data.toString().trim().substring(0, 2);

        if (responseCode === '00' || responseCode === '01') {
            // console.log(`✅ SMS sent successfully to ${cleanPhone}. Code: ${responseCode}`);
            return { success: true, code: responseCode, providerResponse: response.data };
        } else {
            console.log(`❌ SMS failed to ${cleanPhone}. Code: ${responseCode}`);
            return { success: false, code: responseCode, providerResponse: response.data };
        }
    } catch (error: any) {
        console.error('❌ NetGSM error', error.message);
        return { success: false, error: error.message };
    }
}

export async function notifyNewJob(
    supabase: SupabaseClient,
    jobData: {
        city: string;
        courthouse: string;
        jobType: string;
        jobId: string;
        createdBy: string;
        date: string;
        time?: string;
        offeredFee: string;
        isOutside?: boolean;
    }
) {
    const { city, courthouse, jobType, jobId, createdBy, date, time, offeredFee, isOutside } = jobData;
    customLog('📨 Notification Service: Processing new job:', { city, courthouse, jobType, createdBy, isOutside });

    if (!courthouse || !jobType) {
        customError('❌ Notification Service: Missing required fields');
        return { success: false, error: 'Missing required fields' };
    }

    try {
        // 1. Find Users (Fetch Telegram fields too)
        // Fixed: Added sms_notifications_enabled to select
        let query = supabase
            .from('users')
            .select('uid, phone, full_name, membership_type, preferred_courthouses, telegram_chat_id, telegram_notifications_enabled, sms_notifications_enabled')
            .neq('uid', createdBy); // Exclude the job creator

        const { data: users, error } = await query;

        if (error) {
            customError('❌ Notification Service: Error fetching users:', error);
            throw error;
        }

        customLog(`📊 Total potential users found: ${users?.length || 0}`);
        if (!users || users.length === 0) {
            customLog('⚠️ No users found to notify.');
            return { success: true, message: 'No users to notify', count: 0 };
        }

        // Helper to normalize strings for comparison
        const normalizeString = (str: string) => {
            if (!str) return '';
            let s = str.toLocaleLowerCase('tr-TR');
            s = s.normalize('NFD').replace(/\p{Diacritic}/gu, '');
            s = s.normalize('NFC');
            s = s.trim().replace(/\s+/g, ' ');
            return s;
        };

        // 2. Filter users by courthouse preference
        let usersToNotify: any[] = [];
        const targetCourthouse = normalizeString(courthouse);

        if (isOutside) {
            // Outside Job Filtering
            const cityCourthouses = COURTHOUSES[city] || [];
            const cityCourthousesNormalized = cityCourthouses.map(c => normalizeString(c));

            usersToNotify = users.filter((user: any) => {
                try {
                    const prefs = user.preferred_courthouses;
                    if (!prefs) return false;

                    let userCourthouses: string[] = [];
                    // Handle JSON/String formats
                    if (Array.isArray(prefs)) {
                        userCourthouses = prefs.map((p: any) => typeof p === 'string' ? p : (p?.name || p?.label || '')).filter(Boolean);
                    } else if (typeof prefs === 'string') {
                        const trimmed = prefs.trim();
                        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                            try {
                                const parsed = JSON.parse(trimmed);
                                userCourthouses = Array.isArray(parsed) ? parsed.map((p: any) => typeof p === 'string' ? p : (p?.name || p?.label || '')).filter(Boolean) : [trimmed];
                            } catch (e) { userCourthouses = [trimmed]; }
                        } else if (trimmed.includes(',')) {
                            userCourthouses = trimmed.split(',').map(s => s.trim()).filter(Boolean);
                        } else {
                            userCourthouses = [trimmed];
                        }
                    }

                    // Check if ANY of user's courthouses belong to this city
                    return userCourthouses.some(uc => {
                        const normUc = normalizeString(uc);
                        return cityCourthousesNormalized.some(cityCh => normUc.includes(cityCh) || cityCh.includes(normUc));
                    });

                } catch (e) { return false; }
            });
        } else {
            // Courthouse Job Filtering
            const stripParentheses = (str: string) => {
                if (!str) return '';
                return str.replace(/\([^)]*\)/g, '').trim().replace(/\s+/g, ' ');
            };
            const targetCourthouseStripped = stripParentheses(targetCourthouse);

            usersToNotify = users.filter((user: any) => {
                try {
                    const prefs = user.preferred_courthouses;
                    if (!prefs) return false;
                    let userCourthouses: string[] = [];

                    if (Array.isArray(prefs)) {
                        userCourthouses = prefs.map((p: any) => typeof p === 'string' ? p : (p?.name || p?.label || '')).filter(Boolean);
                    } else if (typeof prefs === 'string') {
                        const trimmed = prefs.trim();
                        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                            try {
                                const parsed = JSON.parse(trimmed);
                                userCourthouses = Array.isArray(parsed) ? parsed.map((p: any) => typeof p === 'string' ? p : (p?.name || p?.label || '')).filter(Boolean) : [trimmed];
                            } catch (e) { userCourthouses = [trimmed]; }
                        } else if (trimmed.includes(',')) {
                            userCourthouses = trimmed.split(',').map(s => s.trim()).filter(Boolean);
                        } else {
                            userCourthouses = [trimmed];
                        }
                    }

                    return userCourthouses.some(c => {
                        if (typeof c !== 'string') return false;
                        const normalizedPref = normalizeString(c);
                        const normalizedPrefStripped = stripParentheses(normalizedPref);
                        if (normalizedPref === targetCourthouse) return true;
                        if (normalizedPrefStripped && normalizedPrefStripped === targetCourthouseStripped) return true;
                        return false;
                    });
                } catch (filterError: any) { return false; }
            });
        }

        console.log(`🎯 Users matching location: ${usersToNotify.length}`);

        // 3. Prepare Messages
        let formattedDate = date; // Fallback
        try {
            if (date && date.includes('-')) {
                const [y, m, d] = date.split('-');
                if (d && m && y) {
                    formattedDate = `${d}/${m}/${y}`;
                }
            }
        } catch (e) { console.error('Date parsing error', e); }

        const feeStr = offeredFee ? `${offeredFee} TL ücretli ` : '';

        // SMS Message (Uses specific grammar "tarihli")
        let smsDatePart = formattedDate ? `${formattedDate} tarihli, ` : '';
        let smsMessage = isOutside
            ? `Sayın Meslektaşımız, ${city}'da (Adliye Dışı), ${smsDatePart}yeni bir görev açıldı. Görev yeri : ${courthouse}. Hemen incelemek için AvukatAğı uygulamasını ziyaret ediniz.`
            : `Sayın Meslektaşımız, ${courthouse} adliyesinde, ${smsDatePart}${feeStr}yeni bir ${jobType} görevi açıldı. Hemen incelemek için AvukatAğı uygulamasını ziyaret ediniz.`;

        // Telegram Message
        let telegramMessage = `📢 AvukatAğı Platformunda yeni görev yayınlandı.\n\n` +
            `Görev detayları:\n` +
            `Şehir: ${city}\n` +
            (isOutside ? `Görev Yeri: ${courthouse} (Adliye Dışı)\n` : `Adliye: ${courthouse}\n`) +
            `Görev Türü: ${jobType}\n` +
            `Tarih: ${formattedDate}\n` + // Uses DD/MM/YYYY
            `Ücret: ${offeredFee} TL\n\n` +
            `Başvurmak için avukatagi.net sitesini veya mobil uygulamasını ziyaret edin.`;

        let sentTelegramCount = 0;
        let sentSmsCount = 0;
        let sentPushCount = 0;
        const promises = [];

        // Global Telegram Post (If a global chat ID is configured)
        // MUST happen regardless of whether personal users are matched!
        const globalChatId = process.env.TELEGRAM_GLOBAL_CHAT_ID;
        customLog(`[DEBUG] globalChatId configured as: >${globalChatId}<`);
        if (globalChatId) {
            promises.push(
                sendTelegramMessage(globalChatId, telegramMessage)
                    .then(() => {
                        customLog(`✅ Telegram broadcast sent to global group: ${globalChatId}`);
                        sentTelegramCount++;
                    })
                    .catch(e => customError(`❌ Global Telegram broadcast fail`, e))
            );
        } else {
            customLog(`[DEBUG] Skipping global broadcast because globalChatId is falsy`);
        }

        if (usersToNotify.length === 0) {
            customLog(`[DEBUG] No personal users to notify. Waiting for ${promises.length} promises.`);
            // Wait for global broadcast if any, then return early for personal notifications
            const results = await Promise.allSettled(promises);
            customLog(`[DEBUG] Early Return Promise Results:`, results.map(r => r.status));
            return { success: true, message: 'No matching personal users for this courthouse, but global broadcast processed.', counts: { sms: 0, telegram: sentTelegramCount } };
        }



        // 4. Send Notifications in Parallel
        for (const user of usersToNotify) {
            // SMS Logic
            // Include user if strict true, OR if legacy null (not strictly false)
            const isSmsEnabled = user.sms_notifications_enabled !== false;

            if (user.phone && isSmsEnabled) {
                promises.push(
                    sendSms(user.phone, smsMessage)
                        .then(res => { if (res && res.success) sentSmsCount++; })
                        .catch(e => console.error(`SMS fail ${user.uid}`, e))
                );
            }

            // Telegram Logic
            if (user.telegram_notifications_enabled && user.telegram_chat_id) {
                promises.push(
                    sendTelegramMessage(user.telegram_chat_id, telegramMessage)
                        .then(() => sentTelegramCount++)
                        .catch(e => console.error(`Telegram fail ${user.uid}`, e))
                );
            }

            // APP Push Notification Logic
            const pushTitle = isOutside ? `Yeni Görev: ${jobType} 📢` : `Yeni Görev: ${jobType}`;
            const timeStr = time ? `⏰ ${time}` : '';
            const pushBody = isOutside 
                ? `${city} - ${courthouse} (Adliye Dışı)\n📅 ${formattedDate} ${timeStr}\n💰 ${offeredFee} TL\nDetaylar için dokunun.`
                : `${city} - ${courthouse}\n📅 ${formattedDate} ${timeStr}\n💰 ${offeredFee} TL\nDetaylar için dokunun.`;

            promises.push(
                sendPushNotification({
                    user_id: user.uid,
                    title: pushTitle,
                    body: pushBody,
                    data: { jobId: jobId, type: 'new_job', route: `/dashboard/job/${jobId}` }
                })
                .then(() => sentPushCount++)
                .catch(e => console.error(`Push fail ${user.uid}`, e))
            );
        }

        customLog(`[DEBUG] Waiting for ${promises.length} personal/global promises.`);
        const resultsAll = await Promise.allSettled(promises);
        customLog(`[DEBUG] All Promise Results:`, resultsAll.map(r => r.status));
        customLog(`✅ Notifications sent. SMS: ${sentSmsCount}, Telegram: ${sentTelegramCount}, Push: ${sentPushCount}`);

        return {
            success: true,
            message: 'Notifications processed',
            counts: { sms: sentSmsCount, telegram: sentTelegramCount, push: sentPushCount },
            totalTargets: usersToNotify.length,
            targetUsers: usersToNotify.map(u => u.uid)
        };

    } catch (err: any) {
        customError('❌ Notification Service Error:', err);
        return { success: false, error: err.message };
    }
}

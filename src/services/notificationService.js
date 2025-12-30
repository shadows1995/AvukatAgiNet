import axios from "axios";
import { COURTHOUSES } from "../../data/courthouses.js";
import { sendTelegramMessage } from "./telegramService.js";
// Helper to send SMS via NetGSM XML API
export async function sendSms(phone, message) {
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
        }
        else {
            console.log(`❌ SMS failed to ${cleanPhone}. Code: ${responseCode}`);
            return { success: false, code: responseCode, providerResponse: response.data };
        }
    }
    catch (error) {
        console.error('❌ NetGSM error', error.message);
        return { success: false, error: error.message };
    }
}
export async function notifyNewJob(supabase, jobData) {
    const { city, courthouse, jobType, jobId, createdBy, date, offeredFee, isOutside } = jobData;
    console.log('📨 Notification Service: Processing new job:', { city, courthouse, jobType, createdBy, isOutside });
    if (!courthouse || !jobType) {
        console.log('❌ Notification Service: Missing required fields');
        return { success: false, error: 'Missing required fields' };
    }
    try {
        // 1. Find Users (Fetch Telegram fields too)
        let query = supabase
            .from('users')
            .select('uid, phone, full_name, membership_type, preferred_courthouses, telegram_chat_id, telegram_notifications_enabled')
            // .in('membership_type', ['premium', 'premium_plus']) // REMOVED: SMS/Telegram for everyone configured
            .neq('uid', createdBy) // Exclude the job creator
            .or(`sms_notifications_enabled.eq.true,telegram_notifications_enabled.eq.true`) // Fetch if EITHER is enabled
        ;
        const { data: users, error } = await query;
        if (error) {
            console.error('❌ Notification Service: Error fetching users:', error);
            throw error;
        }
        console.log(`📊 Total potential users found: ${users?.length || 0}`);
        if (!users || users.length === 0) {
            console.log('⚠️ No users found to notify.');
            return { success: true, message: 'No users to notify', count: 0 };
        }
        // Helper to normalize strings for comparison
        const normalizeString = (str) => {
            if (!str)
                return '';
            let s = str.toLocaleLowerCase('tr-TR');
            s = s.normalize('NFD').replace(/\p{Diacritic}/gu, '');
            s = s.normalize('NFC');
            s = s.trim().replace(/\s+/g, ' ');
            return s;
        };
        // 2. Filter users by courthouse preference
        let usersToNotify = [];
        const targetCourthouse = normalizeString(courthouse);
        // ... Existing Filtering Logic ...
        if (isOutside) {
            // Outside Job Filtering
            const cityCourthouses = COURTHOUSES[city] || [];
            const cityCourthousesNormalized = cityCourthouses.map(c => normalizeString(c));
            usersToNotify = users.filter((user) => {
                try {
                    const prefs = user.preferred_courthouses;
                    if (!prefs)
                        return false;
                    let userCourthouses = [];
                    // Handle JSON/String formats
                    if (Array.isArray(prefs)) {
                        userCourthouses = prefs.map((p) => typeof p === 'string' ? p : (p?.name || p?.label || '')).filter(Boolean);
                    }
                    else if (typeof prefs === 'string') {
                        const trimmed = prefs.trim();
                        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                            try {
                                const parsed = JSON.parse(trimmed);
                                userCourthouses = Array.isArray(parsed) ? parsed.map((p) => typeof p === 'string' ? p : (p?.name || p?.label || '')).filter(Boolean) : [trimmed];
                            }
                            catch (e) {
                                userCourthouses = [trimmed];
                            }
                        }
                        else if (trimmed.includes(',')) {
                            userCourthouses = trimmed.split(',').map(s => s.trim()).filter(Boolean);
                        }
                        else {
                            userCourthouses = [trimmed];
                        }
                    }
                    // Check if ANY of user's courthouses belong to this city
                    return userCourthouses.some(uc => {
                        const normUc = normalizeString(uc);
                        return cityCourthousesNormalized.some(cityCh => normUc.includes(cityCh) || cityCh.includes(normUc));
                    });
                }
                catch (e) {
                    return false;
                }
            });
        }
        else {
            // Courthouse Job Filtering
            const stripParentheses = (str) => {
                if (!str)
                    return '';
                return str.replace(/\([^)]*\)/g, '').trim().replace(/\s+/g, ' ');
            };
            const targetCourthouseStripped = stripParentheses(targetCourthouse);
            usersToNotify = users.filter((user) => {
                try {
                    const prefs = user.preferred_courthouses;
                    if (!prefs)
                        return false;
                    let userCourthouses = [];
                    // ... extraction logic ...
                    if (Array.isArray(prefs)) {
                        userCourthouses = prefs.map((p) => typeof p === 'string' ? p : (p?.name || p?.label || '')).filter(Boolean);
                    }
                    else if (typeof prefs === 'string') {
                        const trimmed = prefs.trim();
                        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                            try {
                                const parsed = JSON.parse(trimmed);
                                userCourthouses = Array.isArray(parsed) ? parsed.map((p) => typeof p === 'string' ? p : (p?.name || p?.label || '')).filter(Boolean) : [trimmed];
                            }
                            catch (e) {
                                userCourthouses = [trimmed];
                            }
                        }
                        else if (trimmed.includes(',')) {
                            userCourthouses = trimmed.split(',').map(s => s.trim()).filter(Boolean);
                        }
                        else {
                            userCourthouses = [trimmed];
                        }
                    }
                    return userCourthouses.some(c => {
                        if (typeof c !== 'string')
                            return false;
                        const normalizedPref = normalizeString(c);
                        const normalizedPrefStripped = stripParentheses(normalizedPref);
                        if (normalizedPref === targetCourthouse)
                            return true;
                        if (normalizedPrefStripped && normalizedPrefStripped === targetCourthouseStripped)
                            return true;
                        return false;
                    });
                }
                catch (filterError) {
                    return false;
                }
            });
        }
        console.log(`🎯 Users matching location: ${usersToNotify.length}`);
        if (usersToNotify.length === 0) {
            return { success: true, message: 'No matching users for this courthouse', count: 0 };
        }
        // 3. Prepare Messages
        let dateStr = '';
        if (date) {
            try {
                const [y, m, d] = date.split('-');
                dateStr = `${d}.${m}.${y} tarihli, `;
            }
            catch (e) {
                dateStr = `${date} tarihli, `;
            }
        }
        const feeStr = offeredFee ? `${offeredFee} TL ücretli ` : '';
        // SMS Message
        let smsMessage = isOutside
            ? `Sayın Meslektaşımız, ${city}'da (Adliye Dışı), ${dateStr}yeni bir görev açıldı. Görev yeri : ${courthouse}. Hemen incelemek için AvukatAğı uygulamasını ziyaret ediniz.`
            : `Sayın Meslektaşımız, ${courthouse} adliyesinde, ${dateStr}${feeStr}yeni bir ${jobType} görevi açıldı. Hemen incelemek için AvukatAğı uygulamasını ziyaret ediniz.`;
        // Telegram Message
        let telegramMessage = `📢 AvukatAğı Platformunda yeni görev yayınlandı.\n\n` +
            `Görev detayları:\n` +
            `Şehir: ${city}\n` +
            (isOutside ? `Görev Yeri: ${courthouse} (Adliye Dışı)\n` : `Adliye: ${courthouse}\n`) +
            `Görev Türü: ${jobType}\n` +
            `Tarih: ${date}\n` +
            `Ücret: ${offeredFee} TL\n\n` +
            `Başvurmak için avukatagi.net sitesini veya mobil uygulamasını ziyaret edin.`;
        // 4. Send Notifications in Parallel
        let sentSmsCount = 0;
        let sentTelegramCount = 0;
        const promises = [];
        for (const user of usersToNotify) {
            // SMS Logic
            // Users have a column `sms_notifications_enabled` (we assume true for now if existing logic implies it, 
            // but the query specifically checks filtering. 
            // However, the query uses OR. So we must check specific flags per user.
            // Note: DB column is sms_notifications_enabled. 
            // If undefined, maybe default to true? Or false? 
            // The query `or(sms.eq.true)` implies we only fetched those who enabled it OR telegram.
            // Check SMS eligibility
            if (user.phone && user.sms_notifications_enabled !== false) {
                // Assuming default is true if null? Or strictly true? 
                // Let's rely on the query filtering, but since it's OR, we double check.
                // Actually, if query is OR, a user could have SMS=false but TELEGRAM=true.
                if (user.sms_notifications_enabled === true) {
                    promises.push(sendSms(user.phone, smsMessage)
                        .then(res => { if (res && res.success)
                        sentSmsCount++; })
                        .catch(e => console.error(`SMS fail ${user.uid}`, e)));
                }
            }
            // Telegram Logic
            if (user.telegram_notifications_enabled && user.telegram_chat_id) {
                promises.push(sendTelegramMessage(user.telegram_chat_id, telegramMessage)
                    .then(() => sentTelegramCount++)
                    .catch(e => console.error(`Telegram fail ${user.uid}`, e)));
            }
        }
        await Promise.allSettled(promises);
        console.log(`✅ Notifications sent. SMS: ${sentSmsCount}, Telegram: ${sentTelegramCount}`);
        return {
            success: true,
            message: 'Notifications processed',
            counts: { sms: sentSmsCount, telegram: sentTelegramCount },
            totalTargets: usersToNotify.length
        };
    }
    catch (err) {
        console.error('❌ Notification Service Error:', err);
        return { success: false, error: err.message };
    }
}

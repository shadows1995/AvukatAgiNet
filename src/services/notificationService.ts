import { SupabaseClient } from "@supabase/supabase-js";
import axios from "axios";

// Helper to send SMS via NetGSM XML API
export async function sendSms(phone: string, message: string) {
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

        console.log(`📱 Sending SMS to ${cleanPhone} via XML API...`);

        const response = await axios.post(url, xmlData, {
            headers: {
                'Content-Type': 'application/xml'
            },
            timeout: 10000 // 10 seconds timeout
        });

        const responseCode = response.data.toString().trim().substring(0, 2);

        if (responseCode === '00' || responseCode === '01') {
            console.log(`✅ SMS sent successfully to ${cleanPhone}. Code: ${responseCode}`);
            return { success: true, code: responseCode, providerResponse: response.data };
        } else {
            console.log(`❌ SMS failed to ${cleanPhone}. Code: ${responseCode}`);
            return { success: false, code: responseCode, providerResponse: response.data };
        }
    } catch (error: any) {
        console.error('❌ NetGSM error', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
        }
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
        offeredFee: string;
    }
) {
    const { city, courthouse, jobType, jobId, createdBy, date, offeredFee } = jobData;
    console.log('📨 Notification Service: Processing new job:', { city, courthouse, jobType, createdBy });

    if (!courthouse || !jobType) {
        console.log('❌ Notification Service: Missing required fields');
        return { success: false, error: 'Missing required fields' };
    }

    try {
        // 1. Find Premium/Premium+ users
        let query = supabase
            .from('users')
            .select('uid, phone, full_name, membership_type, preferred_courthouses')
            .in('membership_type', ['premium', 'premium_plus'])
            .not('phone', 'is', null);

        const { data: users, error } = await query;

        if (error) {
            console.error('❌ Notification Service: Error fetching users:', error);
            throw error;
        }

        console.log(`📊 Total premium users found: ${users?.length || 0}`);
        if (!users || users.length === 0) {
            console.log('⚠️ No premium users found.');
            return { success: true, message: 'No users to notify', count: 0 };
        }

        // Helper to normalize strings for comparison (robust, generic and diacritic-insensitive)
        const normalizeString = (str: string) => {
            if (!str) return '';
            // 1. Turkish-aware lowercase (handles İ/i, I/ı correctly)
            let s = str.toLocaleLowerCase('tr-TR');
            // 2. Normalize unicode and strip diacritics (ğ, ü, ş, ö, ç, ı vs.)
            s = s.normalize('NFD').replace(/\p{Diacritic}/gu, '');
            // 3. Normalize again to composed form
            s = s.normalize('NFC');
            // 4. Trim and collapse multiple spaces
            s = s.trim().replace(/\s+/g, ' ');
            return s;
        };

        // 2. Filter users by courthouse preference
        const targetCourthouse = normalizeString(courthouse);
        console.log(`🔍 Filtering users for courthouse: '${courthouse}'`);
        console.log(`   Normalized Target: '${targetCourthouse}'`);

        // Helper: remove parentheses and their content for a more relaxed comparison
        const stripParentheses = (str: string) => {
            if (!str) return '';
            return str.replace(/\([^)]*\)/g, '').trim().replace(/\s+/g, ' ');
        };

        const targetCourthouseStripped = stripParentheses(targetCourthouse);

        const usersToNotify = users.filter((user: any) => {
            try {
                const prefs = user.preferred_courthouses;

                if (!prefs) {
                    return false;
                }

                let userCourthouses: string[] = [];

                // Normalize user preferences into an array of plain strings
                if (Array.isArray(prefs)) {
                    userCourthouses = prefs.map((p: any) => {
                        if (typeof p === 'string') return p;
                        if (p && typeof p === 'object') {
                            // Common patterns if JSONB is used: { name: '...' } / { label: '...' }
                            return p.name || p.label || '';
                        }
                        return '';
                    }).filter(Boolean);
                } else if (typeof prefs === 'string') {
                    const trimmed = prefs.trim();
                    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                        // JSON array as text
                        try {
                            const parsed = JSON.parse(trimmed);
                            if (Array.isArray(parsed)) {
                                userCourthouses = parsed.map((p: any) => {
                                    if (typeof p === 'string') return p;
                                    if (p && typeof p === 'object') return p.name || p.label || '';
                                    return '';
                                }).filter(Boolean);
                            } else {
                                userCourthouses = [trimmed];
                            }
                        } catch (e) {
                            userCourthouses = [trimmed];
                        }
                    } else if (trimmed.includes(',')) {
                        // Comma separated list
                        userCourthouses = trimmed.split(',').map(s => s.trim()).filter(Boolean);
                    } else {
                        // Single courthouse as plain text
                        userCourthouses = [trimmed];
                    }
                }

                // Check for match: generic rule for all courthouses (handles parentheses variations)
                const isMatch = userCourthouses.some(c => {
                    if (typeof c !== 'string') return false;
                    const normalizedPref = normalizeString(c);
                    const normalizedPrefStripped = stripParentheses(normalizedPref);

                    // Exact match
                    if (normalizedPref === targetCourthouse) return true;

                    // Match when one side has extra parentheses detail (e.g. "... (merkez)")
                    if (normalizedPrefStripped && normalizedPrefStripped === targetCourthouseStripped) return true;

                    return false;
                });

                if (isMatch) {
                    console.log(`   ✅ Match found: ${user.full_name} (${user.phone})`);
                }

                return isMatch;
            } catch (filterError: any) {
                console.error(`❌ Error filtering user ${user.full_name}:`, filterError.message);
                return false;
            }
        });

        console.log(`🎯 Users matching courthouse '${targetCourthouse}': ${usersToNotify.length}`);

        if (usersToNotify.length === 0) {
            return { success: true, message: 'No matching users for this courthouse', count: 0 };
        }

        // 3. Send SMS to filtered users
        // Format date if present
        let dateStr = '';
        if (date) {
            try {
                // Assuming date is YYYY-MM-DD
                const [y, m, d] = date.split('-');
                dateStr = `${d}.${m}.${y} tarihli, `;
            } catch (e) {
                dateStr = `${date} tarihli, `;
            }
        }

        const feeStr = offeredFee ? `${offeredFee} TL ücretli ` : '';

        const message = `Sayın Meslektaşımız, ${courthouse} adliyesinde, ${dateStr}${feeStr}yeni bir ${jobType} görevi açıldı. Hemen incelemek için AvukatAğı uygulamasını ziyaret ediniz.`;

        let sentCount = 0;
        for (const user of usersToNotify) {
            if (user.phone) {
                console.log(`📱 Sending SMS to ${user.full_name} (${user.phone})`);
                const result = await sendSms(user.phone, message);
                if (result) {
                    sentCount++;
                    console.log(`✅ SMS sent successfully to ${user.phone}`);
                } else {
                    console.log(`❌ Failed to send SMS to ${user.phone}`);
                }
            }
        }

        return { success: true, message: 'Notifications sent', count: sentCount, totalTargets: usersToNotify.length };

    } catch (err: any) {
        console.error('❌ Notification Service Error:', err);
        return { success: false, error: err.message };
    }
}

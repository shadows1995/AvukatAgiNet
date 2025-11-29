
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

const port = process.env.PORT || 3001;

// Initialize Supabase Admin Client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper to send SMS via NetGSM XML API
async function sendSms(phone, message) {
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
            }
        });

        const responseCode = response.data.toString().trim().substring(0, 2);

        if (responseCode === '00' || responseCode === '01') {
            console.log(`✅ SMS sent successfully to ${cleanPhone}. Code: ${responseCode}`);
            return { success: true, code: responseCode, data: response.data };
        } else {
            console.log(`❌ SMS failed to ${cleanPhone}. Code: ${responseCode}`);
            return { success: false, code: responseCode, data: response.data };
        }
    } catch (error) {
        console.error(`❌ Error sending SMS to ${phone}:`, error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        return null;
    }
}

// Endpoint: Notify users about a new job
app.post('/api/notify-new-job', async (req, res) => {
    const { city, courthouse, jobType, jobId, createdBy } = req.body;
    console.log('📨 SMS Request received:', { city, courthouse, jobType, createdBy });

    if (!courthouse || !jobType) {
        console.log('❌ Missing required fields');
        return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(`✅ New Job Notification Triggered: ${courthouse} - ${jobType}`);

    try {
        // 1. Find Premium/Premium+ users
        let query = supabase
            .from('users')
            .select('uid, phone, full_name, membership_type, preferred_courthouses')
            .in('membership_type', ['premium', 'premium_plus'])
            .not('phone', 'is', null);

        // Creator exclusion removed for testing purposes as requested
        // if (createdBy && createdBy.length > 10) {
        //    query = query.neq('uid', createdBy);
        // }

        const { data: users, error } = await query;

        if (error) {
            console.error('❌ Error fetching users:', error);
            return res.status(500).json({ error: error.message });
        }

        console.log(`📊 Total premium users found: ${users?.length || 0}`);
        if (!users || users.length === 0) {
            console.log('⚠️ No premium users found.');
            return res.json({ message: 'No users to notify', count: 0 });
        }

        // Helper to normalize strings for comparison (robust, generic and diacritic-insensitive)
        const normalizeString = (str) => {
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
        const stripParentheses = (str) => {
            if (!str) return '';
            return str.replace(/\([^)]*\)/g, '').trim().replace(/\s+/g, ' ');
        };

        const targetCourthouseStripped = stripParentheses(targetCourthouse);

        const usersToNotify = users.filter(user => {
            try {
                const prefs = user.preferred_courthouses;

                if (!prefs) {
                    return false;
                }

                let userCourthouses = [];

                // Normalize user preferences into an array of plain strings
                if (Array.isArray(prefs)) {
                    userCourthouses = prefs.map(p => {
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
                                userCourthouses = parsed.map(p => {
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
            } catch (filterError) {
                console.error(`❌ Error filtering user ${user.full_name}:`, filterError.message);
                return false;
            }
        });

        console.log(`🎯 Users matching courthouse '${targetCourthouse}': ${usersToNotify.length}`);

        if (usersToNotify.length === 0) {
            return res.json({ message: 'No matching users for this courthouse', count: 0 });
        }

        // 3. Send SMS to filtered users
        const message = `Sayın Meslektaşımız, ${courthouse} adliyesinde, yeni bir ${jobType} görevi açıldı. Hemen incelemek için AvukatAğı uygulamasını ziyaret ediniz.`;

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

        res.json({ message: 'Notifications sent', count: sentCount, totalTargets: usersToNotify.length });

    } catch (err) {
        console.error('❌ SERVER ERROR in /api/notify-new-job:');
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        console.error('Request body:', req.body);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// Endpoint: Notify applicant about approval
app.post('/api/notify-application-approved', async (req, res) => {
    const { applicantId, jobTitle } = req.body;

    if (!applicantId) {
        return res.status(400).json({ error: 'Missing applicantId' });
    }

    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('phone, full_name')
            .eq('uid', applicantId)
            .single();

        if (error || !user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.phone) {
            return res.status(400).json({ error: 'User has no phone number' });
        }

        const message = `Avukat Ağı - Sayın Meslektaşımız, "${jobTitle}" görevi için başvurunuz onaylanmıştır. Detaylar için uygulamayı kontrol ediniz.`;

        const response = await sendSms(user.phone, message);

        res.json({ message: 'Notification sent', response });

    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint: Delete user account
app.post('/api/delete-account', async (req, res) => {
    const { uid, token } = req.body;

    if (!uid) {
        return res.status(400).json({ error: 'Missing uid' });
    }

    try {
        // Optional: Verify the token matches the uid if provided
        if (token) {
            const { data: { user }, error } = await supabase.auth.getUser(token);
            if (error || !user || user.id !== uid) {
                return res.status(401).json({ error: 'Unauthorized: Token invalid or does not match uid' });
            }
        }

        console.log(`🗑️ Deleting user account: ${uid}`);

        // Delete the user from Supabase Auth (this cascades to public.users if configured, or we might need to delete manually)
        // Using admin client initialized at the top
        const { error } = await supabase.auth.admin.deleteUser(uid);

        if (error) {
            console.error('❌ Error deleting user:', error);
            return res.status(500).json({ error: error.message });
        }

        console.log(`✅ User deleted successfully: ${uid}`);
        res.json({ message: 'Account deleted successfully' });

    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Handle React routing, return all requests to React app
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

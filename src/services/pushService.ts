import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_FUNCTION_URL = process.env.SUPABASE_FUNCTION_URL; // e.g. https://xyz.supabase.co/functions/v1/super-processor
const PUSH_ADMIN_SECRET = process.env.PUSH_ADMIN_SECRET;

interface PushPayload {
    user_id: string;
    title: string;
    body: string;
    data?: Record<string, any>;
}

export const sendPushNotification = async (payload: PushPayload) => {
    if (!SUPABASE_FUNCTION_URL || !PUSH_ADMIN_SECRET) {
        console.warn("⚠️ Push Notification skipped: SUPABASE_FUNCTION_URL or PUSH_ADMIN_SECRET is missing.");
        return;
    }

    try {
        console.log(`📨 Sending Push to ${payload.user_id}: ${payload.title}`);
        const response = await axios.post(
            SUPABASE_FUNCTION_URL,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-secret': PUSH_ADMIN_SECRET
                }
            }
        );

        if (response.status === 200) {
            console.log(`✅ Push Sent: ${JSON.stringify(response.data)}`);
            return response.data;
        } else {
            console.error(`❌ Push Error Status: ${response.status}`, response.data);
            return null;
        }

    } catch (error: any) {
        // Log detailed error for debugging
        if (error.response) {
            console.error('❌ Push Failed (Response):', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('❌ Push Failed (No Response):', error.request);
        } else {
            console.error('❌ Push Failed (Setup):', error.message);
        }
    }
};

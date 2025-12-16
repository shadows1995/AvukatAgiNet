import axios from 'axios';

// Get token from env
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

/**
 * Sends a text message to a Telegram chat.
 * Uses service role / server-side logic solely.
 * 
 * @param chatId The recipient's chat ID
 * @param text The plain text message
 */
export async function sendTelegramMessage(chatId: string, text: string): Promise<void> {
    if (!TELEGRAM_BOT_TOKEN) {
        console.warn('⚠️ TELEGRAM_BOT_TOKEN is missing. Cannot send message.');
        return;
    }

    try {
        await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
            chat_id: chatId,
            text: text,
            parse_mode: undefined, // Disable parsing to avoid errors with special chars
            disable_web_page_preview: true
        });
        // console.log(`✅ Telegram sent to ${chatId}`);
    } catch (error: any) {
        console.error(`❌ Telegram send error to ${chatId}:`, error?.response?.data || error.message);
        // Do not throw, just log. We don't want to break the SMS loop.
    }
}

/**
 * Sets the webhook URL for the bot.
 * @param url The public https URL for the webhook
 * @param secretToken Optional secret token for security
 */
export async function setTelegramWebhook(url: string, secretToken?: string): Promise<any> {
    if (!TELEGRAM_BOT_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN missing');

    const params: any = { url };
    if (secretToken) params.secret_token = secretToken;

    const res = await axios.post(`${TELEGRAM_API_URL}/setWebhook`, params);
    return res.data;
}

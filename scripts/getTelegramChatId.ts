import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

async function run() {
    console.log('🔍 Telegram grubunun ID\\'sini bulmak için son mesajlar kontrol ediliyor...');
    try {
        const res = await axios.get(`https://api.telegram.org/bot${token}/getUpdates`);
        const updates = res.data.result;
        
        if (!updates || updates.length === 0) {
            console.log('⚠️ Henüz yeni bir mesaj bulunamadı.');
            console.log('👉 Lütfen botu (@AvukatagiBot) hedeflenen gruba ekleyin ve gruba "test" gibi bir mesaj yazın.');
            return;
        }

        const chats = new Map();
        for (const u of updates) {
            const chatObj = u.message?.chat || u.my_chat_member?.chat || u.channel_post?.chat;
            if (chatObj) {
                chats.set(chatObj.id, chatObj.title || chatObj.username || chatObj.type);
            }
        }

        console.log('\n✅ Bulunan Chat (Sohbet) ID\\'leri:');
        for (const [id, title] of chats.entries()) {
            console.log(`- Grup Adı/Türü: ${title} | Chat ID: ${id}`);
        }
        
    } catch (e: any) {
        console.error('❌ Hata oluştu:', e?.response?.data || e.message);
    }
}

run();

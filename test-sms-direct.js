import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function testDirectSMS() {
    console.log('🧪 Testing NetGSM API Direct Connection...');

    const username = process.env.NETGSM_USERNAME;
    const password = process.env.NETGSM_PASSWORD;
    const header = process.env.NETGSM_HEADER;

    // Replace with a valid test number or use a dummy one if just checking auth
    // Ideally, we should ask the user for a number, but for now let's try to send to a dummy or the user's number if known.
    // Since I don't have a number, I will use a placeholder and expect a specific error or success if I can use a real one.
    // I'll use a dummy number that is valid format: 5551234567
    const testPhone = '5532233290';

    if (!username || !password || !header) {
        console.error('❌ Missing NetGSM credentials in .env file');
        return;
    }

    console.log(`   User: ${username}`);
    console.log(`   Header: ${header}`);

    const message = 'AvukatAgi SMS Test Mesaji ' + new Date().toISOString();

    const url = 'https://api.netgsm.com.tr/sms/send/xml';
    const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<mainbody>
    <header>
        <company dil="TR">Netgsm</company>
        <usercode>${username}</usercode>
        <password>${password}</password>
        <type>1:n</type>
        <msgheader>${header}</msgheader>
    </header>
    <body>
        <msg><![CDATA[${message}]]></msg>
        <no>${testPhone}</no>
    </body>
</mainbody>`;

    try {
        const response = await axios.post(url, xmlData, {
            headers: { 'Content-Type': 'application/xml' }
        });

        console.log('   Response Status:', response.status);
        console.log('   Response Data:', response.data);

        const responseCode = response.data.toString().trim().substring(0, 2);
        if (responseCode === '00' || responseCode === '01') {
            console.log('✅ SMS Sent Successfully (Direct)');
        } else {
            console.log(`❌ SMS Failed (Direct). Code: ${responseCode}`);
        }

    } catch (error) {
        console.error('❌ Error testing direct SMS:', error.message);
        if (error.response) {
            console.error('   Data:', error.response.data);
        }
    }
}

testDirectSMS();

import axios from 'axios';

async function testServerEndpoint() {
    console.log('🧪 Testing Server Endpoint (/api/notify-new-job)...');

    const url = 'http://localhost:3001/api/notify-new-job';

    // Payload to trigger the notification
    // We need a courthouse that matches a premium user's preference to actually trigger an SMS.
    // Since we don't know the users, this might return "No users to notify" which is still a valid test of the endpoint.
    const payload = {
        city: 'İstanbul',
        courthouse: 'İstanbul Adliyesi (Çağlayan)', // Common courthouse
        jobType: 'Duruşma',
        jobId: 'test-job-id',
        createdBy: 'test-user-id'
    };

    try {
        const response = await axios.post(url, payload);
        console.log('   Response Status:', response.status);
        console.log('   Response Data:', response.data);
        console.log('✅ Server Endpoint Test Completed');
    } catch (error) {
        console.error('❌ Error testing server endpoint:', error.message);
        if (error.response) {
            console.error('   Data:', error.response.data);
        } else {
            console.error('   Is the server running on port 3001?');
        }
    }
}

testServerEndpoint();

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/webhook/manychat';

const mockPayload = {
    subscriber_id: '1234567890',
    contact_info: {
        first_name: 'TestUser',
        ig_handle: '@testuser'
    },
    trigger: 'comment',
    message: 'I want to be more productive',
    message_id: 'msg_001',
    timestamp: new Date().toISOString()
};

async function runTest() {
    try {
        console.log('Sending mock payload to:', API_URL);
        const response = await axios.post(API_URL, mockPayload);
        console.log('Response:', response.data);

        if (response.data.reply && response.data.reply.includes("Record it")) {
            console.log('✅ Success: Received expected response format.');
        } else {
            console.log('❌ Failure: Response format incorrect or missing CTA.');
        }

    } catch (error) {
        console.error('❌ Error hitting webhook:', error);
    }
}

runTest();

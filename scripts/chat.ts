import axios from 'axios';
import readline from 'readline';

const API_URL = 'http://localhost:3000/api/webhook/manychat';
const SUBSCRIBER_ID = 'local-tester-' + Math.floor(Math.random() * 1000); // Random ID for new session
const FIRST_NAME = 'LocalUser';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('--------------------------------------------------');
console.log('🤖 Hop Hop Bot - Local Interactive Chat');
console.log('--------------------------------------------------');
console.log(`SESSION ID: ${SUBSCRIBER_ID}`);
console.log('Type your message and press ENTER. Type "exit" to quit.');
console.log('--------------------------------------------------');

// Define the payload structure
interface ManyChatPayload {
    subscriber_id: string;
    contact_info: {
        first_name: string;
        ig_handle: string;
    };
    trigger: string;
    message: string;
}

const chat = async () => {
    rl.question('You: ', async (input) => {
        if (input.toLowerCase() === 'exit') {
            console.log('Bye! 👋');
            rl.close();
            return;
        }

        const payload: ManyChatPayload = {
            subscriber_id: SUBSCRIBER_ID,
            contact_info: {
                first_name: FIRST_NAME,
                ig_handle: '@local_tester'
            },
            trigger: 'comment', // Default trigger
            message: input
        };

        try {
            process.stdout.write('Bot is typing... ⏳\r');
            const response = await axios.post(API_URL, payload);

            // Clear "Bot is typing" line
            process.stdout.write('                       \r');

            const reply = response.data.reply;
            console.log(`Bot: ${reply}`);
            console.log('--------------------------------------------------');

            if (response.data.metadata?.filtered) {
                console.log('⚠️  (Safety Filter Triggered)');
            }

        } catch (error: any) {
            console.error('❌ Error:', error.message);
            if (error.code === 'ECONNREFUSED') {
                console.error('   Hint: Is the server running? Run "npm run dev" in another terminal.');
            }
        }

        // Loop
        chat();
    });
};

// Start the chat
chat();

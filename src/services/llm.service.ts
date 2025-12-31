import OpenAI from 'openai';
import { config } from '../config';
import logger from '../utils/logger';

class LLMService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: config.openai.apiKey,
        });
    }

    async generateResponse(
        systemPrompt: string,
        userMessage: string,
        history: any[], // TODO: Define strict type
        context: string[]
    ): Promise<string> {
        try {
            // Construction of messages
            const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
                { role: 'system', content: systemPrompt },
                {
                    role: 'system',
                    content: `CONTEXT FROM MEMORY:\n${context.join('\n')}`
                },
                ...history.map(msg => ({ role: 'user' as const, content: typeof msg === 'string' ? msg : JSON.stringify(msg) })),
                { role: 'user', content: userMessage }
            ];

            const response = await this.openai.chat.completions.create({
                model: config.openai.model,
                messages: messages,
                temperature: 0.7,
                max_tokens: 300,
            });

            const content = response.choices[0].message.content || "";

            // Basic post-generation safety check (keyword based)
            // This is a placeholder for more advanced safety logic
            const bannedKeywords = ["kill", "suicide", "murder"];
            if (bannedKeywords.some(keyword => content.toLowerCase().includes(keyword))) {
                logger.warn("Safety filter triggered on LLM response");
                return "I can't say that, but remember: Record it. Post it. Tag 3 people.";
            }

            return content;
        } catch (error) {
            logger.error('LLM Generation Error', error);
            // Fallback
            return "Record it. Post it. Tag 3 people.";
        }
    }
}

export default new LLMService();

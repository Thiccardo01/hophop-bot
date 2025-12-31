import { Request, Response } from 'express';
import llmService from '../services/llm.service';
import memoryService from '../services/memory.service';
import logger from '../utils/logger';
import { z } from 'zod';
import { SYSTEM_PROMPT } from '../prompts';
import { containsBannedContent, SAFETY_REFUSAL_RESPONSE } from '../config/constants';

// Schema for ManyChat incoming payload
const ManyChatPayloadSchema = z.object({
    subscriber_id: z.string(),
    contact_info: z.object({
        first_name: z.string().optional(),
        ig_handle: z.string().optional(),
    }).optional(),
    trigger: z.string().optional(),
    message: z.string().optional(),
    message_id: z.string().optional(),
    timestamp: z.string().optional(),
});

export const handleManyChatWebhook = async (req: Request, res: Response) => {
    try {
        const payload = ManyChatPayloadSchema.parse(req.body);
        const { subscriber_id, message, contact_info, trigger } = payload;
        const userMessage = message || '';
        const firstName = contact_info?.first_name || 'friend';

        logger.info(`Received message from ${subscriber_id}: ${userMessage}`);

        // Input sanitization - remove potential injection attempts
        const sanitizedMessage = userMessage.replace(/[<>{}]/g, '');

        // PRE-FILTER: Check for banned content before calling LLM
        if (containsBannedContent(sanitizedMessage)) {
            logger.warn(`Banned content detected from ${subscriber_id}: ${sanitizedMessage}`);
            return res.status(200).json({
                reply: SAFETY_REFUSAL_RESPONSE,
                quick_replies: ["I followed", "I posted", "Help"],
                metadata: { filtered: true }
            });
        }

        // 1. Get Session & History
        const session = await memoryService.getSession(subscriber_id);
        const history = session?.history || [];

        // 2. Retrieve Long-term Memory (Context)
        const context = await memoryService.searchMemories(subscriber_id, sanitizedMessage);

        // 3. Add user metadata to context
        const userContext = [
            `USER_NAME: ${firstName}`,
            `TRIGGER_TYPE: ${trigger || 'message'}`,
            `MESSAGE_COUNT: ${history.length}`,
            ...context
        ];

        // 4. Generate Response using the EDITABLE system prompt
        const botResponse = await llmService.generateResponse(
            SYSTEM_PROMPT,
            sanitizedMessage,
            history.slice(-5), // Last 5 messages for context
            userContext
        );

        // 5. Update History
        await memoryService.updateHistory(subscriber_id, sanitizedMessage, botResponse);

        // 6. Send Response back to ManyChat
        res.status(200).json({
            reply: botResponse,
            quick_replies: ["I followed", "I posted", "Help"],
            metadata: { session_id: session?.id }
        });

    } catch (error) {
        logger.error('Webhook Error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

import prisma from './db';
import redis from './redis';
import logger from '../utils/logger';

class MemoryService {

    async getSession(userId: string) {
        try {
            // Try Redis first if available
            if (redis) {
                const cached = await redis.get(`session:${userId}`);
                if (cached) return JSON.parse(cached);
            }

            // If not in Redis, find or create user in DB
            let user = await prisma.user.findUnique({
                where: { manychat_id: userId },
                include: { sessions: true }
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        manychat_id: userId,
                        sessions: {
                            create: { history: [] }
                        }
                    },
                    include: { sessions: true }
                });
            }

            // Return the most recent session
            return user.sessions[0];
        } catch (error) {
            logger.error('Error fetching session', error);
            return null;
        }
    }

    async updateHistory(userId: string, userMessage: string, botResponse: string) {
        try {
            // Append to Redis or DB session
            // For MVP we just update Redis and periodically sync or sync on end
            const sessionKey = `session:${userId}`;
            const sessionData = await this.getSession(userId);

            if (!sessionData) return;

            const newHistory = [...(sessionData.history as any[] || []), { role: 'user', content: userMessage }, { role: 'assistant', content: botResponse }];

            // Update Redis if available
            if (redis) {
                await redis.set(sessionKey, JSON.stringify({ ...sessionData, history: newHistory }), 'EX', 3600);
            }

            // Update DB (async)
            prisma.session.update({
                where: { id: sessionData.id },
                data: { history: newHistory }
            }).catch((err: any) => logger.error('DB update failed', err));

        } catch (error) {
            logger.error('Error updating history', error);
        }
    }

    async searchMemories(userId: string, query: string, limit: number = 3) {
        // TODO: Implement vector search via Prisma + pgvector
        // For now returning empty context
        return [];
    }

    async saveMemory(userId: string, content: string) {
        // TODO: Generate embedding and save to DB
    }
}

export default new MemoryService();

// Redis disabled for in-memory mode
import logger from '../utils/logger';

// ⚠️ IN-MEMORY STORAGE (VOLATILE)
// This replaces the database for emergency stability.
// Data is lost when the server restarts.
const localSessionStore = new Map<string, any>();

class MemoryService {

    async getSession(userId: string) {
        try {
            if (!localSessionStore.has(userId)) {
                logger.info(`Creating new in-memory session for ${userId}`);
                localSessionStore.set(userId, {
                    id: `session-${userId}`,
                    history: []
                });
            }
            return localSessionStore.get(userId);
        } catch (error) {
            logger.error('Error fetching session', error);
            // Return empty session to prevent crash
            return { id: 'fallback', history: [] };
        }
    }

    async updateHistory(userId: string, userMessage: string, botResponse: string) {
        try {
            const session = await this.getSession(userId);
            if (!session) return;

            const newHistory = [
                ...(session.history || []),
                { role: 'user', content: userMessage },
                { role: 'assistant', content: botResponse }
            ];

            // Update local store
            session.history = newHistory;
            localSessionStore.set(userId, session);

            logger.info(`Updated in-memory history for ${userId}. Messages: ${newHistory.length}`);

        } catch (error) {
            logger.error('Error updating history', error);
        }
    }

    async searchMemories(userId: string, query: string, limit: number = 3) {
        // Disabled for simplified mode
        return [];
    }

    async saveMemory(userId: string, content: string) {
        // Disabled for simplified mode
    }
}

export default new MemoryService();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config';
import logger from './utils/logger';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', env: config.env });
});

import webhookRoutes from './routes/webhook.routes';

app.use('/api/webhook', webhookRoutes);

if (require.main === module) {
    app.listen(config.port, () => {
        logger.info(`Server running on port ${config.port}`);
    });
}

export default app;

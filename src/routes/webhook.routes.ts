import { Router } from 'express';
import { handleManyChatWebhook } from '../controllers/webhook.controller';

const router = Router();

router.post('/manychat', handleManyChatWebhook);

export default router;

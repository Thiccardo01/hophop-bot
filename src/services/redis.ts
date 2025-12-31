import Redis from 'ioredis';
import { config } from '../config';
import logger from '../utils/logger';

const redis = config.redisUrl ? new Redis(config.redisUrl) : null;

if (redis) {
    redis.on('connect', () => logger.info('Redis connected'));
    redis.on('error', (err) => logger.error('Redis error', err));
} else {
    logger.warn('Redis URL not set. running in DB-only mode.');
}

export default redis;

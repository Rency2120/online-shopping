import Redis from 'ioredis';
import { Service } from 'typedi';
import { REDIS_HOST, REDIS_PORT } from '@config';

@Service()
export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: REDIS_HOST,
      port: parseInt(REDIS_PORT, 10),
    });
  }

  public async setCache(key: string, value: any, expiration: number = 3600): Promise<void> {
    await this.redis.setex(key, expiration, JSON.stringify(value));
  }

  public async getCache(key: string): Promise<any> {
    const result = await this.redis.get(key);
    return result ? JSON.parse(result) : null;
  }

  public async delCache(key: string): Promise<void> {
    await this.redis.del(key);
  }
}

import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redis = createClient({ url: redisUrl });

redis.on("error", (err) => console.error("Redis error:", err));
redis.on("connect", () => console.log("✅ Redis connected"));

export async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
}

// Challenge storage (WebAuthn)
export async function storeChallenge(
  key: string,
  challenge: string,
  ttlSeconds = 300
): Promise<void> {
  await redis.setEx(`challenge:${key}`, ttlSeconds, challenge);
}

export async function getChallenge(key: string): Promise<string | null> {
  return redis.get(`challenge:${key}`);
}

export async function deleteChallenge(key: string): Promise<void> {
  await redis.del(`challenge:${key}`);
}

// Session cache
export async function cacheSession(
  sessionId: string,
  data: object,
  ttlSeconds = 3600
): Promise<void> {
  await redis.setEx(`session:${sessionId}`, ttlSeconds, JSON.stringify(data));
}

export async function getCachedSession(sessionId: string): Promise<object | null> {
  const data = await redis.get(`session:${sessionId}`);
  return data ? JSON.parse(data) : null;
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await redis.del(`session:${sessionId}`);
}

// Rate limiting helpers
export async function incrementCounter(
  key: string,
  ttlSeconds: number
): Promise<number> {
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, ttlSeconds);
  }
  return count;
}

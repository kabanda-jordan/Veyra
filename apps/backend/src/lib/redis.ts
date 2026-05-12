import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redis = createClient({ url: redisUrl });

let redisAvailable = false;

redis.on("error", () => { redisAvailable = false; });
redis.on("connect", () => {
  redisAvailable = true;
  console.log("✅ Redis connected");
});

export async function connectRedis(): Promise<void> {
  try {
    if (!redis.isOpen) {
      await redis.connect();
      redisAvailable = true;
    }
  } catch {
    redisAvailable = false;
    console.warn("⚠️  Redis unavailable — using DB fallback for challenges");
  }
}

// ── Challenge storage (WebAuthn) ──────────────────────────────
// Falls back to in-memory map when Redis is offline (dev only)
const memStore = new Map<string, { value: string; expiresAt: number }>();

export async function storeChallenge(
  key: string,
  challenge: string,
  ttlSeconds = 300
): Promise<void> {
  if (redisAvailable && redis.isOpen) {
    await redis.setEx(`challenge:${key}`, ttlSeconds, challenge);
  } else {
    memStore.set(key, { value: challenge, expiresAt: Date.now() + ttlSeconds * 1000 });
  }
}

export async function getChallenge(key: string): Promise<string | null> {
  if (redisAvailable && redis.isOpen) {
    return redis.get(`challenge:${key}`);
  }
  const entry = memStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { memStore.delete(key); return null; }
  return entry.value;
}

export async function deleteChallenge(key: string): Promise<void> {
  if (redisAvailable && redis.isOpen) {
    await redis.del(`challenge:${key}`);
  } else {
    memStore.delete(key);
  }
}

// ── Session cache ─────────────────────────────────────────────
export async function cacheSession(
  sessionId: string,
  data: object,
  ttlSeconds = 3600
): Promise<void> {
  if (redisAvailable && redis.isOpen) {
    await redis.setEx(`session:${sessionId}`, ttlSeconds, JSON.stringify(data));
  }
}

export async function getCachedSession(sessionId: string): Promise<object | null> {
  if (!redisAvailable || !redis.isOpen) return null;
  const data = await redis.get(`session:${sessionId}`);
  return data ? JSON.parse(data) : null;
}

export async function invalidateSession(sessionId: string): Promise<void> {
  if (redisAvailable && redis.isOpen) {
    await redis.del(`session:${sessionId}`);
  }
}

export async function incrementCounter(key: string, ttlSeconds: number): Promise<number> {
  if (redisAvailable && redis.isOpen) {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, ttlSeconds);
    return count;
  }
  return 1; // fallback — always allow
}

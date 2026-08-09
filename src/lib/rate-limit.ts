/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * Good enough for a personal site on a single instance. If you ever scale to
 * multiple regions or serverless instances that don't share memory, swap the
 * Map for Upstash Redis — the call signature won't change.
 */

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Map<string, Entry>>();

export function rateLimit(
  namespace: string,
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; remaining: number; resetAt: number } {
  let bucket = buckets.get(namespace);
  if (!bucket) {
    bucket = new Map();
    buckets.set(namespace, bucket);
  }

  const now = Date.now();
  const entry = bucket.get(key);

  if (!entry || now >= entry.resetAt) {
    const resetAt = now + windowMs;
    bucket.set(key, { count: 1, resetAt });
    sweep(bucket, now);
    return { ok: true, remaining: limit - 1, resetAt };
  }

  entry.count += 1;
  return {
    ok: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    resetAt: entry.resetAt,
  };
}

/** Drop expired entries so a long-lived process doesn't grow unbounded. */
function sweep(bucket: Map<string, Entry>, now: number) {
  if (bucket.size < 500) return;
  for (const [k, v] of bucket) {
    if (now >= v.resetAt) bucket.delete(k);
  }
}

/** Best-effort client IP from the proxy headers Vercel and friends set. */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

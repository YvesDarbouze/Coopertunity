
// Prompt 48: API Rate Limiting & Caching
// Simple in-memory cache to prevent hitting Indeed/Google Jobs API too often

const CACHE_DURATION = 1000 * 60 * 60; // 1 Hour
const cache = new Map<string, { data: any, timestamp: number }>();

export async function fetchWithCache(key: string, fetcher: () => Promise<any>) {
    const cached = cache.get(key);

    if (cached) {
        const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
        if (!isExpired) {
            console.log(`[CACHE HIT] ${key}`);
            return cached.data;
        }
    }

    console.log(`[CACHE MISS] ${key} - Fetching fresh data...`);
    // Mocking API delay/limit safeguard
    // In production, implement actual Rate Limiting (e.g. max 5 req/sec) here

    const data = await fetcher();
    cache.set(key, { data, timestamp: Date.now() });
    return data;
}

type CacheItem<T> = {
  value: T;
  timestamp: number;
  ttl: number;
};

class MemoryCache {
  private static instance: MemoryCache;
  private cache: Map<string, CacheItem<any>>;

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): MemoryCache {
    if (!MemoryCache.instance) {
      MemoryCache.instance = new MemoryCache();
    }
    return MemoryCache.instance;
  }

  set<T>(key: string, value: T, ttlInSeconds: number = 300): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttlInSeconds * 1000,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const memoryCache = MemoryCache.getInstance();

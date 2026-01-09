// ============================================
// Image Cache - localStorage Caching Utility
// ============================================
// Caches generated images in localStorage with TTL support.
// Used by AI services for runtime-generated images.

// ============================================
// Types
// ============================================

interface CacheEntry {
  /** The cached image data (data URL) */
  data: string;
  /** Timestamp when this was cached */
  timestamp: number;
  /** The prompt used to generate this image */
  prompt: string;
  /** Generation options used */
  options?: Record<string, unknown>;
}

interface CacheStats {
  /** Total number of cached items */
  count: number;
  /** Total size in bytes (approximate) */
  sizeBytes: number;
  /** Oldest entry timestamp */
  oldestTimestamp: number | null;
  /** Newest entry timestamp */
  newestTimestamp: number | null;
}

// ============================================
// Constants
// ============================================

const CACHE_PREFIX = 'conflict_ai_img_';
const CACHE_INDEX_KEY = 'conflict_ai_img_index';
const DEFAULT_TTL_HOURS = 24;
const MAX_CACHE_SIZE_MB = 50; // Maximum cache size in MB

// ============================================
// Image Cache Class
// ============================================

export class ImageCache {
  private ttlMs: number;

  constructor(ttlHours: number = DEFAULT_TTL_HOURS) {
    this.ttlMs = ttlHours * 60 * 60 * 1000;
  }

  /**
   * Generate a cache key from prompt and options
   */
  private getCacheKey(prompt: string, options?: Record<string, unknown>): string {
    const normalized = prompt.toLowerCase().trim();
    const optionsStr = options ? JSON.stringify(options) : '';

    // Simple hash function for the key
    let hash = 0;
    const str = normalized + optionsStr;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return `${CACHE_PREFIX}${Math.abs(hash).toString(36)}`;
  }

  /**
   * Get the cache index (list of all cached keys)
   */
  private getIndex(): string[] {
    try {
      const indexStr = localStorage.getItem(CACHE_INDEX_KEY);
      return indexStr ? JSON.parse(indexStr) : [];
    } catch {
      return [];
    }
  }

  /**
   * Update the cache index
   */
  private setIndex(keys: string[]): void {
    try {
      localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(keys));
    } catch {
      // Ignore if localStorage is full
    }
  }

  /**
   * Add a key to the index
   */
  private addToIndex(key: string): void {
    const index = this.getIndex();
    if (!index.includes(key)) {
      index.push(key);
      this.setIndex(index);
    }
  }

  /**
   * Remove a key from the index
   */
  private removeFromIndex(key: string): void {
    const index = this.getIndex();
    const newIndex = index.filter(k => k !== key);
    this.setIndex(newIndex);
  }

  /**
   * Get a cached image
   * @returns The cached data URL or null if not found/expired
   */
  get(prompt: string, options?: Record<string, unknown>): string | null {
    const key = this.getCacheKey(prompt, options);

    try {
      const entryStr = localStorage.getItem(key);
      if (!entryStr) return null;

      const entry: CacheEntry = JSON.parse(entryStr);

      // Check if expired
      const age = Date.now() - entry.timestamp;
      if (age > this.ttlMs) {
        this.remove(prompt, options);
        return null;
      }

      return entry.data;
    } catch {
      return null;
    }
  }

  /**
   * Cache an image
   * @param prompt - The prompt used to generate the image
   * @param data - The image data URL
   * @param options - Generation options used
   */
  set(prompt: string, data: string, options?: Record<string, unknown>): boolean {
    const key = this.getCacheKey(prompt, options);

    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      prompt,
      options,
    };

    try {
      // Check if we need to free up space
      this.ensureSpace(data.length);

      localStorage.setItem(key, JSON.stringify(entry));
      this.addToIndex(key);
      return true;
    } catch (e) {
      // localStorage might be full
      console.warn('[ImageCache] Failed to cache image:', e);

      // Try to free up space and retry
      this.evictOldest(5);
      try {
        localStorage.setItem(key, JSON.stringify(entry));
        this.addToIndex(key);
        return true;
      } catch {
        return false;
      }
    }
  }

  /**
   * Remove a cached image
   */
  remove(prompt: string, options?: Record<string, unknown>): void {
    const key = this.getCacheKey(prompt, options);

    try {
      localStorage.removeItem(key);
      this.removeFromIndex(key);
    } catch {
      // Ignore errors
    }
  }

  /**
   * Check if an image is cached
   */
  has(prompt: string, options?: Record<string, unknown>): boolean {
    return this.get(prompt, options) !== null;
  }

  /**
   * Clear all cached images
   */
  clear(): void {
    const index = this.getIndex();

    for (const key of index) {
      try {
        localStorage.removeItem(key);
      } catch {
        // Ignore errors
      }
    }

    this.setIndex([]);
  }

  /**
   * Remove expired entries
   */
  cleanExpired(): number {
    const index = this.getIndex();
    let removed = 0;

    for (const key of index) {
      try {
        const entryStr = localStorage.getItem(key);
        if (!entryStr) {
          this.removeFromIndex(key);
          removed++;
          continue;
        }

        const entry: CacheEntry = JSON.parse(entryStr);
        const age = Date.now() - entry.timestamp;

        if (age > this.ttlMs) {
          localStorage.removeItem(key);
          this.removeFromIndex(key);
          removed++;
        }
      } catch {
        // Remove corrupted entries
        localStorage.removeItem(key);
        this.removeFromIndex(key);
        removed++;
      }
    }

    return removed;
  }

  /**
   * Evict the oldest N entries
   */
  evictOldest(count: number): number {
    const index = this.getIndex();
    const entries: Array<{ key: string; timestamp: number }> = [];

    for (const key of index) {
      try {
        const entryStr = localStorage.getItem(key);
        if (entryStr) {
          const entry: CacheEntry = JSON.parse(entryStr);
          entries.push({ key, timestamp: entry.timestamp });
        }
      } catch {
        // Skip corrupted entries
      }
    }

    // Sort by timestamp (oldest first)
    entries.sort((a, b) => a.timestamp - b.timestamp);

    // Remove oldest entries
    let removed = 0;
    for (let i = 0; i < Math.min(count, entries.length); i++) {
      try {
        localStorage.removeItem(entries[i].key);
        this.removeFromIndex(entries[i].key);
        removed++;
      } catch {
        // Ignore errors
      }
    }

    return removed;
  }

  /**
   * Ensure there's enough space for new data
   */
  private ensureSpace(neededBytes: number): void {
    const stats = this.getStats();
    const maxBytes = MAX_CACHE_SIZE_MB * 1024 * 1024;

    if (stats.sizeBytes + neededBytes > maxBytes) {
      // Need to evict some entries
      const toFree = (stats.sizeBytes + neededBytes) - maxBytes;
      const avgSize = stats.count > 0 ? stats.sizeBytes / stats.count : 50000;
      const toEvict = Math.ceil(toFree / avgSize) + 1;

      this.evictOldest(toEvict);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const index = this.getIndex();
    let sizeBytes = 0;
    let oldestTimestamp: number | null = null;
    let newestTimestamp: number | null = null;

    for (const key of index) {
      try {
        const entryStr = localStorage.getItem(key);
        if (entryStr) {
          sizeBytes += entryStr.length * 2; // Approximate size in bytes (UTF-16)

          const entry: CacheEntry = JSON.parse(entryStr);
          if (oldestTimestamp === null || entry.timestamp < oldestTimestamp) {
            oldestTimestamp = entry.timestamp;
          }
          if (newestTimestamp === null || entry.timestamp > newestTimestamp) {
            newestTimestamp = entry.timestamp;
          }
        }
      } catch {
        // Skip corrupted entries
      }
    }

    return {
      count: index.length,
      sizeBytes,
      oldestTimestamp,
      newestTimestamp,
    };
  }

  /**
   * Update the TTL for future entries
   */
  setTTL(hours: number): void {
    this.ttlMs = hours * 60 * 60 * 1000;
  }
}

// Export singleton instance
export const imageCache = new ImageCache();

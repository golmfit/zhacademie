// Cache for storing data
const dataCache = new Map<string, { data: any; timestamp: number }>()

// Cache expiration time (5 minutes by default)
const DEFAULT_CACHE_EXPIRATION = 5 * 60 * 1000

/**
 * Generates a cache key from a path and optional parameters
 */
export function generateCacheKey(path: string, params?: any): string {
  return `${path}:${JSON.stringify(params || {})}`
}

/**
 * Stores data in the cache
 */
export function cacheData(key: string, data: any, expiration: number = DEFAULT_CACHE_EXPIRATION): void {
  dataCache.set(key, {
    data,
    timestamp: Date.now() + expiration,
  })
}

/**
 * Retrieves data from the cache if it exists and hasn't expired
 */
export function getCachedData(key: string): any | null {
  const cachedItem = dataCache.get(key)

  if (!cachedItem) {
    return null
  }

  // Check if the cache has expired
  if (Date.now() > cachedItem.timestamp) {
    dataCache.delete(key)
    return null
  }

  return cachedItem.data
}

/**
 * Clears a specific item from the cache
 */
export function clearCacheItem(key: string): void {
  dataCache.delete(key)
}

/**
 * Clears all items from the cache
 */
export function clearCache(): void {
  dataCache.clear()
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>): void => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * Throttles a function call
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>): void => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Memoizes a function to cache its results
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => string,
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>()

  return (...args: Parameters<T>): ReturnType<T> => {
    const key = resolver ? resolver(...args) : JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = func(...args)
    cache.set(key, result)
    return result
  }
}

/**
 * Lazy loads an image and returns a promise that resolves when the image is loaded
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
    img.crossOrigin = "anonymous"
  })
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { generateCacheKey, getCachedData, cacheData } from "@/lib/performance-utils"

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  headers?: Record<string, string>
  body?: any
  cache?: boolean
  cacheExpiration?: number
  dependencies?: any[]
}

export function useOptimizedFetch<T>(url: string, options: FetchOptions = {}) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const {
    method = "GET",
    headers = {},
    body,
    cache = true,
    cacheExpiration = 5 * 60 * 1000, // 5 minutes
    dependencies = [],
  } = options

  const fetchData = useCallback(
    async (skipCache = false) => {
      try {
        setLoading(true)

        // Generate cache key
        const cacheKey = generateCacheKey(url, { method, body })

        // Check cache first if enabled and not skipping cache
        if (cache && !skipCache) {
          const cachedData = getCachedData(cacheKey)
          if (cachedData) {
            setData(cachedData)
            setLoading(false)
            return
          }
        }

        // Prepare fetch options
        const fetchOptions: RequestInit = {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
        }

        // Add body for non-GET requests
        if (method !== "GET" && body) {
          fetchOptions.body = JSON.stringify(body)
        }

        // Fetch data
        const response = await fetch(url, fetchOptions)

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const result = await response.json()

        // Cache the result if caching is enabled
        if (cache) {
          cacheData(cacheKey, result, cacheExpiration)
        }

        setData(result)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
        setData(null)
      } finally {
        setLoading(false)
      }
    },
    [url, method, JSON.stringify(headers), JSON.stringify(body), cache, cacheExpiration, ...dependencies],
  )

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Function to manually refresh data
  const refresh = useCallback(() => fetchData(true), [fetchData])

  return { data, loading, error, refresh }
}

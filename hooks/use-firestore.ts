"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  collection,
  doc,
  query,
  onSnapshot,
  type DocumentData,
  type QueryConstraint,
  getDoc,
  getDocs,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

// Cache for storing query results
const queryCache = new Map<string, { data: DocumentData[]; timestamp: number }>()
const docCache = new Map<string, { data: DocumentData | null; timestamp: number }>()

// Cache expiration time (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000

// Generate a cache key from path and constraints
const generateCacheKey = (path: string, constraints: QueryConstraint[] = []) => {
  return `${path}:${JSON.stringify(constraints)}`
}

// Hook for real-time collection data with caching
export function useCollection(path: string, constraints: QueryConstraint[] = []) {
  const [data, setData] = useState<DocumentData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const unsubscribeRef = useRef<() => void>()

  useEffect(() => {
    setLoading(true)
    const cacheKey = generateCacheKey(path, constraints)
    const cachedResult = queryCache.get(cacheKey)

    // Use cached data initially if available and not expired
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_EXPIRATION) {
      setData(cachedResult.data)
      setLoading(false)
    }

    try {
      const collectionRef = collection(db, path)
      const q = constraints.length > 0 ? query(collectionRef, ...constraints) : query(collectionRef)

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const results: DocumentData[] = []
          snapshot.forEach((doc) => {
            results.push({
              id: doc.id,
              ...doc.data(),
            })
          })

          // Update state and cache
          setData(results)
          queryCache.set(cacheKey, { data: results, timestamp: Date.now() })
          setLoading(false)
        },
        (err) => {
          console.error("Error in useCollection:", err)
          // Check if it's an index error
          if (err.message.includes("index")) {
            console.warn("This query requires an index. The data will be available once the index is created.")
            setError(err)
          } else {
            setError(err)
          }
          setLoading(false)
        },
      )

      unsubscribeRef.current = unsubscribe
      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current()
        }
      }
    } catch (err: any) {
      console.error("Error setting up useCollection:", err)
      setError(err)
      setLoading(false)
      return () => {}
    }
  }, [path, JSON.stringify(constraints)])

  // Function to manually refresh data
  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      const collectionRef = collection(db, path)
      const q = constraints.length > 0 ? query(collectionRef, ...constraints) : query(collectionRef)
      const snapshot = await getDocs(q)

      const results: DocumentData[] = []
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        })
      })

      setData(results)
      const cacheKey = generateCacheKey(path, constraints)
      queryCache.set(cacheKey, { data: results, timestamp: Date.now() })
    } catch (err: any) {
      console.error("Error refreshing collection:", err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [path, JSON.stringify(constraints)])

  return { data, loading, error, refresh }
}

// Hook for real-time document data with caching
export function useDocument(path: string, id: string) {
  const [data, setData] = useState<DocumentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const unsubscribeRef = useRef<() => void>()

  useEffect(() => {
    if (!id) {
      setData(null)
      setLoading(false)
      return () => {}
    }

    setLoading(true)
    const cacheKey = `${path}/${id}`
    const cachedResult = docCache.get(cacheKey)

    // Use cached data initially if available and not expired
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_EXPIRATION) {
      setData(cachedResult.data)
      setLoading(false)
    }

    try {
      const docRef = doc(db, path, id)

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        docRef,
        (doc) => {
          if (doc.exists()) {
            const docData = {
              id: doc.id,
              ...doc.data(),
            }
            setData(docData)
            docCache.set(cacheKey, { data: docData, timestamp: Date.now() })
          } else {
            setData(null)
            docCache.set(cacheKey, { data: null, timestamp: Date.now() })
          }
          setLoading(false)
        },
        (err) => {
          console.error("Error in useDocument:", err)
          setError(err)
          setLoading(false)
        },
      )

      unsubscribeRef.current = unsubscribe
      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current()
        }
      }
    } catch (err: any) {
      console.error("Error setting up useDocument:", err)
      setError(err)
      setLoading(false)
      return () => {}
    }
  }, [path, id])

  // Function to manually refresh data
  const refresh = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      const docRef = doc(db, path, id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const docData = {
          id: docSnap.id,
          ...docSnap.data(),
        }
        setData(docData)
        docCache.set(`${path}/${id}`, { data: docData, timestamp: Date.now() })
      } else {
        setData(null)
        docCache.set(`${path}/${id}`, { data: null, timestamp: Date.now() })
      }
    } catch (err: any) {
      console.error("Error refreshing document:", err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [path, id])

  return { data, loading, error, refresh }
}

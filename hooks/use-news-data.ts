"use client"

import { useState, useEffect } from "react"
import type { TrendingNews, LocationData } from "@/types/news"

interface UseNewsDataResult {
  data: TrendingNews[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useTrendingNews(category?: string, limit = 10): UseNewsDataResult {
  const [data, setData] = useState<TrendingNews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (category) params.append("category", category)
      params.append("limit", limit.toString())

      const response = await fetch(`/api/news/trending?${params}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch trending news")
      }

      setData(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      console.error("Error fetching trending news:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [category, limit])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

interface UseLocationNewsResult {
  data: LocationData | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useLocationNews(country: string, category?: string): UseLocationNewsResult {
  const [data, setData] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!country) return

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (category) params.append("category", category)

      const response = await fetch(`/api/news/location/${country}?${params}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch location news")
      }

      setData(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      console.error("Error fetching location news:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [country, category])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

interface UseSearchNewsResult {
  data: TrendingNews[]
  loading: boolean
  error: string | null
  hasMore: boolean
  search: (query: string, page?: number) => void
  loadMore: () => void
}

export function useSearchNews(): UseSearchNewsResult {
  const [data, setData] = useState<TrendingNews[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [currentQuery, setCurrentQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const search = async (query: string, page = 1) => {
    try {
      setLoading(true)
      setError(null)

      if (page === 1) {
        setData([])
        setCurrentQuery(query)
        setCurrentPage(1)
      }

      const params = new URLSearchParams()
      params.append("q", query)
      params.append("page", page.toString())
      params.append("limit", "20")

      const response = await fetch(`/api/news/search?${params}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to search news")
      }

      if (page === 1) {
        setData(result.data)
      } else {
        setData((prev) => [...prev, ...result.data])
      }

      setHasMore(result.hasMore)
      setCurrentPage(page)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      console.error("Error searching news:", err)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (currentQuery && hasMore && !loading) {
      search(currentQuery, currentPage + 1)
    }
  }

  return {
    data,
    loading,
    error,
    hasMore,
    search,
    loadMore,
  }
}

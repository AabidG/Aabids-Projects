"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MapPin, Newspaper, Building2, X } from "lucide-react"
import { mockLocations } from "@/data/mockNews"
import { trendingNews } from "@/data/trendingNews"
import type { LocationData, TrendingNews } from "@/types/news"

interface SearchResult {
  id: string
  title: string
  type: "location" | "source" | "article"
  subtitle: string
  data: LocationData | TrendingNews | any
}

interface SearchBarProps {
  onLocationSelect?: (location: LocationData) => void
  onArticleSelect?: (article: TrendingNews) => void
}

export default function SearchBar({ onLocationSelect, onArticleSelect }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    const searchResults: SearchResult[] = []

    // Search locations
    mockLocations.forEach((location) => {
      if (
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.country.toLowerCase().includes(query.toLowerCase())
      ) {
        searchResults.push({
          id: `location-${location.id}`,
          title: `${location.name}, ${location.country}`,
          type: "location",
          subtitle: `${location.topSources.length} news sources available`,
          data: location,
        })
      }
    })

    // Search news sources
    mockLocations.forEach((location) => {
      location.topSources.forEach((source) => {
        if (source.name.toLowerCase().includes(query.toLowerCase())) {
          searchResults.push({
            id: `source-${source.id}`,
            title: source.name,
            type: "source",
            subtitle: `${location.name}, ${location.country} • Trust Score: ${source.trustScore}/10`,
            data: { source, location },
          })
        }
      })
    })

    // Search articles
    trendingNews.forEach((article) => {
      if (
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.summary.toLowerCase().includes(query.toLowerCase()) ||
        article.source.toLowerCase().includes(query.toLowerCase())
      ) {
        searchResults.push({
          id: `article-${article.id}`,
          title: article.title,
          type: "article",
          subtitle: `${article.source} • ${article.location}, ${article.country}`,
          data: article,
        })
      }
    })

    setResults(searchResults.slice(0, 6)) // Limit to 6 results for dropdown
    setIsOpen(searchResults.length > 0)
  }, [query])

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "location" && onLocationSelect) {
      onLocationSelect(result.data as LocationData)
    } else if (result.type === "article" && onArticleSelect) {
      onArticleSelect(result.data as TrendingNews)
    } else if (result.type === "source" && onLocationSelect) {
      onLocationSelect(result.data.location as LocationData)
    }
    setQuery("")
    setIsOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Navigate to search results page
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery("")
      setIsOpen(false)
    }
  }

  const handleViewAllResults = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery("")
      setIsOpen(false)
    }
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case "location":
        return <MapPin className="w-4 h-4 text-blue-400" />
      case "source":
        return <Building2 className="w-4 h-4 text-green-400" />
      case "article":
        return <Newspaper className="w-4 h-4 text-purple-400" />
      default:
        return <Search className="w-4 h-4" />
    }
  }

  const getResultBadge = (type: string) => {
    switch (type) {
      case "location":
        return (
          <Badge variant="outline" className="border-blue-400 text-blue-400 text-xs">
            Location
          </Badge>
        )
      case "source":
        return (
          <Badge variant="outline" className="border-green-400 text-green-400 text-xs">
            Source
          </Badge>
        )
      case "article":
        return (
          <Badge variant="outline" className="border-purple-400 text-purple-400 text-xs">
            Article
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search locations, news sources, articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 py-3 bg-black/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("")
                setIsOpen(false)
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full bg-black/95 border-gray-600 shadow-2xl z-50">
          <CardContent className="p-0">
            <ScrollArea className="max-h-96">
              <div className="p-2">
                {results.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-colors"
                  >
                    {getResultIcon(result.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-medium truncate">{result.title}</p>
                        {getResultBadge(result.type)}
                      </div>
                      <p className="text-gray-400 text-sm truncate">{result.subtitle}</p>
                    </div>
                  </div>
                ))}

                {/* View All Results Button */}
                <div className="border-t border-gray-700 mt-2 pt-2">
                  <Button
                    onClick={handleViewAllResults}
                    variant="ghost"
                    className="w-full text-blue-400 hover:text-blue-300 hover:bg-gray-800/50"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    View all results for "{query}"
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MapPin,
  Newspaper,
  Building2,
  Clock,
  Eye,
  Star,
  ExternalLink,
  ArrowLeft,
  TrendingUp,
  Globe,
} from "lucide-react"
import { mockLocations } from "@/data/mockNews"
import { trendingNews } from "@/data/trendingNews"
import type { LocationData, NewsSource, TrendingNews } from "@/types/news"

interface SearchResults {
  locations: LocationData[]
  sources: Array<{ source: NewsSource; location: LocationData }>
  articles: TrendingNews[]
  relatedTopics: string[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(query)
  const [results, setResults] = useState<SearchResults>({
    locations: [],
    sources: [],
    articles: [],
    relatedTopics: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = (searchTerm: string) => {
    setLoading(true)

    // Simulate search delay
    setTimeout(() => {
      const searchResults: SearchResults = {
        locations: [],
        sources: [],
        articles: [],
        relatedTopics: [],
      }

      const lowerQuery = searchTerm.toLowerCase()

      // Search locations
      mockLocations.forEach((location) => {
        if (location.name.toLowerCase().includes(lowerQuery) || location.country.toLowerCase().includes(lowerQuery)) {
          searchResults.locations.push(location)
        }
      })

      // Search news sources
      mockLocations.forEach((location) => {
        location.topSources.forEach((source) => {
          if (source.name.toLowerCase().includes(lowerQuery) || source.description.toLowerCase().includes(lowerQuery)) {
            searchResults.sources.push({ source, location })
          }
        })
      })

      // Search articles
      trendingNews.forEach((article) => {
        if (
          article.title.toLowerCase().includes(lowerQuery) ||
          article.summary.toLowerCase().includes(lowerQuery) ||
          article.source.toLowerCase().includes(lowerQuery) ||
          article.location.toLowerCase().includes(lowerQuery) ||
          article.category.toLowerCase().includes(lowerQuery)
        ) {
          searchResults.articles.push(article)
        }
      })

      // Generate related topics
      const topics = new Set<string>()
      searchResults.locations.forEach((loc) => {
        topics.add(loc.country)
        topics.add(`${loc.name} News`)
      })
      searchResults.articles.forEach((article) => {
        topics.add(article.category)
        topics.add(article.location)
      })
      searchResults.relatedTopics = Array.from(topics).slice(0, 8)

      setResults(searchResults)
      setLoading(false)
    }, 500)
  }

  const handleNewSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const totalResults = results.locations.length + results.sources.length + results.articles.length

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-300">Searching the globe for "{query}"...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Space Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 container mx-auto p-6">
        {/* Header with Search */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => router.push("/")} className="text-gray-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Globe
            </Button>
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">Global News Search</h1>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleNewSearch} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search locations, news sources, articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 bg-black/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
              />
            </div>
          </form>

          {/* Search Results Summary */}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-300">
            <span>
              Search results for: <span className="text-blue-400 font-semibold">"{query}"</span>
            </span>
            <Badge variant="outline" className="border-blue-400 text-blue-400">
              {totalResults} results found
            </Badge>
          </div>
        </div>

        {totalResults === 0 ? (
          <Card className="bg-black/60 border-gray-700 text-center p-12">
            <CardContent>
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2 text-white">No results found</h3>
              <p className="text-gray-300 mb-4">We couldn't find anything matching "{query}". Try searching for:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Dallas", "Gaza", "BBC News", "Climate", "Technology"].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/search?q=${suggestion}`)}
                    className="border-gray-600 text-gray-300 hover:text-white"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/60 border border-gray-700">
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-600">
                All ({totalResults})
              </TabsTrigger>
              <TabsTrigger value="locations" className="data-[state=active]:bg-blue-600">
                Locations ({results.locations.length})
              </TabsTrigger>
              <TabsTrigger value="sources" className="data-[state=active]:bg-blue-600">
                Sources ({results.sources.length})
              </TabsTrigger>
              <TabsTrigger value="articles" className="data-[state=active]:bg-blue-600">
                Articles ({results.articles.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              {/* Locations Section */}
              {results.locations.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-blue-400" />
                    Locations
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.locations.map((location) => (
                      <LocationCard key={location.id} location={location} />
                    ))}
                  </div>
                </div>
              )}

              {/* News Sources Section */}
              {results.sources.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-green-400" />
                    News Sources
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.sources.map((item, index) => (
                      <SourceCard key={`${item.source.id}-${index}`} source={item.source} location={item.location} />
                    ))}
                  </div>
                </div>
              )}

              {/* Articles Section */}
              {results.articles.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                    <Newspaper className="w-6 h-6 text-purple-400" />
                    Articles
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.articles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </div>
              )}

              {/* Related Topics */}
              {results.relatedTopics.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-white">Related Topics</h2>
                  <div className="flex flex-wrap gap-2">
                    {results.relatedTopics.map((topic) => (
                      <Button
                        key={topic}
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/search?q=${encodeURIComponent(topic)}`)}
                        className="border-gray-600 text-gray-300 hover:text-white hover:border-blue-400"
                      >
                        {topic}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="locations">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.locations.map((location) => (
                  <LocationCard key={location.id} location={location} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sources">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.sources.map((item, index) => (
                  <SourceCard key={`${item.source.id}-${index}`} source={item.source} location={item.location} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="articles">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

// Location Card Component
function LocationCard({ location }: { location: LocationData }) {
  return (
    <Card className="bg-black/60 border-gray-700 hover:border-blue-500 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-400" />
          {location.name}, {location.country}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-300">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4" />
            {location.topSources.length} News Sources Available
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Coordinates: {location.coordinates[0]}, {location.coordinates[1]}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-200">Top News Sources:</p>
          {location.topSources.slice(0, 3).map((source) => (
            <div key={source.id} className="flex items-center justify-between text-xs">
              <span className="text-gray-300">{source.name}</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400" />
                <span className="text-yellow-400">{source.trustScore}/10</span>
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          <MapPin className="w-4 h-4 mr-2" />
          View Location News
        </Button>
      </CardContent>
    </Card>
  )
}

// Source Card Component
function SourceCard({ source, location }: { source: NewsSource; location: LocationData }) {
  return (
    <Card className="bg-black/60 border-gray-700 hover:border-green-500 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-green-400" />
            {source.name}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">{source.trustScore}/10</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-300">{source.description}</p>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <MapPin className="w-4 h-4" />
          {location.name}, {location.country}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Globe className="w-4 h-4" />
          {source.website}
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
            <Newspaper className="w-4 h-4 mr-2" />
            View Articles
          </Button>
          <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Article Card Component
function ArticleCard({ article }: { article: TrendingNews }) {
  return (
    <Card className="bg-black/60 border-gray-700 hover:border-purple-500 transition-colors">
      <CardContent className="p-0">
        <div className="relative">
          <Image
            src={article.imageUrl || "/placeholder.svg?height=200&width=300"}
            alt={article.title}
            width={300}
            height={200}
            className="object-cover w-full h-48 rounded-t-lg"
          />
          <Badge className="absolute top-3 left-3 bg-purple-600 text-white">{article.category}</Badge>
          <Badge className="absolute top-3 right-3 bg-black/70 text-white">
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
          </Badge>
        </div>

        <div className="p-4 space-y-3">
          <h3 className="text-lg font-bold line-clamp-2 text-white">{article.title}</h3>
          <p className="text-sm text-gray-300 line-clamp-2">{article.summary}</p>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {article.source}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {article.location}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-blue-400">
                <Eye className="w-4 h-4" />
                {(article.views / 1000).toFixed(0)}K
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Clock className="w-4 h-4" />
                {article.readTime}m
              </div>
            </div>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <ExternalLink className="w-3 h-3 mr-1" />
              Read
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

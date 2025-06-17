"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Search,
  Heart,
  MapPin,
  Building2,
  Clock,
  Eye,
  TrendingUp,
  ExternalLink,
  Bell,
  Settings,
  Plus,
  Check,
  Star,
  Globe,
} from "lucide-react"
import { mockLocations } from "@/data/mockNews"
import { trendingNews } from "@/data/trendingNews"
import type { LocationData, NewsSource, TrendingNews } from "@/types/news"

// Mock user following data
interface UserFollowing {
  locations: LocationData[]
  sources: Array<{ source: NewsSource; location: LocationData }>
  categories: string[]
  keywords: string[]
}

// Mock followed content
const mockUserFollowing: UserFollowing = {
  locations: [mockLocations[0], mockLocations[1]], // Gaza and Dallas
  sources: [
    { source: mockLocations[0].topSources[0], location: mockLocations[0] }, // Al Jazeera
    { source: mockLocations[1].topSources[0], location: mockLocations[1] }, // Dallas Morning News
    { source: mockLocations[2].topSources[2], location: mockLocations[2] }, // BBC Persian
  ],
  categories: ["Politics", "Technology", "Health"],
  keywords: ["climate", "AI", "healthcare", "election"],
}

// Generate articles from followed sources
const getFollowedArticles = (): TrendingNews[] => {
  const followedArticles: TrendingNews[] = []

  // Add articles from followed locations
  mockUserFollowing.locations.forEach((location) => {
    location.topSources.forEach((source) => {
      source.articles.forEach((article) => {
        followedArticles.push({
          ...article,
          sourceName: source.name,
          sourceLogo: source.logo,
          trustScore: source.trustScore,
          followReason: `Following ${location.name}`,
        } as TrendingNews & { sourceName: string; sourceLogo: string; trustScore: number; followReason: string })
      })
    })
  })

  // Add articles from followed sources
  mockUserFollowing.sources.forEach(({ source, location }) => {
    source.articles.forEach((article) => {
      followedArticles.push({
        ...article,
        sourceName: source.name,
        sourceLogo: source.logo,
        trustScore: source.trustScore,
        followReason: `Following ${source.name}`,
      } as TrendingNews & { sourceName: string; sourceLogo: string; trustScore: number; followReason: string })
    })
  })

  // Add articles from followed categories
  const categoryArticles = trendingNews.filter((article) => mockUserFollowing.categories.includes(article.category))
  categoryArticles.forEach((article) => {
    followedArticles.push({
      ...article,
      followReason: `Following ${article.category}`,
    } as TrendingNews & { followReason: string })
  })

  // Remove duplicates and sort by date
  const uniqueArticles = followedArticles.filter(
    (article, index, self) => index === self.findIndex((a) => a.id === article.id),
  )

  return uniqueArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export default function FollowingPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("feed")
  const [searchQuery, setSearchQuery] = useState("")
  const [followedArticles, setFollowedArticles] = useState<
    Array<TrendingNews & { followReason?: string; sourceName?: string; sourceLogo?: string; trustScore?: number }>
  >([])

  useEffect(() => {
    setFollowedArticles(getFollowedArticles())
  }, [])

  const filteredArticles = followedArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.source.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/")} className="text-gray-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-400" />
                <h1 className="text-4xl font-bold text-white">Following</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white">
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </div>
          </div>

          <p className="text-gray-300 text-lg mb-6">Stay updated with news from your followed sources and topics</p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search your followed content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/60 border border-gray-700 mb-8">
            <TabsTrigger value="feed" className="data-[state=active]:bg-blue-600">
              Latest Feed ({filteredArticles.length})
            </TabsTrigger>
            <TabsTrigger value="locations" className="data-[state=active]:bg-blue-600">
              Locations ({mockUserFollowing.locations.length})
            </TabsTrigger>
            <TabsTrigger value="sources" className="data-[state=active]:bg-blue-600">
              Sources ({mockUserFollowing.sources.length})
            </TabsTrigger>
            <TabsTrigger value="topics" className="data-[state=active]:bg-blue-600">
              Topics ({mockUserFollowing.categories.length + mockUserFollowing.keywords.length})
            </TabsTrigger>
          </TabsList>

          {/* Latest Feed Tab */}
          <TabsContent value="feed" className="space-y-6">
            {filteredArticles.length === 0 ? (
              <Card className="bg-black/60 border-gray-700 text-center p-12">
                <CardContent>
                  <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2 text-white">No articles found</h3>
                  <p className="text-gray-300 mb-4">
                    {searchQuery ? "Try adjusting your search terms" : "Start following locations, sources, or topics"}
                  </p>
                  <Button onClick={() => setActiveTab("locations")} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Follow Content
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <FollowedArticleCard key={`${article.id}-${article.followReason}`} article={article} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Followed Locations</h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Follow New Location
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockUserFollowing.locations.map((location) => (
                <FollowedLocationCard key={location.id} location={location} />
              ))}
            </div>
          </TabsContent>

          {/* Sources Tab */}
          <TabsContent value="sources" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Followed Sources</h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Follow New Source
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockUserFollowing.sources.map((item, index) => (
                <FollowedSourceCard key={`${item.source.id}-${index}`} source={item.source} location={item.location} />
              ))}
            </div>
          </TabsContent>

          {/* Topics Tab */}
          <TabsContent value="topics" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Followed Topics</h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Follow New Topic
              </Button>
            </div>

            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockUserFollowing.categories.map((category) => (
                    <Card key={category} className="bg-black/60 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-lg">
                              <TrendingUp className="w-4 h-4" />
                            </div>
                            <span className="text-white font-medium">{category}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                            Unfollow
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {mockUserFollowing.keywords.map((keyword) => (
                    <Badge key={keyword} variant="outline" className="border-blue-400 text-blue-400 px-3 py-1 text-sm">
                      {keyword}
                      <button className="ml-2 text-red-400 hover:text-red-300">×</button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Followed Article Card Component
function FollowedArticleCard({
  article,
}: {
  article: TrendingNews & { followReason?: string; sourceName?: string; sourceLogo?: string; trustScore?: number }
}) {
  return (
    <Card className="bg-black/60 border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
      <CardContent className="p-0">
        <div className="relative">
          <Image
            src={article.imageUrl || "/placeholder.svg?height=200&width=300"}
            alt={article.title}
            width={300}
            height={200}
            className="object-cover w-full h-48 rounded-t-lg"
          />
          {article.trending && (
            <Badge className="absolute top-3 left-3 bg-red-500 text-white">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          )}
          <Badge className="absolute top-3 right-3 bg-black/70 text-white">{article.category}</Badge>
          {article.followReason && (
            <Badge className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs">
              <Heart className="w-3 h-3 mr-1" />
              {article.followReason}
            </Badge>
          )}
        </div>

        <div className="p-6 space-y-4">
          <h3 className="text-lg font-bold line-clamp-3 text-white leading-tight">{article.title}</h3>
          <p className="text-gray-300 text-sm line-clamp-3">{article.summary}</p>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Image
              src={article.sourceLogo || "/placeholder.svg?height=20&width=60"}
              alt={article.sourceName || article.source}
              width={60}
              height={20}
              className="object-contain"
            />
            <span>•</span>
            <MapPin className="w-3 h-3" />
            {article.location}
            <span>•</span>
            <Clock className="w-3 h-3" />
            {new Date(article.publishedAt).toLocaleDateString()}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-blue-400">
                <Eye className="w-4 h-4" />
                {(article.views / 1000).toFixed(0)}K
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Clock className="w-4 h-4" />
                {article.readTime}m
              </div>
              {article.trustScore && (
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4" />
                  {article.trustScore}/10
                </div>
              )}
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <ExternalLink className="w-3 h-3 mr-1" />
              Read
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Followed Location Card Component
function FollowedLocationCard({ location }: { location: LocationData }) {
  return (
    <Card className="bg-black/60 border-gray-700 hover:border-green-500 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-400" />
            {location.name}, {location.country}
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
            Unfollow
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-300">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4" />
            {location.topSources.length} News Sources
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Coordinates: {location.coordinates[0]}, {location.coordinates[1]}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-200">Recent Activity:</p>
          <div className="text-xs text-gray-400">
            <div className="flex items-center gap-2 mb-1">
              <Check className="w-3 h-3 text-green-400" />
              Following since January 2024
            </div>
            <div className="flex items-center gap-2">
              <Bell className="w-3 h-3 text-blue-400" />
              12 new articles this week
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Followed Source Card Component
function FollowedSourceCard({ source, location }: { source: NewsSource; location: LocationData }) {
  return (
    <Card className="bg-black/60 border-gray-700 hover:border-purple-500 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-400" />
            {source.name}
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
            Unfollow
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-300">{source.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400">{source.trustScore}/10</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {location.name}
          </div>
        </div>

        <div className="text-xs text-gray-400">
          <div className="flex items-center gap-2 mb-1">
            <Check className="w-3 h-3 text-green-400" />
            Following since December 2023
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-3 h-3 text-blue-400" />8 new articles this week
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

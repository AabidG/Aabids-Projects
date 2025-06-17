"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTrendingNews } from "@/hooks/use-news-data"
import type { TrendingNews } from "@/types/news"
import { Clock, Eye, MapPin, ExternalLink, Users, Share2, Stars, RefreshCw, AlertCircle } from "lucide-react"

export default function PopularNowReal() {
  const [selectedStory, setSelectedStory] = useState<TrendingNews | null>(null)
  const { data: trendingNews, loading, error, refetch } = useTrendingNews(undefined, 6)

  if (loading) {
    return (
      <div className="w-full space-y-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Stars className="w-8 h-8 text-blue-400 animate-pulse" />
            <h2 className="text-4xl font-bold text-white">Popular Now</h2>
            <Stars className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
          <p className="text-gray-300 text-lg">Loading the latest trending stories...</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-black/60 backdrop-blur-sm border-gray-700 animate-pulse">
              <CardContent className="p-0">
                <div className="bg-gray-700 h-48 rounded-t-lg"></div>
                <div className="p-6 space-y-4">
                  <div className="bg-gray-700 h-6 rounded"></div>
                  <div className="bg-gray-700 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-700 h-4 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full space-y-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <h2 className="text-4xl font-bold text-white">Popular Now</h2>
          </div>
          <p className="text-red-300 text-lg mb-4">Failed to load trending stories</p>
          <Button onClick={refetch} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (selectedStory) {
    return (
      <Card className="w-full bg-black/60 backdrop-blur-sm border-gray-700">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <Badge variant="secondary" className="bg-blue-900/50 text-blue-300 px-4 py-2 border border-blue-500">
              <Stars className="w-4 h-4 mr-2" />
              Trending Worldwide
            </Badge>
            <Button
              variant="outline"
              onClick={() => setSelectedStory(null)}
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              ← Back to Top Stories
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative">
              <Image
                src={selectedStory.imageUrl || "/placeholder.svg?height=400&width=600"}
                alt={selectedStory.title}
                width={600}
                height={400}
                className="rounded-xl object-cover w-full h-80"
              />
              <Badge className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1">{selectedStory.category}</Badge>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-4 leading-tight text-white">{selectedStory.title}</h1>
                <p className="text-gray-300 text-lg leading-relaxed">{selectedStory.summary}</p>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Image
                    src={selectedStory.sourceLogo || "/placeholder.svg?height=30&width=100"}
                    alt={selectedStory.source}
                    width={100}
                    height={30}
                    className="object-contain"
                  />
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {selectedStory.location}, {selectedStory.country}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-700">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-blue-400">
                    <Eye className="w-6 h-6" />
                    {(selectedStory.views / 1000).toFixed(0)}K
                  </div>
                  <p className="text-sm text-gray-400">Views</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-purple-400">
                    <Users className="w-6 h-6" />
                    {Math.floor(selectedStory.views / 10)}
                  </div>
                  <p className="text-sm text-gray-400">Shares</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-400">
                    <Clock className="w-6 h-6" />
                    {selectedStory.readTime}
                  </div>
                  <p className="text-sm text-gray-400">Min Read</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button size="lg" asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <a href={selectedStory.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Read Full Story
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:text-white">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Stars className="w-8 h-8 text-blue-400" />
          <h2 className="text-4xl font-bold text-white">Popular Now</h2>
          <Stars className="w-8 h-8 text-blue-400" />
        </div>
        <p className="text-gray-300 text-lg">Live trending stories from around the world</p>
        <Button onClick={refetch} variant="ghost" size="sm" className="mt-2 text-blue-400 hover:text-blue-300">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trendingNews.slice(0, 3).map((story, index) => (
          <Card
            key={story.id}
            className={`cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-black/60 backdrop-blur-sm border-gray-700 hover:border-blue-500 ${
              index === 0 ? "ring-2 ring-blue-500 ring-opacity-50" : ""
            }`}
            onClick={() => setSelectedStory(story)}
          >
            <CardContent className="p-0">
              <div className="relative">
                <Image
                  src={story.imageUrl || "/placeholder.svg?height=250&width=400"}
                  alt={story.title}
                  width={400}
                  height={250}
                  className="object-cover w-full h-48 rounded-t-lg"
                />
                <Badge
                  className={`absolute top-4 left-4 text-white px-3 py-1 ${
                    index === 0 ? "bg-blue-500" : index === 1 ? "bg-purple-500" : "bg-green-500"
                  }`}
                >
                  #{index + 1} Trending
                </Badge>
                <Badge className="absolute top-4 right-4 bg-black/70 text-white">{story.category}</Badge>
                {story.trending && <Badge className="absolute bottom-4 left-4 bg-red-500 text-white">🔥 Live</Badge>}
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold line-clamp-3 leading-tight text-white">{story.title}</h3>

                <p className="text-gray-300 text-sm line-clamp-3">{story.summary}</p>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Image
                    src={story.sourceLogo || "/placeholder.svg?height=24&width=80"}
                    alt={story.source}
                    width={80}
                    height={24}
                    className="object-contain"
                  />
                  <span>•</span>
                  <MapPin className="w-3 h-3" />
                  {story.location}
                  <span>•</span>
                  <Clock className="w-3 h-3" />
                  {new Date(story.publishedAt).toLocaleTimeString()}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-blue-400 font-semibold">
                      <Eye className="w-4 h-4" />
                      {(story.views / 1000).toFixed(0)}K
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-4 h-4" />
                      {story.readTime}m
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                    Read More →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-400 text-sm">Live data from global news sources • Updated every 15 minutes</p>
      </div>
    </div>
  )
}

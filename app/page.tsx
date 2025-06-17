"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import InteractiveGlobe from "@/components/interactive-globe-v2"
import PopularNow from "@/components/popular-now"
import NewsCategories from "@/components/news-categories"
import LocationNewsDialog from "@/components/location-news-dialog"
import SearchBar from "@/components/search-bar"
import type { LocationData, TrendingNews } from "@/types/news"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Stars, Heart, Sparkles, User, Bell } from "lucide-react"

export default function GlobalNewsApp() {
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [showLocationDialog, setShowLocationDialog] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<TrendingNews | null>(null)
  const [showArticleDialog, setShowArticleDialog] = useState(false)

  const handleLocationClick = (location: LocationData) => {
    setSelectedLocation(location)
    setShowLocationDialog(true)
  }

  const handleArticleSelect = (article: TrendingNews) => {
    setSelectedArticle(article)
    setShowArticleDialog(true)
  }

  const closeLocationDialog = () => {
    setShowLocationDialog(false)
    setSelectedLocation(null)
  }

  const closeArticleDialog = () => {
    setShowArticleDialog(false)
    setSelectedArticle(null)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Space Background with Stars */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-30">
          {/* Animated stars */}
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
              }}
            />
          ))}
        </div>
        {/* Nebula effect */}
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-blue-900/20" />
      </div>

      <div className="relative z-10 container mx-auto p-4">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-8 p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-gray-700">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <Stars className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white">Global News Hub</span>
          </div>

          {/* Center Navigation - Modern Tab Style */}
          <div className="hidden md:flex items-center gap-2 bg-black/60 rounded-full p-1 border border-gray-600">
            <Button
              onClick={() => router.push("/following")}
              className="rounded-full px-6 py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-all duration-300 border border-red-600/30 hover:border-red-600"
            >
              <Heart className="w-4 h-4 mr-2" />
              Following
            </Button>
            <Button
              onClick={() => router.push("/for-you")}
              className="rounded-full px-6 py-2 bg-yellow-600/20 hover:bg-yellow-600 text-yellow-400 hover:text-white transition-all duration-300 border border-yellow-600/30 hover:border-yellow-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              For You
            </Button>
          </div>

          {/* Account Icon */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => router.push("/account")}
              className="relative p-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
            >
              <User className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Floating Bottom Style */}
        <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex items-center gap-3 bg-black/80 backdrop-blur-sm rounded-full p-2 border border-gray-600 shadow-2xl">
            <Button
              onClick={() => router.push("/following")}
              className="rounded-full px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-all duration-300"
            >
              <Heart className="w-4 h-4 mr-1" />
              Following
            </Button>
            <Button
              onClick={() => router.push("/for-you")}
              className="rounded-full px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600 text-yellow-400 hover:text-white transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              For You
            </Button>
          </div>
        </div>

        {/* Header Content */}
        <div className="mb-8 text-center space-y-6">
          <div>
            <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-4">
              <Stars className="w-12 h-12 text-blue-400" />
              Global News Hub
              <Stars className="w-12 h-12 text-blue-400" />
            </h1>
            <p className="text-gray-300 text-xl">Explore a global unbiased news network to feed your interests</p>
          </div>

          {/* Search Bar */}
          <SearchBar onLocationSelect={handleLocationClick} onArticleSelect={handleArticleSelect} />
        </div>

        {/* Interactive Globe - Space Theme */}
        <div className="mb-12">
          <Card className="bg-black/40 backdrop-blur-sm border-gray-700 shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2 text-2xl">
                <Globe className="w-6 h-6 text-blue-400" />
                Interactive Earth
              </CardTitle>
              <p className="text-gray-300">Click on the glowing markers to discover regional news</p>
            </CardHeader>
            <CardContent className="h-[600px] bg-gradient-to-b from-gray-900/50 to-black/50 rounded-lg">
              <InteractiveGlobe onLocationClick={handleLocationClick} />
            </CardContent>
          </Card>
        </div>

        {/* Popular Now Section - Space Theme */}
        <div className="mb-12">
          <PopularNow />
        </div>

        {/* News Categories Section */}
        <div className="mb-12">
          <NewsCategories />
        </div>
      </div>

      {/* Location News Dialog */}
      <LocationNewsDialog location={selectedLocation} isOpen={showLocationDialog} onClose={closeLocationDialog} />

      {/* Article Dialog for search results */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-4xl max-h-[90vh] bg-black/95 border-gray-700 text-white overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Featured Article</h2>
                <button onClick={closeArticleDialog} className="text-gray-400 hover:text-white text-2xl">
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="relative">
                  <Image
                    src={selectedArticle.imageUrl || "/placeholder.svg?height=400&width=600"}
                    alt={selectedArticle.title}
                    width={600}
                    height={400}
                    className="rounded-xl object-cover w-full h-80"
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold mb-4 leading-tight text-white">{selectedArticle.title}</h1>
                    <p className="text-gray-300 text-lg leading-relaxed">{selectedArticle.summary}</p>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Image
                        src={selectedArticle.sourceLogo || "/placeholder.svg?height=30&width=100"}
                        alt={selectedArticle.source}
                        width={100}
                        height={30}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>
                        {selectedArticle.location}, {selectedArticle.country}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => window.open(selectedArticle.url, "_blank")}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Read Full Story
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Search,
  Sparkles,
  Brain,
  TrendingUp,
  Clock,
  Eye,
  ExternalLink,
  RefreshCw,
  Target,
  BarChart3,
  Zap,
  Star,
  MapPin,
  Calendar,
  ThumbsUp,
  Bookmark,
} from "lucide-react"
import { trendingNews } from "@/data/trendingNews"
import type { TrendingNews } from "@/types/news"

// Mock user activity data for AI analysis
interface UserActivity {
  viewedArticles: string[]
  clickedCategories: Record<string, number>
  timeSpentByCategory: Record<string, number>
  searchHistory: string[]
  bookmarkedArticles: string[]
  likedArticles: string[]
  readingTimes: Record<string, number>
  preferredSources: Record<string, number>
  locationInterests: Record<string, number>
}

// Mock user activity
const mockUserActivity: UserActivity = {
  viewedArticles: ["tech-1", "health-1", "pol-1", "bus-1", "tech-2"],
  clickedCategories: {
    Technology: 15,
    Health: 8,
    Politics: 6,
    Business: 4,
    Science: 3,
  },
  timeSpentByCategory: {
    Technology: 1200, // seconds
    Health: 800,
    Politics: 600,
    Business: 400,
    Science: 300,
  },
  searchHistory: ["AI healthcare", "quantum computing", "climate change", "gene therapy", "space technology"],
  bookmarkedArticles: ["tech-1", "health-1"],
  likedArticles: ["tech-1", "tech-2", "health-1"],
  readingTimes: {
    "tech-1": 420, // seconds
    "health-1": 380,
    "pol-1": 240,
  },
  preferredSources: {
    "MIT Technology Review": 5,
    "Nature Medicine": 4,
    "BBC Science": 3,
    Reuters: 2,
  },
  locationInterests: {
    Boston: 8,
    London: 6,
    "San Francisco": 5,
    Geneva: 3,
  },
}

// AI Analysis Results
interface AIAnalysis {
  topInterests: Array<{ category: string; score: number; reason: string }>
  readingPatterns: {
    preferredLength: string
    bestReadingTime: string
    engagementLevel: number
  }
  recommendationReasons: Record<string, string>
  confidenceScore: number
}

// Generate AI analysis
const generateAIAnalysis = (): AIAnalysis => {
  const totalClicks = Object.values(mockUserActivity.clickedCategories).reduce((a, b) => a + b, 0)
  const totalTime = Object.values(mockUserActivity.timeSpentByCategory).reduce((a, b) => a + b, 0)

  const topInterests = Object.entries(mockUserActivity.clickedCategories)
    .map(([category, clicks]) => ({
      category,
      score: Math.round((clicks / totalClicks) * 100),
      reason: `${clicks} articles viewed, ${Math.round(
        (mockUserActivity.timeSpentByCategory[category] || 0) / 60,
      )} minutes reading time`,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  const avgReadingTime = mockUserActivity.viewedArticles.length
    ? Object.values(mockUserActivity.readingTimes).reduce((a, b) => a + b, 0) / mockUserActivity.viewedArticles.length
    : 0

  return {
    topInterests,
    readingPatterns: {
      preferredLength: avgReadingTime > 300 ? "Long-form articles" : "Quick reads",
      bestReadingTime: "Afternoon (2-4 PM)",
      engagementLevel: Math.min(
        95,
        Math.round((mockUserActivity.likedArticles.length / mockUserActivity.viewedArticles.length) * 100),
      ),
    },
    recommendationReasons: {
      "tech-3": "Based on your interest in quantum computing and space technology",
      "health-2": "You spent 6+ minutes reading similar health articles",
      "pol-2": "Matches your search for 'climate change' and political interests",
    },
    confidenceScore: 87,
  }
}

// Generate personalized recommendations
const generateRecommendations = (): Array<TrendingNews & { aiScore: number; reasons: string[] }> => {
  const analysis = generateAIAnalysis()
  const recommendations: Array<TrendingNews & { aiScore: number; reasons: string[] }> = []

  trendingNews.forEach((article) => {
    let score = 0
    const reasons: string[] = []

    // Category matching
    const categoryInterest = mockUserActivity.clickedCategories[article.category] || 0
    if (categoryInterest > 0) {
      score += categoryInterest * 5
      reasons.push(`High interest in ${article.category} (${categoryInterest} articles viewed)`)
    }

    // Source preference
    const sourcePreference = mockUserActivity.preferredSources[article.source] || 0
    if (sourcePreference > 0) {
      score += sourcePreference * 3
      reasons.push(`Preferred source: ${article.source}`)
    }

    // Location interest
    const locationInterest = mockUserActivity.locationInterests[article.location] || 0
    if (locationInterest > 0) {
      score += locationInterest * 2
      reasons.push(`Interest in ${article.location} news`)
    }

    // Search history matching
    const searchMatch = mockUserActivity.searchHistory.some(
      (search) =>
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.summary.toLowerCase().includes(search.toLowerCase()),
    )
    if (searchMatch) {
      score += 10
      reasons.push("Matches your recent searches")
    }

    // Reading time preference
    const preferredLength = analysis.readingPatterns.preferredLength
    if (
      (preferredLength === "Long-form articles" && article.readTime >= 6) ||
      (preferredLength === "Quick reads" && article.readTime <= 4)
    ) {
      score += 5
      reasons.push(`Matches your ${preferredLength.toLowerCase()} preference`)
    }

    // Trending boost
    if (article.trending) {
      score += 8
      reasons.push("Currently trending")
    }

    // Popularity boost
    if (article.views > 100000) {
      score += 3
      reasons.push("High engagement article")
    }

    if (score > 0) {
      recommendations.push({
        ...article,
        aiScore: Math.min(100, score),
        reasons,
      })
    }
  })

  return recommendations.sort((a, b) => b.aiScore - a.aiScore).slice(0, 12) // Top 12 recommendations
}

export default function ForYouPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [recommendations, setRecommendations] = useState<Array<TrendingNews & { aiScore: number; reasons: string[] }>>(
    [],
  )

  useEffect(() => {
    // Simulate AI analysis
    const timer = setTimeout(() => {
      setAiAnalysis(generateAIAnalysis())
      setRecommendations(generateRecommendations())
      setIsAnalyzing(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const refreshRecommendations = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setRecommendations(generateRecommendations())
      setIsAnalyzing(false)
    }, 1500)
  }

  const filteredRecommendations = recommendations.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.source.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <Brain className="w-16 h-16 mx-auto text-blue-400 animate-pulse" />
            <Sparkles className="w-8 h-8 absolute -top-2 -right-2 text-yellow-400 animate-bounce" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">AI is analyzing your preferences...</h2>
            <p className="text-gray-300">Personalizing your news feed based on your reading patterns</p>
            <Progress value={85} className="w-64 mx-auto" />
            <div className="text-sm text-gray-400">
              <div className="mb-2">✓ Analyzing reading history</div>
              <div className="mb-2">✓ Processing category preferences</div>
              <div className="mb-2">✓ Evaluating source credibility</div>
              <div className="text-blue-400">⟳ Generating personalized recommendations...</div>
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/")} className="text-gray-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-yellow-400" />
                <h1 className="text-4xl font-bold text-white">For You</h1>
              </div>
            </div>
            <Button onClick={refreshRecommendations} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          <p className="text-gray-300 text-lg mb-6">AI-powered news recommendations tailored to your interests</p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search your personalized recommendations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
            />
          </div>
        </div>

        {/* AI Analysis Dashboard */}
        {aiAnalysis && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Confidence Score */}
            <Card className="bg-black/60 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  AI Confidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{aiAnalysis.confidenceScore}%</div>
                  <p className="text-sm text-gray-300">Recommendation accuracy</p>
                </div>
              </CardContent>
            </Card>

            {/* Top Interest */}
            <Card className="bg-black/60 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Top Interest
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{aiAnalysis.topInterests[0]?.category}</div>
                  <div className="text-lg text-gray-300 mb-2">{aiAnalysis.topInterests[0]?.score}% match</div>
                  <p className="text-xs text-gray-400">{aiAnalysis.topInterests[0]?.reason}</p>
                </div>
              </CardContent>
            </Card>

            {/* Reading Pattern */}
            <Card className="bg-black/60 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  Reading Style
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-400 mb-1">
                    {aiAnalysis.readingPatterns.preferredLength}
                  </div>
                  <div className="text-sm text-gray-300 mb-1">{aiAnalysis.readingPatterns.bestReadingTime}</div>
                  <div className="text-xs text-gray-400">{aiAnalysis.readingPatterns.engagementLevel}% engagement</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Interest Breakdown */}
        {aiAnalysis && (
          <Card className="bg-black/60 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-yellow-400" />
                Your Interest Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {aiAnalysis.topInterests.map((interest, index) => (
                  <div key={interest.category} className="text-center">
                    <div className="relative mb-3">
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {interest.score}%
                      </div>
                      {index === 0 && (
                        <Star className="w-4 h-4 absolute -top-1 -right-1 text-yellow-400 fill-current" />
                      )}
                    </div>
                    <h4 className="font-semibold text-white mb-1">{interest.category}</h4>
                    <p className="text-xs text-gray-400">{interest.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              Personalized Recommendations ({filteredRecommendations.length})
            </h2>
            <div className="text-sm text-gray-400">Updated based on your activity</div>
          </div>

          {filteredRecommendations.length === 0 ? (
            <Card className="bg-black/60 border-gray-700 text-center p-12">
              <CardContent>
                <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2 text-white">No recommendations found</h3>
                <p className="text-gray-300">
                  Try adjusting your search or browse more content to improve recommendations
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecommendations.map((article) => (
                <RecommendedArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Recommended Article Card Component
function RecommendedArticleCard({
  article,
}: {
  article: TrendingNews & { aiScore: number; reasons: string[] }
}) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  return (
    <Card className="bg-black/60 border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:shadow-xl">
      <CardContent className="p-0">
        <div className="relative">
          <Image
            src={article.imageUrl || "/placeholder.svg?height=200&width=300"}
            alt={article.title}
            width={300}
            height={200}
            className="object-cover w-full h-48 rounded-t-lg"
          />
          <Badge className="absolute top-3 left-3 bg-yellow-500 text-black font-semibold">
            <Sparkles className="w-3 h-3 mr-1" />
            {article.aiScore}% Match
          </Badge>
          {article.trending && (
            <Badge className="absolute top-3 right-3 bg-red-500 text-white">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          )}
        </div>

        <div className="p-6 space-y-4">
          <h3 className="text-lg font-bold line-clamp-3 text-white leading-tight">{article.title}</h3>
          <p className="text-gray-300 text-sm line-clamp-3">{article.summary}</p>

          {/* AI Reasons */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-semibold text-yellow-400">Why this was recommended:</span>
            </div>
            <ul className="text-xs text-gray-300 space-y-1">
              {article.reasons.slice(0, 2).map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Image
              src={article.sourceLogo || "/placeholder.svg?height=20&width=60"}
              alt={article.source}
              width={60}
              height={20}
              className="object-contain"
            />
            <span>•</span>
            <MapPin className="w-3 h-3" />
            {article.location}
            <span>•</span>
            <Calendar className="w-3 h-3" />
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
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLiked(!liked)}
                className={liked ? "text-green-400" : "text-gray-400"}
              >
                <ThumbsUp className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBookmarked(!bookmarked)}
                className={bookmarked ? "text-yellow-400" : "text-gray-400"}
              >
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                <ExternalLink className="w-3 h-3 mr-1" />
                Read
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

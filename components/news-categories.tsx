"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Users, Gamepad2, Heart, Zap, Globe, TrendingUp, ChevronRight, Newspaper, Eye } from "lucide-react"
import type { TrendingNews } from "@/types/news"

interface NewsCategory {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  description: string
  articles: TrendingNews[]
}

// Mock categorized news data
const categorizedNews: NewsCategory[] = [
  {
    id: "politics",
    name: "Politics",
    icon: <Users className="w-6 h-6" />,
    color: "bg-red-600",
    description: "Latest political developments worldwide",
    articles: [
      {
        id: "pol-1",
        title: "Global Summit Reaches Historic Climate Agreement",
        summary: "World leaders unite on unprecedented climate action plan with binding commitments...",
        imageUrl: "/placeholder.svg?height=200&width=300",
        source: "Reuters International",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Geneva",
        country: "Switzerland",
        publishedAt: "2024-01-15T14:30:00Z",
        readTime: 4,
        category: "Politics",
        trending: true,
        views: 125000,
        url: "#",
      },
      {
        id: "pol-2",
        title: "Election Results Reshape Political Landscape",
        summary: "Unexpected outcomes in key regions signal major shifts in global politics...",
        imageUrl: "/placeholder.svg?height=200&width=300",
        source: "BBC World",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "London",
        country: "United Kingdom",
        publishedAt: "2024-01-15T12:00:00Z",
        readTime: 6,
        category: "Politics",
        trending: true,
        views: 98000,
        url: "#",
      },
    ],
  },
  {
    id: "business",
    name: "Business",
    icon: <Briefcase className="w-6 h-6" />,
    color: "bg-green-600",
    description: "Market trends and economic insights",
    articles: [
      {
        id: "bus-1",
        title: "Tech Giants Report Record Quarterly Earnings",
        summary: "Major technology companies exceed expectations with strong revenue growth...",
        imageUrl: "/placeholder.svg?height=200&width=300",
        source: "Wall Street Journal",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "New York",
        country: "United States",
        publishedAt: "2024-01-15T16:00:00Z",
        readTime: 4,
        category: "Business",
        trending: true,
        views: 156000,
        url: "#",
      },
      {
        id: "bus-2",
        title: "Cryptocurrency Market Shows Signs of Recovery",
        summary: "Digital currencies gain momentum as institutional investors return to the market...",
        imageUrl: "/placeholder.svg?height=200&width=300",
        source: "Bloomberg",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Singapore",
        country: "Singapore",
        publishedAt: "2024-01-15T13:45:00Z",
        readTime: 3,
        category: "Business",
        trending: true,
        views: 89000,
        url: "#",
      },
    ],
  },
  {
    id: "technology",
    name: "Technology",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-blue-600",
    description: "Innovation and digital transformation",
    articles: [
      {
        id: "tech-1",
        title: "Breakthrough in Quantum Computing Achieved",
        summary: "Scientists achieve 99.9% error correction in quantum processors, marking a major milestone...",
        imageUrl: "/placeholder.svg?height=200&width=300",
        source: "MIT Technology Review",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Boston",
        country: "United States",
        publishedAt: "2024-01-15T15:20:00Z",
        readTime: 7,
        category: "Technology",
        trending: true,
        views: 203000,
        url: "#",
      },
      {
        id: "tech-2",
        title: "AI Revolution Transforms Healthcare Industry",
        summary: "Artificial intelligence applications show remarkable success in medical diagnosis and treatment...",
        imageUrl: "/placeholder.svg?height=200&width=300",
        source: "Nature Digital Medicine",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "London",
        country: "United Kingdom",
        publishedAt: "2024-01-15T14:10:00Z",
        readTime: 6,
        category: "Technology",
        trending: true,
        views: 134000,
        url: "#",
      },
    ],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: <Gamepad2 className="w-6 h-6" />,
    color: "bg-purple-600",
    description: "Movies, music, and pop culture",
    articles: [
      {
        id: "ent-1",
        title: "Film Festival Showcases Global Cinema",
        summary: "International filmmakers present diverse stories at this year's prestigious festival...",
        imageUrl: "/placeholder.svg?height=200&width=300",
        source: "Entertainment Weekly",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Cannes",
        country: "France",
        publishedAt: "2024-01-15T17:00:00Z",
        readTime: 4,
        category: "Entertainment",
        trending: true,
        views: 87000,
        url: "#",
      },
      {
        id: "ent-2",
        title: "Streaming Wars Heat Up with New Platforms",
        summary: "Competition intensifies as new streaming services launch with exclusive content...",
        imageUrl: "/placeholder.svg?height=200&width=300",
        source: "Variety",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Los Angeles",
        country: "United States",
        publishedAt: "2024-01-15T15:45:00Z",
        readTime: 3,
        category: "Entertainment",
        trending: true,
        views: 76000,
        url: "#",
      },
    ],
  },
  {
    id: "health",
    name: "Health",
    icon: <Heart className="w-6 h-6" />,
    color: "bg-pink-600",
    description: "Medical breakthroughs and wellness",
    articles: [
      {
        id: "health-1",
        title: "Revolutionary Gene Therapy Shows Promise",
        summary: "Clinical trials demonstrate 95% success rate for new treatment, offering hope to millions...",
        imageUrl: "/placeholder.svg?height=200&width=300",
        source: "New England Journal of Medicine",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Boston",
        country: "United States",
        publishedAt: "2024-01-15T16:30:00Z",
        readTime: 8,
        category: "Health",
        trending: true,
        views: 167000,
        url: "#",
      },
      {
        id: "health-2",
        title: "Mental Health Awareness Reaches New Heights",
        summary: "Global initiatives focus on destigmatizing mental health and improving access to care...",
        imageUrl: "/placeholder.svg?height=200&width=300",
        source: "World Health Organization",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Geneva",
        country: "Switzerland",
        publishedAt: "2024-01-15T14:45:00Z",
        readTime: 6,
        category: "Health",
        trending: true,
        views: 112000,
        url: "#",
      },
    ],
  },
  {
    id: "sports",
    name: "Sports",
    icon: <Globe className="w-6 h-6" />,
    color: "bg-orange-600",
    description: "Athletic achievements and competitions",
    articles: [
      {
        id: "sports-1",
        title: "World Championship Breaks Viewership Records",
        summary: "Global audience reaches unprecedented numbers for this year's championship event...",
        imageUrl: "/placeholder.svg?height=200&width=300",
        source: "ESPN International",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Qatar",
        country: "Qatar",
        publishedAt: "2024-01-15T18:00:00Z",
        readTime: 3,
        category: "Sports",
        trending: true,
        views: 245000,
        url: "#",
      },
      {
        id: "sports-2",
        title: "Olympic Preparations Showcase Innovation",
        summary: "Next Olympic Games promise cutting-edge technology and sustainable practices...",
        imageUrl: "/placeholder.svg?height=200&width=300",
        source: "Olympic Channel",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Paris",
        country: "France",
        publishedAt: "2024-01-15T16:15:00Z",
        readTime: 5,
        category: "Sports",
        trending: true,
        views: 128000,
        url: "#",
      },
    ],
  },
]

export default function NewsCategories() {
  const router = useRouter()

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/category/${categoryId}`)
  }

  return (
    <div className="w-full space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Newspaper className="w-8 h-8 text-blue-400" />
          <h2 className="text-4xl font-bold text-white">Explore by Category</h2>
          <Newspaper className="w-8 h-8 text-blue-400" />
        </div>
        <p className="text-gray-300 text-lg">Discover news that matters to you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorizedNews.map((category) => (
          <Card
            key={category.id}
            className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-black/60 backdrop-blur-sm border-gray-700 hover:border-blue-500 group"
            onClick={() => handleCategoryClick(category.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${category.color} group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">{category.name}</CardTitle>
                    <p className="text-gray-400 text-sm">{category.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-sm text-gray-300">
                <span className="font-semibold">{category.articles.length}</span> articles available
              </div>

              {/* Preview of top articles */}
              <div className="space-y-2">
                {category.articles.slice(0, 2).map((article) => (
                  <div key={article.id} className="flex items-start gap-3 p-2 rounded bg-gray-800/30">
                    <Image
                      src={article.imageUrl || "/placeholder.svg?height=60&width=80"}
                      alt={article.title}
                      width={80}
                      height={60}
                      className="object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-medium line-clamp-2 mb-1">{article.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Eye className="w-3 h-3" />
                        {(article.views / 1000).toFixed(0)}K
                        {article.trending && (
                          <>
                            <span>•</span>
                            <TrendingUp className="w-3 h-3 text-red-400" />
                            <span className="text-red-400">Trending</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="ghost"
                className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCategoryClick(category.id)
                }}
              >
                View All {category.name} News
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Search,
  Clock,
  Eye,
  TrendingUp,
  Star,
  ExternalLink,
  Calendar,
  MapPin,
  Briefcase,
  Users,
  Gamepad2,
  Heart,
  Zap,
  Globe,
  Grid3X3,
  List,
  Newspaper,
} from "lucide-react"
import type { TrendingNews } from "@/types/news"

interface CategoryData {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  description: string
  articles: TrendingNews[]
  totalArticles: number
  trending: number
  sources: string[]
}

// Extended categorized news data with more articles
const categoryData: Record<string, CategoryData> = {
  politics: {
    id: "politics",
    name: "Politics",
    icon: <Users className="w-6 h-6" />,
    color: "bg-red-600",
    description: "Latest political developments and government news from around the world",
    totalArticles: 156,
    trending: 23,
    sources: ["Reuters", "BBC", "Associated Press", "CNN", "Al Jazeera"],
    articles: [
      {
        id: "pol-1",
        title: "Global Summit Reaches Historic Climate Agreement",
        summary:
          "World leaders unite on unprecedented climate action plan with binding commitments for carbon neutrality by 2040. The agreement includes $500 billion in funding for developing nations.",
        imageUrl: "/placeholder.svg?height=300&width=500",
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
        summary:
          "Unexpected outcomes in key regions signal major shifts in global politics as younger candidates gain unprecedented support across multiple continents.",
        imageUrl: "/placeholder.svg?height=300&width=500",
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
      {
        id: "pol-3",
        title: "Trade Agreement Negotiations Enter Final Phase",
        summary:
          "Multi-nation trade talks show promising signs of breakthrough after months of discussions, potentially affecting global commerce worth $2 trillion annually.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "Financial Times",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Brussels",
        country: "Belgium",
        publishedAt: "2024-01-15T10:15:00Z",
        readTime: 5,
        category: "Politics",
        trending: false,
        views: 67000,
        url: "#",
      },
      {
        id: "pol-4",
        title: "International Sanctions Package Announced",
        summary:
          "Coalition of nations implements comprehensive sanctions targeting human rights violations, marking the largest coordinated response in recent history.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "Associated Press",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Washington",
        country: "United States",
        publishedAt: "2024-01-15T08:45:00Z",
        readTime: 7,
        category: "Politics",
        trending: true,
        views: 89000,
        url: "#",
      },
      {
        id: "pol-5",
        title: "Diplomatic Relations Restored After Decade",
        summary:
          "Two neighboring countries announce the restoration of full diplomatic ties, ending a decade-long dispute over territorial boundaries.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "Al Jazeera",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Doha",
        country: "Qatar",
        publishedAt: "2024-01-15T07:20:00Z",
        readTime: 4,
        category: "Politics",
        trending: false,
        views: 54000,
        url: "#",
      },
      {
        id: "pol-6",
        title: "Constitutional Reform Proposal Gains Support",
        summary:
          "Landmark constitutional amendments receive backing from major political parties, potentially reshaping governance structures for the next generation.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "The Guardian",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "London",
        country: "United Kingdom",
        publishedAt: "2024-01-15T06:00:00Z",
        readTime: 8,
        category: "Politics",
        trending: false,
        views: 43000,
        url: "#",
      },
    ],
  },
  business: {
    id: "business",
    name: "Business",
    icon: <Briefcase className="w-6 h-6" />,
    color: "bg-green-600",
    description: "Market trends, economic insights, and corporate developments",
    totalArticles: 203,
    trending: 31,
    sources: ["Bloomberg", "Wall Street Journal", "Financial Times", "Forbes", "Reuters Business"],
    articles: [
      {
        id: "bus-1",
        title: "Tech Giants Report Record Quarterly Earnings",
        summary:
          "Major technology companies exceed expectations with strong revenue growth driven by AI investments and cloud services expansion across global markets.",
        imageUrl: "/placeholder.svg?height=300&width=500",
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
        summary:
          "Digital currencies gain momentum as institutional investors return to the market, with Bitcoin reaching new monthly highs amid regulatory clarity.",
        imageUrl: "/placeholder.svg?height=300&width=500",
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
      {
        id: "bus-3",
        title: "Renewable Energy Investments Reach New Heights",
        summary:
          "Green energy sector attracts unprecedented funding as companies pivot to sustainability, with $200 billion invested in clean technology this quarter.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "Reuters Business",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Frankfurt",
        country: "Germany",
        publishedAt: "2024-01-15T11:30:00Z",
        readTime: 5,
        category: "Business",
        trending: false,
        views: 72000,
        url: "#",
      },
      {
        id: "bus-4",
        title: "Global Supply Chain Disruptions Ease",
        summary:
          "International shipping routes show significant improvement as port congestion decreases and logistics networks adapt to new trade patterns.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "Financial Times",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "London",
        country: "United Kingdom",
        publishedAt: "2024-01-15T09:15:00Z",
        readTime: 6,
        category: "Business",
        trending: true,
        views: 94000,
        url: "#",
      },
      {
        id: "bus-5",
        title: "Merger Creates Industry Giant",
        summary:
          "Two major corporations announce $50 billion merger deal, creating the world's largest company in their sector and reshaping competitive landscape.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "Forbes",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "New York",
        country: "United States",
        publishedAt: "2024-01-15T07:45:00Z",
        readTime: 7,
        category: "Business",
        trending: true,
        views: 112000,
        url: "#",
      },
      {
        id: "bus-6",
        title: "Inflation Rates Show Encouraging Decline",
        summary:
          "Economic indicators suggest inflation is cooling across major economies, providing relief for consumers and potentially influencing central bank policies.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "Bloomberg Economics",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Washington",
        country: "United States",
        publishedAt: "2024-01-15T06:30:00Z",
        readTime: 5,
        category: "Business",
        trending: false,
        views: 67000,
        url: "#",
      },
    ],
  },
  technology: {
    id: "technology",
    name: "Technology",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-blue-600",
    description: "Innovation, digital transformation, and cutting-edge tech developments",
    totalArticles: 189,
    trending: 42,
    sources: ["TechCrunch", "Wired", "MIT Technology Review", "The Verge", "Ars Technica"],
    articles: [
      {
        id: "tech-1",
        title: "Breakthrough in Quantum Computing Achieved",
        summary:
          "Scientists achieve 99.9% error correction in quantum processors, marking a major milestone toward practical quantum computing applications in cryptography and drug discovery.",
        imageUrl: "/placeholder.svg?height=300&width=500",
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
        summary:
          "Artificial intelligence applications show remarkable success in medical diagnosis and treatment, with AI systems now detecting diseases earlier than human doctors.",
        imageUrl: "/placeholder.svg?height=300&width=500",
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
      {
        id: "tech-3",
        title: "Space Technology Enables Mars Communication",
        summary:
          "New satellite network establishes reliable communication link with Mars missions, reducing signal delay and enabling real-time collaboration with astronauts.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "Space News",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Houston",
        country: "United States",
        publishedAt: "2024-01-15T12:30:00Z",
        readTime: 5,
        category: "Technology",
        trending: false,
        views: 91000,
        url: "#",
      },
      {
        id: "tech-4",
        title: "5G Network Expansion Accelerates Globally",
        summary:
          "Next-generation wireless networks reach 2 billion users worldwide, enabling new applications in autonomous vehicles and smart city infrastructure.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "TechCrunch",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "San Francisco",
        country: "United States",
        publishedAt: "2024-01-15T10:45:00Z",
        readTime: 4,
        category: "Technology",
        trending: true,
        views: 87000,
        url: "#",
      },
      {
        id: "tech-5",
        title: "Cybersecurity Threats Evolve with AI",
        summary:
          "Security experts warn of sophisticated AI-powered attacks while developing advanced defense systems to protect critical infrastructure and personal data.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "Wired Security",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "San Francisco",
        country: "United States",
        publishedAt: "2024-01-15T08:20:00Z",
        readTime: 8,
        category: "Technology",
        trending: true,
        views: 76000,
        url: "#",
      },
      {
        id: "tech-6",
        title: "Renewable Energy Storage Breakthrough",
        summary:
          "Revolutionary battery technology promises to store renewable energy for weeks, solving the intermittency problem and accelerating clean energy adoption.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "MIT Energy Initiative",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Cambridge",
        country: "United States",
        publishedAt: "2024-01-15T07:00:00Z",
        readTime: 6,
        category: "Technology",
        trending: false,
        views: 65000,
        url: "#",
      },
    ],
  },
  entertainment: {
    id: "entertainment",
    name: "Entertainment",
    icon: <Gamepad2 className="w-6 h-6" />,
    color: "bg-purple-600",
    description: "Movies, music, gaming, and pop culture from around the globe",
    totalArticles: 145,
    trending: 28,
    sources: ["Entertainment Weekly", "Variety", "The Hollywood Reporter", "Rolling Stone", "IGN"],
    articles: [
      {
        id: "ent-1",
        title: "Film Festival Showcases Global Cinema",
        summary:
          "International filmmakers present diverse stories at this year's prestigious festival, highlighting emerging talent and groundbreaking storytelling techniques.",
        imageUrl: "/placeholder.svg?height=300&width=500",
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
        summary:
          "Competition intensifies as new streaming services launch with exclusive content, changing how audiences consume entertainment worldwide.",
        imageUrl: "/placeholder.svg?height=300&width=500",
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
      {
        id: "ent-3",
        title: "Music Industry Embraces Virtual Concerts",
        summary:
          "Artists explore new ways to connect with audiences through immersive digital experiences, revolutionizing live music performance.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "Rolling Stone",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Nashville",
        country: "United States",
        publishedAt: "2024-01-15T13:20:00Z",
        readTime: 5,
        category: "Entertainment",
        trending: false,
        views: 54000,
        url: "#",
      },
      {
        id: "ent-4",
        title: "Gaming Industry Breaks Revenue Records",
        summary:
          "Video game sales reach unprecedented levels as mobile gaming and esports continue to attract millions of new players globally.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "IGN",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "San Francisco",
        country: "United States",
        publishedAt: "2024-01-15T11:30:00Z",
        readTime: 4,
        category: "Entertainment",
        trending: true,
        views: 92000,
        url: "#",
      },
      {
        id: "ent-5",
        title: "Celebrity Social Impact Initiatives Grow",
        summary:
          "Entertainment industry figures increasingly use their platforms for social causes, driving awareness and funding for global humanitarian efforts.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "The Hollywood Reporter",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Los Angeles",
        country: "United States",
        publishedAt: "2024-01-15T09:15:00Z",
        readTime: 6,
        category: "Entertainment",
        trending: false,
        views: 48000,
        url: "#",
      },
      {
        id: "ent-6",
        title: "Animation Studios Pioneer New Techniques",
        summary:
          "Cutting-edge animation technology creates more realistic and emotionally engaging content, pushing the boundaries of visual storytelling.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "Animation Magazine",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Los Angeles",
        country: "United States",
        publishedAt: "2024-01-15T07:45:00Z",
        readTime: 5,
        category: "Entertainment",
        trending: false,
        views: 39000,
        url: "#",
      },
    ],
  },
  health: {
    id: "health",
    name: "Health",
    icon: <Heart className="w-6 h-6" />,
    color: "bg-pink-600",
    description: "Medical breakthroughs, wellness trends, and global health initiatives",
    totalArticles: 167,
    trending: 19,
    sources: ["New England Journal of Medicine", "Harvard Health", "WHO", "Mayo Clinic", "Nature Medicine"],
    articles: [
      {
        id: "health-1",
        title: "Revolutionary Gene Therapy Shows Promise",
        summary:
          "Clinical trials demonstrate 95% success rate for new treatment, offering hope to millions of patients with previously incurable genetic disorders.",
        imageUrl: "/placeholder.svg?height=300&width=500",
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
        summary:
          "Global initiatives focus on destigmatizing mental health and improving access to care, with innovative therapy approaches showing remarkable results.",
        imageUrl: "/placeholder.svg?height=300&width=500",
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
      {
        id: "health-3",
        title: "Nutrition Science Reveals New Insights",
        summary:
          "Latest research challenges conventional wisdom about diet and longevity, providing evidence-based guidelines for optimal health and disease prevention.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "Harvard Health",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Cambridge",
        country: "United States",
        publishedAt: "2024-01-15T12:15:00Z",
        readTime: 4,
        category: "Health",
        trending: false,
        views: 83000,
        url: "#",
      },
      {
        id: "health-4",
        title: "Telemedicine Adoption Transforms Healthcare",
        summary:
          "Remote healthcare services become mainstream, improving access to medical care in underserved areas and reducing healthcare costs globally.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "Mayo Clinic Proceedings",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Rochester",
        country: "United States",
        publishedAt: "2024-01-15T10:30:00Z",
        readTime: 5,
        category: "Health",
        trending: true,
        views: 95000,
        url: "#",
      },
      {
        id: "health-5",
        title: "Vaccine Development Accelerates for Emerging Diseases",
        summary:
          "Scientists develop rapid response protocols for future pandemics, using mRNA technology to create vaccines in record time.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "Nature Medicine",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "London",
        country: "United Kingdom",
        publishedAt: "2024-01-15T08:45:00Z",
        readTime: 7,
        category: "Health",
        trending: false,
        views: 71000,
        url: "#",
      },
      {
        id: "health-6",
        title: "Personalized Medicine Becomes Reality",
        summary:
          "Genetic testing and AI analysis enable customized treatment plans, improving patient outcomes and reducing adverse drug reactions.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "Precision Medicine Today",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "San Francisco",
        country: "United States",
        publishedAt: "2024-01-15T07:20:00Z",
        readTime: 6,
        category: "Health",
        trending: false,
        views: 58000,
        url: "#",
      },
    ],
  },
  sports: {
    id: "sports",
    name: "Sports",
    icon: <Globe className="w-6 h-6" />,
    color: "bg-orange-600",
    description: "Athletic achievements, competitions, and sports industry developments",
    totalArticles: 234,
    trending: 37,
    sources: ["ESPN", "Sports Illustrated", "The Athletic", "Olympic Channel", "FIFA"],
    articles: [
      {
        id: "sports-1",
        title: "World Championship Breaks Viewership Records",
        summary:
          "Global audience reaches unprecedented numbers for this year's championship event, with streaming platforms reporting 500% increase in viewership.",
        imageUrl: "/placeholder.svg?height=300&width=500",
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
        summary:
          "Next Olympic Games promise cutting-edge technology and sustainable practices, setting new standards for international sporting events.",
        imageUrl: "/placeholder.svg?height=300&width=500",
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
      {
        id: "sports-3",
        title: "Athlete Mental Health Takes Center Stage",
        summary:
          "Sports organizations prioritize mental wellness programs for professional athletes, recognizing the importance of psychological support in peak performance.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "Sports Illustrated",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "New York",
        country: "United States",
        publishedAt: "2024-01-15T14:00:00Z",
        readTime: 4,
        category: "Sports",
        trending: false,
        views: 95000,
        url: "#",
      },
      {
        id: "sports-4",
        title: "Women's Sports Gain Unprecedented Support",
        summary:
          "Investment in women's athletics reaches record levels as viewership and sponsorship deals create new opportunities for female athletes worldwide.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "The Athletic",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "New York",
        country: "United States",
        publishedAt: "2024-01-15T12:45:00Z",
        readTime: 6,
        category: "Sports",
        trending: true,
        views: 87000,
        url: "#",
      },
      {
        id: "sports-5",
        title: "Technology Transforms Sports Performance",
        summary:
          "Advanced analytics and wearable technology revolutionize training methods, helping athletes optimize performance and prevent injuries.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "Sports Tech Weekly",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "London",
        country: "United Kingdom",
        publishedAt: "2024-01-15T10:20:00Z",
        readTime: 5,
        category: "Sports",
        trending: false,
        views: 73000,
        url: "#",
      },
      {
        id: "sports-6",
        title: "Esports Recognition Grows Globally",
        summary:
          "Competitive gaming gains official recognition as a sport in multiple countries, with universities offering scholarships and professional leagues expanding.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        source: "Esports Insider",
        sourceLogo: "/placeholder.svg?height=30&width=100",
        location: "Seoul",
        country: "South Korea",
        publishedAt: "2024-01-15T08:30:00Z",
        readTime: 4,
        category: "Sports",
        trending: true,
        views: 104000,
        url: "#",
      },
    ],
  },
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "trending">("latest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filteredArticles, setFilteredArticles] = useState<TrendingNews[]>([])

  const category = categoryData[slug]

  useEffect(() => {
    if (category) {
      let articles = [...category.articles]

      // Filter by search query
      if (searchQuery) {
        articles = articles.filter(
          (article) =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.source.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      // Sort articles
      switch (sortBy) {
        case "popular":
          articles.sort((a, b) => b.views - a.views)
          break
        case "trending":
          articles.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0))
          break
        case "latest":
        default:
          articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          break
      }

      setFilteredArticles(articles)
    }
  }, [category, searchQuery, sortBy])

  if (!category) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
          <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700">
            Return Home
          </Button>
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
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => router.push("/")} className="text-gray-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Category Header */}
          <div className="flex items-center gap-6 mb-8">
            <div className={`p-4 rounded-xl ${category.color}`}>{category.icon}</div>
            <div className="flex-1">
              <h1 className="text-5xl font-bold text-white mb-2">{category.name}</h1>
              <p className="text-gray-300 text-lg mb-4">{category.description}</p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">{category.totalArticles} Total Articles</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-red-400" />
                  <span className="text-gray-300">{category.trending} Trending Now</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300">{category.sources.length} Top Sources</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={`Search ${category.name.toLowerCase()} news...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "latest" | "popular" | "trending")}
                className="px-4 py-2 bg-black/60 border border-gray-600 rounded-md text-white focus:border-blue-400"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="border-gray-600 text-gray-300 hover:text-white"
              >
                {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Top Sources */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">Top Sources</h3>
            <div className="flex flex-wrap gap-2">
              {category.sources.map((source) => (
                <Badge key={source} variant="outline" className="border-gray-600 text-gray-300">
                  {source}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Articles Grid/List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {searchQuery ? `Search Results (${filteredArticles.length})` : "Latest Articles"}
            </h2>
            <div className="text-sm text-gray-400">
              Sorted by {sortBy === "latest" ? "Latest" : sortBy === "popular" ? "Most Popular" : "Trending"}
            </div>
          </div>

          {filteredArticles.length === 0 ? (
            <Card className="bg-black/60 border-gray-700 text-center p-12">
              <CardContent>
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2 text-white">No articles found</h3>
                <p className="text-gray-300">Try adjusting your search terms or filters.</p>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredArticles.map((article) =>
                viewMode === "grid" ? (
                  <ArticleCard key={article.id} article={article} />
                ) : (
                  <ArticleListItem key={article.id} article={article} />
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Article Card Component for Grid View
function ArticleCard({ article }: { article: TrendingNews }) {
  return (
    <Card className="bg-black/60 border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
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
        </div>

        <div className="p-6 space-y-4">
          <h3 className="text-lg font-bold line-clamp-3 text-white leading-tight">{article.title}</h3>
          <p className="text-gray-300 text-sm line-clamp-3">{article.summary}</p>

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

// Article List Item Component for List View
function ArticleListItem({ article }: { article: TrendingNews }) {
  return (
    <Card className="bg-black/60 border-gray-700 hover:border-blue-500 transition-colors">
      <CardContent className="p-6">
        <div className="flex gap-6">
          <Image
            src={article.imageUrl || "/placeholder.svg?height=120&width=160"}
            alt={article.title}
            width={160}
            height={120}
            className="object-cover rounded flex-shrink-0"
          />
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold text-white line-clamp-2 flex-1">{article.title}</h3>
              {article.trending && (
                <Badge className="ml-4 bg-red-500 text-white">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
            <p className="text-gray-300 line-clamp-2">{article.summary}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-400">
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
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {(article.views / 1000).toFixed(0)}K
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readTime}m
                </div>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
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

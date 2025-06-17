"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { LocationData, NewsArticle } from "@/types/news"
import { MapPin, Clock, ExternalLink, TrendingUp } from "lucide-react"

interface LocationNewsDialogProps {
  location: LocationData | null
  isOpen: boolean
  onClose: () => void
}

export default function LocationNewsDialog({ location, isOpen, onClose }: LocationNewsDialogProps) {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)

  if (!location) return null

  // Get top 3 articles from all sources for this location
  const allArticles = location.topSources
    .flatMap((source) =>
      source.articles.map((article) => ({
        ...article,
        sourceName: source.name,
        sourceLogo: source.logo,
        trustScore: source.trustScore,
      })),
    )
    .slice(0, 3)

  if (selectedArticle) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-black/95 border-gray-700 text-white">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                Breaking News
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedArticle(null)}
                className="text-gray-400 hover:text-white"
              >
                ← Back to Top Stories
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
              <div className="relative">
                <Image
                  src={selectedArticle.imageUrl || "/placeholder.svg?height=400&width=600"}
                  alt={selectedArticle.title}
                  width={600}
                  height={400}
                  className="rounded-lg object-cover w-full h-64"
                />
                <Badge className="absolute top-3 left-3 bg-blue-600 text-white">Breaking</Badge>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white leading-tight">{selectedArticle.title}</h2>
                <p className="text-gray-300 leading-relaxed">{selectedArticle.summary}</p>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <Image
                    src={selectedArticle.sourceLogo || "/placeholder.svg?height=24&width=80"}
                    alt={selectedArticle.sourceName}
                    width={80}
                    height={24}
                    className="object-contain"
                  />
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {location.name}, {location.country}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(selectedArticle.publishedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Read Full Story
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-black/95 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-400" />
            Top News from {location.name}, {location.country}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-4 p-4">
            <div className="text-center mb-6">
              <Badge variant="outline" className="border-blue-400 text-blue-400 px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                Top 3 Most Popular Stories
              </Badge>
            </div>

            <div className="grid gap-4">
              {allArticles.map((article, index) => (
                <Card
                  key={article.id}
                  className="bg-gray-900/50 border-gray-700 hover:border-blue-500 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                  onClick={() => setSelectedArticle(article)}
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="relative">
                        <Image
                          src={article.imageUrl || "/placeholder.svg?height=150&width=200"}
                          alt={article.title}
                          width={200}
                          height={150}
                          className="rounded object-cover w-full h-32"
                        />
                        <Badge
                          className={`absolute top-2 left-2 text-white ${
                            index === 0 ? "bg-red-500" : index === 1 ? "bg-orange-500" : "bg-yellow-500"
                          }`}
                        >
                          #{index + 1}
                        </Badge>
                      </div>

                      <div className="md:col-span-3 space-y-3">
                        <h3 className="text-xl font-bold text-white line-clamp-2">{article.title}</h3>
                        <p className="text-gray-300 text-sm line-clamp-2">{article.summary}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <Image
                              src={article.sourceLogo || "/placeholder.svg?height=20&width=60"}
                              alt={article.sourceName}
                              width={60}
                              height={20}
                              className="object-contain"
                            />
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(article.publishedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                            Read More →
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

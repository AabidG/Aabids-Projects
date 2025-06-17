"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { LocationData, NewsSource } from "@/types/news"
import { Globe, Star, ExternalLink, Clock } from "lucide-react"
import Image from "next/image"

interface NewsPanelProps {
  location: LocationData | null
  onClose: () => void
}

export default function NewsPanel({ location, onClose }: NewsPanelProps) {
  const [selectedSource, setSelectedSource] = useState<NewsSource | null>(null)

  if (!location) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <CardContent className="text-center p-8">
          <Globe className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Select a Location</h3>
          <p className="text-muted-foreground">
            Click on any red marker on the globe to view news sources for that location
          </p>
        </CardContent>
      </Card>
    )
  }

  if (selectedSource) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={selectedSource.logo || "/placeholder.svg"}
                alt={selectedSource.name}
                width={120}
                height={40}
                className="object-contain"
              />
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{selectedSource.trustScore}/10</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedSource(null)}>
              Back to Sources
            </Button>
          </div>
          <CardDescription>{selectedSource.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4">
              {selectedSource.articles.map((article) => (
                <Card key={article.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Image
                        src={article.imageUrl || "/placeholder.svg"}
                        alt={article.title}
                        width={120}
                        height={80}
                        className="rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2 line-clamp-2">{article.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{article.summary}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Read More
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {location.name}, {location.country}
            </CardTitle>
            <CardDescription>Top trusted news sources in this region</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4">
            {location.topSources.map((source, index) => (
              <Card
                key={source.id}
                className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-green-500"
                onClick={() => setSelectedSource(source)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <Image
                        src={source.logo || "/placeholder.svg"}
                        alt={source.name}
                        width={100}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{source.trustScore}/10</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{source.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{source.website}</span>
                    <Button variant="ghost" size="sm">
                      View Articles →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

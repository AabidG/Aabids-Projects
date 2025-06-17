export interface NewsSource {
  id: string
  name: string
  logo: string
  trustScore: number
  description: string
  website: string
  articles: NewsArticle[]
}

export interface NewsArticle {
  id: string
  title: string
  summary: string
  publishedAt: string
  imageUrl: string
  url: string
}

export interface LocationData {
  id: string
  name: string
  country: string
  coordinates: [number, number] // [lat, lng]
  topSources: NewsSource[]
}

export interface GlobeClickEvent {
  location: LocationData
  position: [number, number, number]
}

export interface TrendingNews {
  id: string
  title: string
  summary: string
  imageUrl: string
  source: string
  sourceLogo: string
  location: string
  country: string
  publishedAt: string
  readTime: number
  category: string
  trending: boolean
  views: number
  url: string
}

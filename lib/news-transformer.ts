import type { RawNewsArticle } from "./news-api"
import type { TrendingNews, NewsSource, LocationData } from "@/types/news"

// Country code to coordinates mapping
const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  us: [39.8283, -98.5795],
  gb: [55.3781, -3.436],
  ca: [56.1304, -106.3468],
  au: [-25.2744, 133.7751],
  de: [51.1657, 10.4515],
  fr: [46.2276, 2.2137],
  jp: [36.2048, 138.2529],
  in: [20.5937, 78.9629],
  br: [-14.235, -51.9253],
  mx: [23.6345, -102.5528],
  ru: [61.524, 105.3188],
  cn: [35.8617, 104.1954],
  za: [-30.5595, 22.9375],
  eg: [26.0975, 30.0444],
  ng: [9.082, 8.6753],
  ar: [-38.4161, -63.6167],
  cl: [-35.6751, -71.543],
  pe: [-9.19, -75.0152],
  co: [4.5709, -74.2973],
  ve: [6.4238, -66.5897],
}

// Source credibility scores (you can expand this)
const SOURCE_TRUST_SCORES: Record<string, number> = {
  "BBC News": 9.2,
  Reuters: 9.0,
  "Associated Press": 8.9,
  "The Guardian": 8.5,
  NPR: 8.7,
  "The New York Times": 8.3,
  "The Washington Post": 8.1,
  CNN: 7.8,
  "Fox News": 7.2,
  "Al Jazeera": 8.0,
  "Deutsche Welle": 8.4,
  "France 24": 8.2,
  "NHK World": 8.6,
  "Times of India": 7.5,
  "The Hindu": 8.1,
  "South China Morning Post": 7.9,
  RT: 6.5,
  Sputnik: 6.2,
}

export class NewsTransformer {
  static transformArticleToTrendingNews(article: RawNewsArticle, country = "us", category = "general"): TrendingNews {
    const location = this.getLocationFromCountry(country)
    const trustScore = SOURCE_TRUST_SCORES[article.source.name] || 7.0

    return {
      id: this.generateArticleId(article),
      title: article.title,
      summary: article.description || article.content?.substring(0, 200) + "..." || "",
      imageUrl: article.urlToImage || `/placeholder.svg?height=300&width=500`,
      source: article.source.name,
      sourceLogo: this.getSourceLogo(article.source.name),
      location: location.city,
      country: location.country,
      publishedAt: article.publishedAt,
      readTime: this.calculateReadTime(article.content || article.description || ""),
      category: this.categorizeArticle(article.title, article.description || ""),
      trending: this.isTrending(article),
      views: this.generateViewCount(),
      url: article.url,
    }
  }

  static transformToLocationData(country: string, articles: RawNewsArticle[]): LocationData {
    const location = this.getLocationFromCountry(country)
    const coordinates = COUNTRY_COORDINATES[country.toLowerCase()] || [0, 0]

    // Group articles by source
    const sourceMap = new Map<string, RawNewsArticle[]>()
    articles.forEach((article) => {
      const sourceName = article.source.name
      if (!sourceMap.has(sourceName)) {
        sourceMap.set(sourceName, [])
      }
      sourceMap.get(sourceName)!.push(article)
    })

    // Create top sources
    const topSources: NewsSource[] = Array.from(sourceMap.entries())
      .slice(0, 3)
      .map(([sourceName, sourceArticles]) => ({
        id: sourceName.toLowerCase().replace(/\s+/g, "-"),
        name: sourceName,
        logo: this.getSourceLogo(sourceName),
        trustScore: SOURCE_TRUST_SCORES[sourceName] || 7.0,
        description: this.getSourceDescription(sourceName),
        website: this.getSourceWebsite(sourceName),
        articles: sourceArticles.map((article) => ({
          id: this.generateArticleId(article),
          title: article.title,
          summary: article.description || "",
          publishedAt: article.publishedAt,
          imageUrl: article.urlToImage || `/placeholder.svg?height=200&width=300`,
          url: article.url,
        })),
      }))

    return {
      id: `${location.city.toLowerCase()}-${country.toLowerCase()}`,
      name: location.city,
      country: location.country,
      coordinates,
      topSources,
    }
  }

  private static generateArticleId(article: RawNewsArticle): string {
    return btoa(article.url)
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 16)
  }

  private static calculateReadTime(content: string): number {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  }

  private static categorizeArticle(title: string, description: string): string {
    const text = (title + " " + description).toLowerCase()

    if (text.match(/\b(election|vote|government|politics|minister|president|congress|parliament)\b/)) {
      return "Politics"
    }
    if (text.match(/\b(stock|market|economy|business|finance|company|trade|gdp)\b/)) {
      return "Business"
    }
    if (text.match(/\b(technology|tech|ai|computer|software|digital|cyber|innovation)\b/)) {
      return "Technology"
    }
    if (text.match(/\b(health|medical|doctor|hospital|disease|treatment|medicine|covid)\b/)) {
      return "Health"
    }
    if (text.match(/\b(sport|football|soccer|basketball|tennis|olympics|game|match)\b/)) {
      return "Sports"
    }
    if (text.match(/\b(movie|music|entertainment|celebrity|film|actor|artist|culture)\b/)) {
      return "Entertainment"
    }
    if (text.match(/\b(science|research|study|discovery|climate|environment|space)\b/)) {
      return "Science"
    }

    return "General"
  }

  private static isTrending(article: RawNewsArticle): boolean {
    const publishedTime = new Date(article.publishedAt).getTime()
    const now = Date.now()
    const hoursOld = (now - publishedTime) / (1000 * 60 * 60)

    // Consider articles trending if they're less than 6 hours old
    return hoursOld < 6
  }

  private static generateViewCount(): number {
    // Generate realistic view counts based on normal distribution
    return Math.floor(Math.random() * 200000) + 10000
  }

  private static getLocationFromCountry(countryCode: string): { city: string; country: string } {
    const locations: Record<string, { city: string; country: string }> = {
      us: { city: "New York", country: "United States" },
      gb: { city: "London", country: "United Kingdom" },
      ca: { city: "Toronto", country: "Canada" },
      au: { city: "Sydney", country: "Australia" },
      de: { city: "Berlin", country: "Germany" },
      fr: { city: "Paris", country: "France" },
      jp: { city: "Tokyo", country: "Japan" },
      in: { city: "Mumbai", country: "India" },
      br: { city: "São Paulo", country: "Brazil" },
      mx: { city: "Mexico City", country: "Mexico" },
      ru: { city: "Moscow", country: "Russia" },
      cn: { city: "Beijing", country: "China" },
      za: { city: "Cape Town", country: "South Africa" },
      eg: { city: "Cairo", country: "Egypt" },
      ng: { city: "Lagos", country: "Nigeria" },
      ar: { city: "Buenos Aires", country: "Argentina" },
      cl: { city: "Santiago", country: "Chile" },
      pe: { city: "Lima", country: "Peru" },
      co: { city: "Bogotá", country: "Colombia" },
      ve: { city: "Caracas", country: "Venezuela" },
    }

    return locations[countryCode.toLowerCase()] || { city: "Unknown", country: "Unknown" }
  }

  private static getSourceLogo(sourceName: string): string {
    // In production, you'd have actual logos
    return `/placeholder.svg?height=40&width=120&text=${encodeURIComponent(sourceName)}`
  }

  private static getSourceDescription(sourceName: string): string {
    const descriptions: Record<string, string> = {
      "BBC News": "British public service broadcaster providing global news coverage",
      Reuters: "International news agency providing business and financial news",
      "Associated Press": "American multinational nonprofit news agency",
      "The Guardian": "British daily newspaper with global digital presence",
      CNN: "American news-based television channel and website",
      "Al Jazeera": "Qatari state-funded international news network",
      "The New York Times": "American newspaper with worldwide influence",
      "The Washington Post": "American daily newspaper published in Washington, D.C.",
    }

    return descriptions[sourceName] || `${sourceName} - News and information source`
  }

  private static getSourceWebsite(sourceName: string): string {
    const websites: Record<string, string> = {
      "BBC News": "bbc.com/news",
      Reuters: "reuters.com",
      "Associated Press": "apnews.com",
      "The Guardian": "theguardian.com",
      CNN: "cnn.com",
      "Al Jazeera": "aljazeera.com",
      "The New York Times": "nytimes.com",
      "The Washington Post": "washingtonpost.com",
    }

    return websites[sourceName] || `${sourceName.toLowerCase().replace(/\s+/g, "")}.com`
  }
}

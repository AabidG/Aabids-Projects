// News API configuration and client
export interface NewsAPIConfig {
  apiKey: string
  baseUrl: string
  rateLimitPerHour: number
}

export interface NewsAPIResponse {
  status: string
  totalResults: number
  articles: RawNewsArticle[]
}

export interface RawNewsArticle {
  source: {
    id: string | null
    name: string
  }
  author: string | null
  title: string
  description: string
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

export interface GeoNewsParams {
  country?: string
  category?: string
  q?: string
  sources?: string
  language?: string
  pageSize?: number
  page?: number
}

class NewsAPIClient {
  private config: NewsAPIConfig
  private requestCount = 0
  private lastResetTime: number = Date.now()

  constructor(config: NewsAPIConfig) {
    this.config = config
  }

  private checkRateLimit(): boolean {
    const now = Date.now()
    const hoursPassed = (now - this.lastResetTime) / (1000 * 60 * 60)

    if (hoursPassed >= 1) {
      this.requestCount = 0
      this.lastResetTime = now
    }

    return this.requestCount < this.config.rateLimitPerHour
  }

  private async makeRequest(endpoint: string, params: Record<string, any>): Promise<any> {
    if (!this.checkRateLimit()) {
      throw new Error("Rate limit exceeded. Please try again later.")
    }

    const url = new URL(`${this.config.baseUrl}${endpoint}`)

    // Add API key and params
    url.searchParams.append("apiKey", this.config.apiKey)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString())
      }
    })

    try {
      this.requestCount++
      const response = await fetch(url.toString(), {
        headers: {
          "User-Agent": "GlobalNewsHub/1.0",
        },
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("News API request failed:", error)
      throw error
    }
  }

  async getTopHeadlines(params: GeoNewsParams = {}): Promise<NewsAPIResponse> {
    return this.makeRequest("/top-headlines", {
      country: params.country || "us",
      category: params.category,
      q: params.q,
      sources: params.sources,
      pageSize: params.pageSize || 20,
      page: params.page || 1,
    })
  }

  async getEverything(params: GeoNewsParams = {}): Promise<NewsAPIResponse> {
    return this.makeRequest("/everything", {
      q: params.q || "news",
      sources: params.sources,
      language: params.language || "en",
      pageSize: params.pageSize || 20,
      page: params.page || 1,
      sortBy: "publishedAt",
    })
  }

  async getNewsByLocation(country: string, category?: string): Promise<NewsAPIResponse> {
    return this.getTopHeadlines({
      country: country.toLowerCase(),
      category,
      pageSize: 10,
    })
  }

  async searchNews(query: string, language = "en"): Promise<NewsAPIResponse> {
    return this.getEverything({
      q: query,
      language,
      pageSize: 20,
    })
  }
}

// Export configured client
export const newsAPI = new NewsAPIClient({
  apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY || "",
  baseUrl: "https://newsapi.org/v2",
  rateLimitPerHour: 1000, // Free tier limit
})

// Alternative APIs for better global coverage
export const alternativeAPIs = {
  // Guardian API - Great for international news
  guardian: {
    baseUrl: "https://content.guardianapis.com",
    apiKey: process.env.NEXT_PUBLIC_GUARDIAN_API_KEY || "",
  },
  // BBC News API
  bbc: {
    baseUrl: "https://feeds.bbci.co.uk/news",
  },
  // Reuters API
  reuters: {
    baseUrl: "https://www.reuters.com/pf/api/v3/content/fetch/articles-by-section-alias-or-id-v1",
  },
}

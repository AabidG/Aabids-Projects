import { type NextRequest, NextResponse } from "next/server"
import { newsAPI } from "@/lib/news-api"
import { NewsTransformer } from "@/lib/news-transformer"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const country = searchParams.get("country") || "us"
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Fetch trending news from multiple countries for global perspective
    const countries = ["us", "gb", "de", "fr", "jp", "in", "br"]
    const promises = countries.map(async (countryCode) => {
      try {
        const response = await newsAPI.getTopHeadlines({
          country: countryCode,
          category: category || undefined,
          pageSize: 5,
        })

        return response.articles.map((article) =>
          NewsTransformer.transformArticleToTrendingNews(article, countryCode, category || "general"),
        )
      } catch (error) {
        console.error(`Failed to fetch news for ${countryCode}:`, error)
        return []
      }
    })

    const results = await Promise.all(promises)
    const allArticles = results.flat()

    // Sort by trending score and recency
    const trendingArticles = allArticles
      .sort((a, b) => {
        const aScore = (a.trending ? 10 : 0) + a.views / 10000
        const bScore = (b.trending ? 10 : 0) + b.views / 10000
        return bScore - aScore
      })
      .slice(0, limit)

    return NextResponse.json({
      success: true,
      data: trendingArticles,
      total: trendingArticles.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching trending news:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch trending news",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

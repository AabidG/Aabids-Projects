import { type NextRequest, NextResponse } from "next/server"
import { newsAPI } from "@/lib/news-api"
import { NewsTransformer } from "@/lib/news-transformer"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const language = searchParams.get("language") || "en"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    if (!query) {
      return NextResponse.json({ success: false, error: "Search query is required" }, { status: 400 })
    }

    const response = await newsAPI.searchNews(query, language)

    const transformedArticles = response.articles.map((article) =>
      NewsTransformer.transformArticleToTrendingNews(article, "us", "general"),
    )

    // Paginate results
    const startIndex = (page - 1) * limit
    const paginatedArticles = transformedArticles.slice(startIndex, startIndex + limit)

    return NextResponse.json({
      success: true,
      data: paginatedArticles,
      total: response.totalResults,
      page,
      limit,
      hasMore: startIndex + limit < response.totalResults,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error searching news:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search news",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

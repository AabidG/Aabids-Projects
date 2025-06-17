import { type NextRequest, NextResponse } from "next/server"
import { newsAPI } from "@/lib/news-api"
import { NewsTransformer } from "@/lib/news-transformer"

export async function GET(request: NextRequest, { params }: { params: { country: string } }) {
  try {
    const { country } = params
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    // Fetch news for specific country
    const response = await newsAPI.getNewsByLocation(country, category || undefined)

    if (response.articles.length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
        message: `No news found for ${country}`,
      })
    }

    // Transform to LocationData format
    const locationData = NewsTransformer.transformToLocationData(country, response.articles)

    return NextResponse.json({
      success: true,
      data: locationData,
      total: response.articles.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`Error fetching news for ${params.country}:`, error)
    return NextResponse.json(
      {
        success: false,
        error: `Failed to fetch news for ${params.country}`,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestAPIPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testAPI = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Test if API key is available
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY
      console.log("API Key exists:", !!apiKey)
      console.log("API Key first 10 chars:", apiKey?.substring(0, 10))

      if (!apiKey) {
        throw new Error("API key not found. Make sure NEXT_PUBLIC_NEWS_API_KEY is set in .env.local")
      }

      // Make a simple API call
      const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${apiKey}`)

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-black/60 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">API Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-gray-300">
              <p>This page will test if your NewsAPI key is working correctly.</p>
              <p className="text-sm mt-2">
                API Key Status: {process.env.NEXT_PUBLIC_NEWS_API_KEY ? "✅ Found" : "❌ Not Found"}
              </p>
            </div>

            <Button onClick={testAPI} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Testing..." : "Test NewsAPI Connection"}
            </Button>

            {error && (
              <div className="p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
                <strong>❌ Error:</strong> {error}
                <div className="mt-2 text-sm">
                  <p>Common fixes:</p>
                  <ul className="list-disc list-inside">
                    <li>Make sure .env.local file exists in your project root</li>
                    <li>Restart your development server (npm run dev)</li>
                    <li>Check your API key is correct</li>
                  </ul>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="p-4 bg-green-900/50 border border-green-500 rounded text-green-200">
                  <strong>✅ Success!</strong> API is working perfectly! Found {result.totalResults} articles.
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Sample Articles:</h3>
                  {result.articles?.slice(0, 3).map((article: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-800 rounded">
                      <h4 className="font-semibold text-blue-400">{article.title}</h4>
                      <p className="text-sm text-gray-300">Source: {article.source.name}</p>
                      <p className="text-xs text-gray-400">
                        Published: {new Date(article.publishedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const news = await db.news.findUnique({
      where: { 
        slug: params.slug,
        isPublished: true,
      },
    })

    if (!news) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(news)
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    )
  }
}

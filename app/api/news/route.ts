import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "6")
    const category = searchParams.get("category")

    const skip = (page - 1) * limit

    const where: any = { isPublished: true }
    if (category) where.category = category

    const [news, total] = await Promise.all([
      db.news.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: "desc" },
      }),
      db.news.count({ where }),
    ])

    return NextResponse.json({
      data: news,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, excerpt, author, category, slug } = body

    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: "Title, content, and slug are required" },
        { status: 400 }
      )
    }

    const news = await db.news.create({
      data: {
        title,
        content,
        excerpt,
        author,
        category,
        slug,
        isPublished: true,
        publishedAt: new Date(),
      },
    })

    return NextResponse.json(news, { status: 201 })
  } catch (error) {
    console.error("Error creating news:", error)
    return NextResponse.json(
      { error: "Failed to create news" },
      { status: 500 }
    )
  }
}

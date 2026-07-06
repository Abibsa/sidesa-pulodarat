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

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const body = await request.json()
    const { title, content, excerpt, author, category, slug } = body

    const news = await db.news.update({
      where: { slug: params.slug },
      data: {
        title,
        content,
        excerpt,
        author,
        category,
        slug,
      },
    })

    return NextResponse.json(news)
  } catch (error) {
    console.error("Error updating news:", error)
    return NextResponse.json(
      { error: "Failed to update news" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    await db.news.delete({
      where: { slug: params.slug },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting news:", error)
    return NextResponse.json(
      { error: "Failed to delete news" },
      { status: 500 }
    )
  }
}

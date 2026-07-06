import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const body = await request.json()
    const { title, description, category, contactInfo, isActive } = body

    const potential = await db.villagePotential.update({
      where: { id: params.id },
      data: {
        title,
        description,
        category,
        contactInfo,
        isActive: isActive !== false,
      },
    })

    return NextResponse.json(potential)
  } catch (error) {
    console.error("Error updating potential:", error)
    return NextResponse.json(
      { error: "Failed to update potential" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    await db.villagePotential.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting potential:", error)
    return NextResponse.json(
      { error: "Failed to delete potential" },
      { status: 500 }
    )
  }
}

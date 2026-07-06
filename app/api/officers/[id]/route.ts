import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const body = await request.json()
    const { name, position, photo, order, isActive } = body

    const officer = await db.villageOfficer.update({
      where: { id: params.id },
      data: {
        name,
        position,
        photo,
        order: parseInt(order) || 0,
        isActive: isActive !== false,
      },
    })

    return NextResponse.json(officer)
  } catch (error) {
    console.error("Error updating officer:", error)
    return NextResponse.json(
      { error: "Failed to update officer" },
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
    await db.villageOfficer.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting officer:", error)
    return NextResponse.json(
      { error: "Failed to delete officer" },
      { status: 500 }
    )
  }
}

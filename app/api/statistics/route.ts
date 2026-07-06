import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Gender statistics
    const genderStats = await db.resident.groupBy({
      by: ["gender"],
      _count: true,
    })

    // Age group statistics
    const residents = await db.resident.findMany({
      select: { birthDate: true },
    })

    const ageGroups = residents.reduce((acc: any, r) => {
      const age = new Date().getFullYear() - new Date(r.birthDate).getFullYear()
      if (age < 18) acc["0-17"]++
      else if (age < 35) acc["18-34"]++
      else if (age < 50) acc["35-49"]++
      else if (age < 65) acc["50-64"]++
      else acc["65+"]++
      return acc
    }, { "0-17": 0, "18-34": 0, "35-49": 0, "50-64": 0, "65+": 0 })

    // RT/RW statistics
    const rtRwStats = await db.resident.groupBy({
      by: ["rt", "rw"],
      _count: true,
      orderBy: { rt: "asc" },
    })

    // Education statistics
    const educationStats = await db.resident.groupBy({
      by: ["education"],
      _count: true,
    })

    // Occupation statistics
    const occupationStats = await db.resident.groupBy({
      by: ["occupation"],
      _count: true,
    })

    // Marital status statistics
    const maritalStats = await db.resident.groupBy({
      by: ["maritalStatus"],
      _count: true,
    })

    // Letter requests statistics (per month)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const letterRequests = await db.letterRequest.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        createdAt: true,
        status: true,
      },
    })

    const lettersByMonth = letterRequests.reduce((acc: any, req) => {
      const month = new Date(req.createdAt).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
      })
      if (!acc[month]) acc[month] = 0
      acc[month]++
      return acc
    }, {})

    // Letter status statistics
    const letterStatusStats = await db.letterRequest.groupBy({
      by: ["status"],
      _count: true,
    })

    return NextResponse.json({
      gender: genderStats.map((s) => ({
        name: s.gender === "LAKI_LAKI" ? "Laki-laki" : "Perempuan",
        value: s._count,
      })),
      ageGroups: Object.entries(ageGroups).map(([name, value]) => ({
        name,
        value,
      })),
      rtRw: rtRwStats.map((s) => ({
        name: `RT ${s.rt}/RW ${s.rw}`,
        value: s._count,
      })),
      education: educationStats.map((s) => ({
        name: s.education,
        value: s._count,
      })),
      occupation: occupationStats
        .map((s) => ({
          name: s.occupation,
          value: s._count,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10),
      maritalStatus: maritalStats.map((s) => ({
        name: s.maritalStatus.replace(/_/g, " "),
        value: s._count,
      })),
      lettersByMonth: Object.entries(lettersByMonth).map(([name, value]) => ({
        name,
        value,
      })),
      letterStatus: letterStatusStats.map((s) => ({
        name: s.status,
        value: s._count,
      })),
      totals: {
        residents: await db.resident.count(),
        families: await db.resident.findMany({ select: { kk: true }, distinct: ["kk"] }).then(r => r.length),
        letters: await db.letterRequest.count(),
        pendingLetters: await db.letterRequest.count({
          where: { status: "DIAJUKAN" },
        }),
        rtCount: await db.resident.findMany({ select: { rt: true }, distinct: ["rt"] }).then(r => r.length),
        rwCount: await db.resident.findMany({ select: { rw: true }, distinct: ["rw"] }).then(r => r.length),
      },
    })
  } catch (error) {
    console.error("Error fetching statistics:", error)
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    )
  }
}

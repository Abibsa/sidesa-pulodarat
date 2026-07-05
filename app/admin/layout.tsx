import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
import Link from "next/link"

// Force Node.js runtime because we use PostgreSQL adapter
export const runtime = 'nodejs'

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-bold text-blue-600">
                SIDESA Admin
              </Link>
              <div className="hidden md:flex items-center gap-4">
                <Link href="/admin" className="text-sm text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link href="/admin/penduduk" className="text-sm text-gray-700 hover:text-blue-600">
                  Data Penduduk
                </Link>
                <Link href="/admin/surat" className="text-sm text-gray-700 hover:text-blue-600">
                  Pengajuan Surat
                </Link>
                <Link href="/admin/statistik" className="text-sm text-gray-700 hover:text-blue-600">
                  Statistik
                </Link>
                <Link href="/" className="text-sm text-gray-700 hover:text-blue-600" target="_blank">
                  Lihat Website
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session.user.name} <span className="text-blue-600">({session.user.role})</span>
              </span>
              <form action={async () => {
                "use server"
                const { signOut } = await import("@/auth")
                await signOut({ redirectTo: "/login" })
              }}>
                <button
                  type="submit"
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

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
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-bold text-primary">
                SIDESA Admin
              </Link>
              <div className="hidden md:flex flex-wrap items-center gap-4">
                <Link href="/admin" className="text-sm text-foreground/80 hover:text-primary">
                  Dashboard
                </Link>
                <Link href="/admin/penduduk" className="text-sm text-foreground/80 hover:text-primary">
                  Penduduk
                </Link>
                <Link href="/admin/surat" className="text-sm text-foreground/80 hover:text-primary">
                  Surat
                </Link>
                <Link href="/admin/berita" className="text-sm text-foreground/80 hover:text-primary">
                  Berita
                </Link>
                <Link href="/admin/profil" className="text-sm text-foreground/80 hover:text-primary">
                  Profil
                </Link>
                <Link href="/admin/aparatur" className="text-sm text-foreground/80 hover:text-primary">
                  Aparatur
                </Link>
                <Link href="/admin/potensi" className="text-sm text-foreground/80 hover:text-primary">
                  Potensi
                </Link>
                <Link href="/admin/statistik" className="text-sm text-foreground/80 hover:text-primary">
                  Statistik
                </Link>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary" target="_blank">
                  Lihat Web
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground">
                {session.user.name} <span className="text-primary font-medium">({session.user.role})</span>
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

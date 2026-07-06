import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
import AdminNavClient from "@/components/AdminNavClient"

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
          <AdminNavClient
            userName={session.user.name || "Admin"}
            userRole={session.user.role || "OPERATOR"}
          />
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}


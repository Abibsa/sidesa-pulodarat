"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import ThemeToggle from "./ThemeToggle"

interface AdminNavClientProps {
  userName: string
  userRole: string
}

export default function AdminNavClient({ userName, userRole }: AdminNavClientProps) {
  const pathname = usePathname()

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/penduduk", label: "Penduduk" },
    { href: "/admin/surat", label: "Surat" },
    { href: "/admin/berita", label: "Berita" },
    { href: "/admin/profil", label: "Profil" },
    { href: "/admin/aparatur", label: "Aparatur" },
    { href: "/admin/potensi", label: "Potensi" },
    { href: "/admin/statistik", label: "Statistik" },
  ]

  return (
    <div className="flex justify-between h-16">
      <div className="flex items-center gap-8">
        <Link href="/admin" className="text-xl font-bold text-primary">
          SIDESA Admin
        </Link>
        <div className="hidden md:flex flex-wrap items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-primary"
                  : "text-foreground/80 hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary" target="_blank">
            Lihat Web
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <span className="text-sm text-foreground">
          {userName} <span className="text-primary font-medium">({userRole})</span>
        </span>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  )
}


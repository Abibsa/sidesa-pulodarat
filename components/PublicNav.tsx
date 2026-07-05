import Link from "next/link"
import { Button } from "./ui/button"

export default function PublicNav() {
  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="font-bold text-xl text-blue-600">
            SIDESA
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Beranda
            </Link>
            <Link href="/profil" className="text-gray-700 hover:text-blue-600">
              Profil Desa
            </Link>
            <Link href="/berita" className="text-gray-700 hover:text-blue-600">
              Berita
            </Link>
            <Link href="/potensi" className="text-gray-700 hover:text-blue-600">
              Potensi Desa
            </Link>
            <Link href="/kontak" className="text-gray-700 hover:text-blue-600">
              Kontak
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/surat">
              <Button>Ajukan Surat</Button>
            </Link>
            <Link href="/cek-status">
              <Button variant="outline">Cek Status</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

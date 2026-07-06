import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { compare } from 'bcryptjs'
import 'dotenv/config'

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

async function checkEnv() {
  console.log('\n--- 2. CEK ENVIRONMENT VARIABLES ---')
  const envVars = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL', 'NEXT_PUBLIC_APP_NAME']
  let allOk = true
  for (const env of envVars) {
    if (!process.env[env]) {
      console.log(`⚠️  Warning: Variable ${env} KOSONG atau belum di-set di .env`)
      allOk = false
    } else {
      console.log(`✅ ${env} OK`)
    }
  }
  return allOk
}

async function checkDatabase() {
  console.log('\n--- 1. KONEKSI DATABASE ---')
  try {
    await prisma.$connect()
    console.log('✅ Koneksi database: OK')
    
    const users = await prisma.user.count().catch(() => 0)
    const news = await prisma.news.count().catch(() => 0)
    const potentials = await prisma.villagePotential.count().catch(() => 0)
    const letters = await prisma.letterRequest.count().catch(() => 0)

    console.log(`📊 Total Users: ${users}`)
    console.log(`📊 Total Berita: ${news}`)
    console.log(`📊 Total Potensi Desa: ${potentials}`)
    console.log(`📊 Total Pengajuan Surat: ${letters}`)
    return true
  } catch (error: any) {
    console.log('❌ Koneksi database: FAILED')
    console.error(error.message)
    return false
  }
}

async function checkRoutes() {
  console.log('\n--- 3. CEK ROUTE / HALAMAN ---')
  const routes = [
    '/', '/profil', '/berita', '/potensi', '/kontak', '/surat', '/cek-status', '/login'
  ]
  
  let successCount = 0
  
  for (const route of routes) {
    try {
      const res = await fetch(`${BASE_URL}${route}`)
      if (res.ok) {
        console.log(`✅ GET ${route} - OK (${res.status})`)
        successCount++
      } else {
        console.log(`❌ GET ${route} - FAILED (${res.status})`)
      }
    } catch (e: any) {
      console.log(`❌ GET ${route} - ERROR (Server mati? Pastikan npm run dev berjalan)`)
    }
  }
  
  return { successCount, total: routes.length }
}

async function checkFunctions() {
  console.log('\n--- 4. CEK FUNGSI UTAMA ---')
  let results = { surat: false, status: false, login: false, loginReason: '' }

  // 1. Cek Auth (Login Admin) directly against DB
  try {
    const adminUser = await prisma.user.findUnique({ where: { email: 'superadmin@desa.id' } })
    if (adminUser) {
      const isValid = await compare('admin123', adminUser.password)
      if (isValid) {
        console.log('✅ Tes Login Admin: OK (Kredensial sesuai di database)')
        results.login = true
      } else {
        console.log('❌ Tes Login Admin: FAILED (Password admin123 salah)')
        results.loginReason = 'Password salah'
      }
    } else {
      console.log('❌ Tes Login Admin: FAILED (User superadmin@desa.id tidak ditemukan. Pastikan sudah di-seed)')
      results.loginReason = 'User tidak ditemukan'
    }
  } catch (e: any) {
    console.log('❌ Tes Login Admin: ERROR', e.message)
    results.loginReason = e.message
  }

  // 2. Tes Ajukan Surat
  let testTicketNumber = `TEST-${Date.now()}`
  try {
    // Mencari tipe surat dulu (misal SKD)
    const letterType = await prisma.letterType.findFirst()
    if (!letterType) {
      console.log('⚠️  Batal tes Ajukan Surat: Tipe surat belum ada di database')
    } else {
      const newRequest = await prisma.letterRequest.create({
        data: {
          ticketNumber: testTicketNumber,
          letterTypeId: letterType.id,
          applicantNik: '1234567890123456',
          applicantName: 'Sistem Tester',
          formData: { note: 'Ini adalah tes sistem' },
          status: 'DIAJUKAN'
        }
      })
      if (newRequest.id) {
        console.log('✅ Tes Ajukan Surat: OK (Data dummy berhasil disimpan)')
        results.surat = true
      }
    }
  } catch (e: any) {
    console.log('❌ Tes Ajukan Surat: FAILED', e.message)
  }

  // 3. Tes Cek Status
  try {
    if (results.surat) {
      const checkReq = await prisma.letterRequest.findUnique({
        where: { ticketNumber: testTicketNumber }
      })
      if (checkReq) {
        console.log(`✅ Tes Cek Status: OK (Surat ${testTicketNumber} ditemukan dengan status ${checkReq.status})`)
        results.status = true
        
        // Hapus data dummy agar bersih
        await prisma.letterRequest.delete({ where: { ticketNumber: testTicketNumber } })
      } else {
        console.log('❌ Tes Cek Status: FAILED (Data tidak ditemukan setelah disimpan)')
      }
    } else {
      console.log('⚠️  Batal tes Cek Status: Tes Ajukan Surat gagal')
    }
  } catch (e: any) {
    console.log('❌ Tes Cek Status: FAILED', e.message)
  }

  return results
}

async function main() {
  console.log('====================================')
  console.log('🚀 MEMULAI TEST SISTEM SIDESA 🚀')
  console.log('====================================')

  const envOk = await checkEnv()
  const dbOk = await checkDatabase()
  
  let routeOk = false
  let routeStats = { successCount: 0, total: 0 }
  
  // Hanya tes routes jika API server/dev server hidup. 
  // Jika ECONNREFUSED di route /, artinya server mati.
  let isServerRunning = true;
  try {
    await fetch(`${BASE_URL}/`)
  } catch {
    isServerRunning = false
  }

  if (isServerRunning) {
    routeStats = await checkRoutes()
    routeOk = routeStats.successCount === routeStats.total
  } else {
    console.log('\n--- 3. CEK ROUTE / HALAMAN ---')
    console.log(`❌ SKIP: Server Next.js (${BASE_URL}) tidak berjalan.`)
    console.log('   Jalankan "npm run dev" di terminal lain terlebih dahulu untuk mengecek route.')
  }

  let funcOk = { surat: false, status: false, login: false, loginReason: '' }
  if (dbOk) {
    funcOk = await checkFunctions()
  }

  console.log('\n====================================')
  console.log('🏁 HASIL AKHIR TES SISTEM SIDESA 🏁')
  console.log('====================================')
  
  console.log(`${dbOk ? '✅' : '❌'} Database Connection: ${dbOk ? 'OK' : 'FAILED'}`)
  console.log(`${envOk ? '✅' : '❌'} Environment Variables: ${envOk ? 'OK' : 'WARNING/FAILED'}`)
  
  if (isServerRunning) {
    console.log(`${routeOk ? '✅' : '❌'} Semua Routes: ${routeOk ? 'OK' : 'FAILED'} (${routeStats.successCount}/${routeStats.total})`)
  } else {
    console.log(`❌ Semua Routes: FAILED (Server belum dijalankan)`)
  }
  
  console.log(`${funcOk.surat ? '✅' : '❌'} Ajukan Surat: ${funcOk.surat ? 'OK' : 'FAILED'}`)
  console.log(`${funcOk.status ? '✅' : '❌'} Cek Status: ${funcOk.status ? 'OK' : 'FAILED'}`)
  console.log(`${funcOk.login ? '✅' : '❌'} Login Admin: ${funcOk.login ? 'OK' : 'FAILED'} ${funcOk.loginReason ? '(' + funcOk.loginReason + ')' : ''}`)
  
  console.log('\n====================================')
}

main().catch(console.error).finally(() => prisma.$disconnect())

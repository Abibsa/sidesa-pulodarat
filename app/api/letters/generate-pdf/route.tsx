import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import React from 'react'
import { Page, Text, View, Document, StyleSheet, renderToStream, Font } from '@react-pdf/renderer'

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    paddingBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
  },
  content: {
    marginTop: 20,
    fontSize: 12,
    lineHeight: 1.5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 150,
  },
  value: {
    flex: 1,
  },
  footer: {
    marginTop: 50,
    alignItems: 'flex-end',
    fontSize: 12,
  },
  signatureBox: {
    width: 200,
    alignItems: 'center',
  },
  signatureLine: {
    marginTop: 50,
    borderTopWidth: 1,
    borderTopColor: '#000000',
    width: 150,
    textAlign: 'center',
    paddingTop: 5,
  }
});

// Create Document Component
const LetterPDF = ({ request, profile }: { request: any, profile: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>PEMERINTAH KABUPATEN JEPARA</Text>
        <Text style={styles.title}>KECAMATAN PECANGAAN</Text>
        <Text style={styles.title}>DESA {profile?.name?.toUpperCase() || 'PULODARAT'}</Text>
        <Text style={styles.subtitle}>{profile?.address || 'Alamat Kantor Desa'}</Text>
      </View>
      
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', textDecoration: 'underline' }}>
          {request.letterType.name.toUpperCase()}
        </Text>
        <Text style={{ fontSize: 12 }}>
          Nomor: {request.ticketNumber} / {new Date().getFullYear()}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={{ marginBottom: 15 }}>
          Yang bertanda tangan di bawah ini Kepala Desa {profile?.name || 'Pulodarat'}, Kecamatan Pecangaan, Kabupaten Jepara, menerangkan dengan sebenarnya bahwa:
        </Text>

        <View style={{ marginLeft: 20, marginBottom: 15 }}>
          <View style={styles.row}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <Text style={styles.value}>: {request.applicantName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>NIK</Text>
            <Text style={styles.value}>: {request.applicantNik}</Text>
          </View>
          
          {request.formData && Object.entries(request.formData).map(([key, value]) => (
             <View style={styles.row} key={key}>
                <Text style={styles.label}>{key}</Text>
                <Text style={styles.value}>: {String(value)}</Text>
             </View>
          ))}
        </View>

        <Text>
          Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.signatureBox}>
          <Text>{profile?.name || 'Pulodarat'}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
          <Text style={{ marginBottom: 40 }}>Kepala Desa {profile?.name || 'Pulodarat'}</Text>
          
          <Text style={styles.signatureLine}>{profile?.headName || '.................................'}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const [letterReq, profile] = await Promise.all([
      db.letterRequest.findUnique({
        where: { id },
        include: { letterType: true }
      }),
      db.villageProfile.findFirst()
    ])

    if (!letterReq) {
      return NextResponse.json({ error: "Letter request not found" }, { status: 404 })
    }

    if (letterReq.status !== "SELESAI") {
      return NextResponse.json({ error: "Surat belum selesai diproses" }, { status: 400 })
    }

    const stream = await renderToStream(<LetterPDF request={letterReq} profile={profile} />);
    
    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Surat_${letterReq.ticketNumber}.pdf"`
      }
    });

  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    )
  }
}

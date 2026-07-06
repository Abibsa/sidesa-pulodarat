import { z } from "zod";

export const residentSchema = z.object({
  nik: z.string().length(16, "NIK harus 16 digit"),
  kk: z.string().length(16, "No. KK harus 16 digit"),
  name: z.string().min(1, "Nama tidak boleh kosong"),
  gender: z.enum(["LAKI_LAKI", "PEREMPUAN"]),
  birthDate: z.string().min(1, "Tanggal lahir tidak boleh kosong"),
  birthPlace: z.string().min(1, "Tempat lahir tidak boleh kosong"),
  address: z.string().min(1, "Alamat tidak boleh kosong"),
  rt: z.string().min(1, "RT tidak boleh kosong"),
  rw: z.string().min(1, "RW tidak boleh kosong"),
  kelurahan: z.string().min(1, "Kelurahan tidak boleh kosong"),
  kecamatan: z.string().min(1, "Kecamatan tidak boleh kosong"),
  religion: z.string().min(1, "Agama tidak boleh kosong"),
  maritalStatus: z.enum(["BELUM_KAWIN", "KAWIN", "CERAI_HIDUP", "CERAI_MATI"]),
  occupation: z.string().min(1, "Pekerjaan tidak boleh kosong"),
  education: z.string().min(1, "Pendidikan tidak boleh kosong"),
});

export const letterRequestSchema = z.object({
  letterTypeId: z.string().min(1, "Jenis surat harus dipilih"),
  applicantNik: z.string().length(16, "NIK pemohon harus 16 digit"),
  applicantName: z.string().min(1, "Nama pemohon tidak boleh kosong"),
  applicantPhone: z.string().optional(),
  applicantEmail: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  formData: z.record(z.string(), z.any()),
});

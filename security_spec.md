# RIKSA Supabase Security Spec

Project ini sekarang memakai Supabase Auth dan tabel dokumen kompatibel Firestore bernama `riksa_documents`.

## Model Data

Semua data lama berbentuk collection/document disimpan sebagai:

- `collection`: nama koleksi lama, misalnya `settings`, `berita`, `galeri`.
- `id`: id dokumen lama, misalnya `general`, `recruitment`, atau `app_...`.
- `data`: payload dokumen dalam `jsonb`.

Schema dan policy utama ada di `supabase/schema.sql`. Admin ditentukan oleh tabel allowlist `riksa_admins`.

## RLS Rules

Policy awal dibuat konservatif:

- Anonymous boleh membaca konten landing page publik saja: `settings/general`, `settings/recruitment`, `settings/cloudinary`, berita `published`, galeri `isVisible`, struktur, dan relawan aktif.
- Anonymous hanya boleh submit pendaftar relawan baru ke `pendaftar_relawan` dengan id `app_%`, status `pending`, dan field wajib dasar.
- User authenticated hanya mendapat akses admin penuh jika emailnya ada di `riksa_admins`.

## Admin Auth

Admin tidak lagi memakai Firebase Authentication. Buat akun admin dari Supabase Dashboard:

1. Buka `Authentication > Users`.
2. Tambahkan user email/password.
3. Pastikan email admin ada di `riksa_admins`. Schema men-seed `simplusewebproject@gmail.com` untuk kompatibilitas awal.
4. Login lewat `/admin/`.

Untuk Google OAuth, aktifkan provider Google di `Authentication > Providers` dan pastikan redirect URL aplikasi sudah ditambahkan.

## Hardening Berikutnya

Jika dashboard akan dipakai multi-admin, tambahkan email admin baru ke `riksa_admins` dari SQL Editor atau buat UI khusus yang hanya bisa diakses admin utama.

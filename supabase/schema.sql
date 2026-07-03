-- RIKSA Supabase schema for Firebase/Firestore migration.
-- Run this in Supabase SQL Editor before deploying the app.

create table if not exists public.riksa_admins (
  email text primary key,
  created_at timestamptz not null default now()
);

-- Bootstrap admin from the old Firebase project. Change/add emails as needed.
insert into public.riksa_admins (email)
values ('simplusewebproject@gmail.com')
on conflict (email) do nothing;

alter table public.riksa_admins enable row level security;

create or replace function public.is_riksa_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.riksa_admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

drop policy if exists "Admins can read admin allowlist" on public.riksa_admins;
create policy "Admins can read admin allowlist"
on public.riksa_admins
for select
to authenticated
using (public.is_riksa_admin());

drop policy if exists "Admins can add admins" on public.riksa_admins;
create policy "Admins can add admins"
on public.riksa_admins
for insert
to authenticated
with check (public.is_riksa_admin());

drop policy if exists "Admins can update admins" on public.riksa_admins;
create policy "Admins can update admins"
on public.riksa_admins
for update
to authenticated
using (public.is_riksa_admin())
with check (public.is_riksa_admin());

drop policy if exists "Admins can delete admins" on public.riksa_admins;
create policy "Admins can delete admins"
on public.riksa_admins
for delete
to authenticated
using (public.is_riksa_admin());

create table if not exists public.riksa_documents (
  collection text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (collection, id)
);

create index if not exists riksa_documents_collection_idx
  on public.riksa_documents (collection);

create or replace function public.set_riksa_documents_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_riksa_documents_updated_at on public.riksa_documents;
create trigger set_riksa_documents_updated_at
before update on public.riksa_documents
for each row
execute function public.set_riksa_documents_updated_at();

alter table public.riksa_documents enable row level security;

drop policy if exists "Public read landing content" on public.riksa_documents;
create policy "Public read landing content"
on public.riksa_documents
for select
to anon, authenticated
using (
  public.is_riksa_admin()
  or (collection = 'settings' and id in ('general', 'recruitment', 'cloudinary'))
  or (collection = 'berita' and data ->> 'status' = 'published')
  or (collection = 'galeri' and coalesce((data ->> 'isVisible')::boolean, false) = true)
  or (collection = 'struktur')
  or (collection = 'relawan' and coalesce((data ->> 'status_aktif')::boolean, false) = true)
);

drop policy if exists "Public submit volunteer applications" on public.riksa_documents;
create policy "Public submit volunteer applications"
on public.riksa_documents
for insert
to anon, authenticated
with check (
  collection = 'pendaftar_relawan'
  and id like 'app_%'
  and data ->> 'status' = 'pending'
  and data ? 'nama'
  and data ? 'email'
  and data ? 'no_hp'
  and data ? 'divisi_pilihan'
);

drop policy if exists "Admins full read" on public.riksa_documents;
create policy "Admins full read"
on public.riksa_documents
for select
to authenticated
using (public.is_riksa_admin());

drop policy if exists "Admins full insert" on public.riksa_documents;
create policy "Admins full insert"
on public.riksa_documents
for insert
to authenticated
with check (public.is_riksa_admin());

drop policy if exists "Admins full update" on public.riksa_documents;
create policy "Admins full update"
on public.riksa_documents
for update
to authenticated
using (public.is_riksa_admin())
with check (public.is_riksa_admin());

drop policy if exists "Admins full delete" on public.riksa_documents;
create policy "Admins full delete"
on public.riksa_documents
for delete
to authenticated
using (public.is_riksa_admin());

-- Optional seed examples. Adjust values in the dashboard after login.
insert into public.riksa_documents (collection, id, data)
values
  (
    'settings',
    'general',
    '{
      "nama_org": "RIKSA (Riuangan Aksara Sunda)",
      "tagline": "Melestarikan Aksara, Mengukuhkan Wibawa Budaya Parahyangan",
      "visi": "",
      "misi": "",
      "sejarah": "",
      "alamat": "",
      "email": "",
      "telp": "",
      "instagram": "",
      "youtube": "",
      "logo_url": "",
      "hero_image_url": "",
      "hero_overlay_color": "#3b1f0a",
      "hero_overlay_opacity": 0
    }'::jsonb
  ),
  (
    'settings',
    'recruitment',
    '{
      "isActive": true,
      "judul": "Rekrutmen Relawan Budaya RIKSA",
      "deskripsi": "",
      "divisi_tersedia": ["Pengajar Pawiyatan", "Digitalisasi Naskah", "Dokumentasi & Media", "Hubungan Masyarakat"],
      "kuota": 25,
      "tanggal_tutup": "2026-08-31"
    }'::jsonb
  )
on conflict (collection, id) do nothing;

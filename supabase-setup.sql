-- ==========================================================
-- PBTips — supabase-setup.sql
-- Cara pakai: copy SEMUA isi file ini, lalu paste & jalankan
-- di Supabase Dashboard -> SQL Editor -> New Query -> Run.
-- ==========================================================

-- 1. Bikin tabel "tips"
create table if not exists public.tips (
  id          bigint generated always as identity primary key,
  title       text not null,
  map         text not null,
  description text not null,
  author      text not null,
  video_id    text not null,           -- ID video YouTube (11 karakter)
  likes       integer not null default 0,
  status      text not null default 'pending'
              check (status in ('pending', 'approved', 'rejected')),
  created_at  timestamptz not null default now()
);

-- 2. Aktifkan Row Level Security (RLS)
--    Ini WAJIB, supaya orang gak bisa baca/edit data sembarangan
--    lewat anon key yang nempel di kode frontend.
alter table public.tips enable row level security;

-- 3. POLICY: siapa pun (anon) boleh BACA tips yang statusnya "approved"
--    -> ini buat halaman utama (index.html)
create policy "Publik bisa lihat tips approved"
on public.tips
for select
to anon
using (status = 'approved');

-- 4. POLICY: siapa pun (anon) boleh INSERT tips baru
--    -> tapi status BARU yang diinsert dipaksa "pending" lewat default
--       column di atas. Kalau mau lebih strict, bisa pakai check di sini.
create policy "Publik bisa submit tips baru (otomatis pending)"
on public.tips
for insert
to anon
with check (status = 'pending');

-- 5. POLICY: hanya user yang SUDAH LOGIN (authenticated, yaitu admin)
--    yang boleh LIHAT SEMUA tips (termasuk pending & rejected)
create policy "Admin (login) bisa lihat semua tips"
on public.tips
for select
to authenticated
using (true);

-- 6. POLICY: hanya admin (authenticated) yang boleh UPDATE
--    -> dipakai untuk approve / reject
create policy "Admin (login) bisa update status tips"
on public.tips
for update
to authenticated
using (true)
with check (true);

-- 7. POLICY: hanya admin (authenticated) yang boleh DELETE
create policy "Admin (login) bisa hapus tips"
on public.tips
for delete
to authenticated
using (true);

-- ==========================================================
-- SELESAI.
-- Langkah selanjutnya (di luar SQL ini, lewat Dashboard Supabase):
--
-- A. Bikin akun admin:
--    Authentication -> Users -> Add user -> isi email & password.
--    (Matikan "Enable email confirmations" di Authentication -> Providers
--     -> Email kalau mau langsung bisa login tanpa verifikasi email.)
--
-- B. Ambil URL & anon key project kamu:
--    Project Settings -> API -> copy "Project URL" dan "anon public" key.
--    Lalu isi ke file config.js di folder website ini.
-- ==========================================================

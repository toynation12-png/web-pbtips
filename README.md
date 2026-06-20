# PBTips — Web + Halaman Admin (Supabase + Vercel)

Struktur file:

```
pbtips/
├── index.html          -> Halaman utama (publik)
├── admin.html           -> Halaman admin (approve/reject tips)
├── style.css            -> Style umum, dipakai index & admin
├── admin.css             -> Style tambahan khusus halaman admin
├── script.js             -> Logic halaman utama
├── admin.js              -> Logic halaman admin
├── config.js             -> Kredensial Supabase kamu (WAJIB diisi)
└── supabase-setup.sql    -> Script bikin tabel & security rules
```

Semua file harus tetap dalam **satu folder yang sama**.

---

## ALUR SISTEMNYA

1. User isi form "Submit Tips" di `index.html` → data masuk ke tabel
   `tips` di Supabase dengan status **`pending`**.
2. Kamu (admin) login di `admin.html` → lihat semua tips yang `pending`
   → klik **Approve** atau **Reject**.
3. `index.html` cuma menampilkan tips yang statusnya **`approved`**.

---

## LANGKAH 1 — Setup tabel di Supabase

1. Buka project Supabase kamu → menu **SQL Editor** → **New query**.
2. Copy semua isi file `supabase-setup.sql`, paste, lalu klik **Run**.
   Ini akan membuat tabel `tips` + aturan keamanan (Row Level Security)
   supaya:
   - Siapa saja boleh **lihat** tips yang `approved`.
   - Siapa saja boleh **submit** tips baru (otomatis masuk `pending`).
   - Hanya admin yang **login** boleh lihat/ubah/hapus semuanya.

---

## LANGKAH 2 — Bikin akun admin

1. Di Supabase Dashboard → **Authentication** → **Users** → **Add user**.
2. Isi email & password buat akun admin kamu.
3. Supaya bisa langsung login tanpa verifikasi email: buka
   **Authentication** → **Providers** → **Email**, lalu matikan opsi
   **"Confirm email"**.

Akun ini yang nanti dipakai login di `admin.html`.

---

## LANGKAH 3 — Isi `config.js`

Di Supabase Dashboard → **Project Settings** → **API**, copy:
- **Project URL**
- **anon public** key

Lalu tempel ke file `config.js`:

```js
const SUPABASE_URL = "https://xxxxxxxxxxxx.supabase.co";
const SUPABASE_ANON_KEY = "isi-anon-key-kamu-di-sini";
```

> Anon key ini aman ditaruh di kode frontend (publik), karena akses
> datanya sudah dibatasi lewat Row Level Security di Langkah 1.
> **Jangan pernah** pakai `service_role` key di frontend.

---

## LANGKAH 4 — Coba dulu di lokal

Buka `index.html` di browser. Coba submit tips lewat tombol
**"Submit Tips"**. Lalu buka `admin.html`, login, dan cek apakah
tips tadi muncul di tab **"Menunggu Review"**.

---

## LANGKAH 5 — Push ke GitHub

```bash
git init
git add .
git commit -m "PBTips: web + admin approval (Supabase)"
git branch -M main
git remote add origin <url-repo-github-kamu>
git push -u origin main
```

---

## LANGKAH 6 — Deploy ke Vercel

1. Buka https://vercel.com/new
2. Import repository GitHub yang baru kamu push.
3. Karena ini cuma HTML/CSS/JS biasa (tanpa framework), Vercel akan
   otomatis mendeteksinya sebagai **static site** — biarkan default
   Build Command & Output Directory (kosong/`./`), langsung klik
   **Deploy**.
4. Setelah selesai, kamu akan dapat URL seperti
   `pbtips.vercel.app` — halaman admin bisa diakses di
   `pbtips.vercel.app/admin.html`.

---

## CATATAN KEAMANAN

- Halaman admin **tidak disembunyikan** dari publik secara fisik
  (siapa pun bisa tahu URL `/admin.html` ada), tapi tanpa login yang
  benar mereka tidak akan bisa lihat atau mengubah data apa pun,
  karena dibatasi oleh Row Level Security di Supabase — bukan cuma
  dari sisi tampilan.
- Jangan share email/password admin ke siapa pun yang tidak kamu
  percaya untuk approve tips.
- Mau nambah admin lain? Tinggal tambahkan user baru di
  **Authentication → Users** di Supabase, mereka otomatis bisa login
  di `admin.html` dengan akses yang sama.

---

## TROUBLESHOOTING

- **Tips gak muncul di halaman utama setelah di-approve** → cek lagi
  apakah kolom `status` di Supabase memang berubah jadi `approved`
  (lihat tab Table Editor di Supabase).
- **Login admin gagal terus** → pastikan email/password sama dengan
  yang dibuat di Langkah 2, dan opsi "Confirm email" sudah dimatikan
  (atau email sudah diverifikasi).
- **Error di console soal "Failed to fetch" / CORS** → cek lagi
  `SUPABASE_URL` dan `SUPABASE_ANON_KEY` di `config.js`, pastikan
  tidak ada salah ketik atau spasi tambahan.

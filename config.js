/* ==========================================================
   PBTips — config.js
   SATU-SATUNYA file yang perlu kamu edit untuk hubungkan
   website ini ke project Supabase kamu.

   Cara ambil nilainya:
   Supabase Dashboard -> Project Settings -> API
   - "Project URL"      -> taruh di SUPABASE_URL
   - "anon public" key  -> taruh di SUPABASE_ANON_KEY

   PENTING: anon key ini AMAN ditaruh di kode frontend (publik),
   karena akses datanya sudah dibatasi lewat Row Level Security
   (RLS) yang diatur di file supabase-setup.sql. JANGAN pernah
   pakai "service_role" key di sini.
   ========================================================== */

const SUPABASE_URL = "https://zvplieisblasjoguepsy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2cGxpZWlzYmxhc2pvZ3VlcHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTc1NjgsImV4cCI6MjA5NzQ3MzU2OH0.coaWbx1pQpKV15Hmv3xVARZVIsXdGOrF7t2MN0Vwy3g";

// Bikin satu koneksi Supabase yang dipakai bersama oleh
// script.js (halaman utama) dan admin.js (halaman admin).
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

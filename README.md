# Lokarasa: Aplikasi Eksplorasi dan Rekomendasi Tempat Makan Berbasis Mobile (PWA)

Proyek **Tugas Akhir Praktikum Pemrograman Perangkat Bergerak (PPB)**.  
Aplikasi **Progressive Web App (PWA)** modern yang dirancang untuk membantu pengguna menjelajahi dan menemukan rekomendasi tempat makan, warung tradisional, cafe, street food, dan kuliner khas daerah dengan pengalaman layaknya aplikasi native di smartphone.

---

## 📋 Pemenuhan Ketentuan Tugas Akhir

| No | Ketentuan Tugas Akhir | Implementasi pada Lokarasa | Status |
|:--:|:---|:---|:--:|
| **1** | Menggunakan API (Web Service) yang dibuat sendiri sesuai Modul 1 | Backend RESTful API mandiri berbasis **Node.js & Express.js** dengan arsitektur **MVC** (`models/`, `controllers/`, `routes/`, `config/`), terintegrasi dengan database **Supabase** serta dilengkapi Postman Collection dan skrip migrasi SQL (`schema.sql`). | ✅ Terpenuhi |
| **2** | Memiliki Bottom Navigation Bar | Tersedia **Bottom Navigation Bar** responsif mobile dengan 5 menu navigasi (Eksplorasi, Rekomendasi, Tambah, Favorit, Profil) beserta counter badge dinamis. | ✅ Terpenuhi |
| **3** | Memiliki minimal 5 halaman | Aplikasi memiliki **6 halaman interaktif**: <br>1. *Eksplorasi (Explore Page)*<br>2. *Rekomendasi (Recommendation Page)*<br>3. *Detail Tempat Makan (Detail View)*<br>4. *Favorit Tersimpan (Favorites Page)*<br>5. *Tambah Tempat Makan (Create Place Page)*<br>6. *Profil Pengguna & Tentang Aplikasi (Profile & About Page)* | ✅ Terpenuhi (6 Halaman) |
| **4** | Minimal 2 halaman utama memiliki list dan setiap item dapat diklik untuk menampilkan detail | **Halaman 1 (Eksplorasi):** Menampilkan daftar seluruh tempat makan dengan pencarian & filter. Setiap item dapat diklik menuju detail.<br>**Halaman 2 (Rekomendasi):** Menampilkan kurasi tempat makan pilihan & rating tinggi. Setiap item dapat diklik menuju detail.<br>*(Halaman Favorit juga memiliki list yang dapat diklik ke detail).* | ✅ Terpenuhi |
| **5** | Memiliki 1 halaman Profile / About aplikasi | Halaman **Profil & Tentang Lokarasa** yang menyajikan profil pengguna (avatar, bio, statistik kuliner) serta tab **Tentang Aplikasi** (deskripsi, info akademik, teknologi PWA, dan panduan instalasi). | ✅ Terpenuhi |
| **6** | Praktikan wajib mengunggah source code ke GitHub | Repositori dilengkapi dengan `.gitignore` bersih, skrip build, instruksi commit, dan panduan push ke GitHub. | ✅ Terpenuhi |
| **7** | Judul Tugas Akhir unik | **Lokarasa: Aplikasi Eksplorasi dan Rekomendasi Tempat Makan Berbasis Mobile** | ✅ Terpenuhi |

---

## 🏗️ Arsitektur & Struktur Proyek

```text
TA/
├── backend/                                # Web Service RESTful API (Modul 1 & 2)
│   ├── src/
│   │   ├── config/
│   │   │   └── supabaseClient.js           # Klien Supabase & Fallback In-Memory
│   │   ├── controllers/
│   │   │   ├── categoryController.js       # Handler Endpoint Kategori
│   │   │   ├── restaurantController.js     # Handler Endpoint Tempat Makan (CRUD)
│   │   │   └── reviewController.js         # Handler Endpoint Ulasan & Rating
│   │   ├── models/
│   │   │   ├── categoryModel.js            # Model Kategori
│   │   │   ├── restaurantModel.js          # Model Restoran & Filter Query
│   │   │   └── reviewModel.js              # Model Ulasan
│   │   ├── routes/
│   │   │   ├── categoryRoutes.js           # Routing /api/categories
│   │   │   ├── restaurantRoutes.js         # Routing /api/restaurants
│   │   │   └── reviewRoutes.js             # Routing /api/reviews
│   │   └── index.js                        # Entry Point Express Server & CORS
│   ├── .env.example                        # Template Variabel Lingkungan Backend
│   ├── PPB_Lokarasa_Postman_Collection.json# Koleksi Pengujian Postman
│   ├── schema.sql                          # Skrip DDL & Seed Data PostgreSQL Supabase
│   ├── vercel.json                         # Konfigurasi Serverless Deployment Vercel
│   └── package.json
│
├── frontend/                               # Frontend Progressive Web App (Modul 5 & 6)
│   ├── public/
│   │   ├── icons/
│   │   │   ├── icon-192.png                # Icon PWA 192x192
│   │   │   ├── icon-512.png                # Icon PWA 512x512 (Maskable)
│   │   │   └── icon.svg                    # Vector Emblem Lokarasa
│   │   ├── favicon.svg
│   │   └── logo.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── AdvancedFilter.jsx      # Search Bar, Kategori Pills, Dropdown Sort
│   │   │   │   ├── FavoriteButton.jsx      # Tombol Toggle Bookmark Interaktif
│   │   │   │   ├── SplashScreen.jsx        # Splash Screen Animasi Khas Lokarasa
│   │   │   │   └── SplashScreen.css
│   │   │   ├── layout/
│   │   │   │   ├── BottomNav.jsx           # Bottom Navigation Bar Mobile
│   │   │   │   └── Header.jsx              # App Header Bar & Status Offline
│   │   │   ├── modals/
│   │   │   │   └── ConfirmModal.jsx        # Dialog Konfirmasi Hapus & Pulihkan Draft
│   │   │   ├── restaurant/
│   │   │   │   ├── RestaurantCard.jsx      # Kartu Tempat Makan pada List
│   │   │   │   └── RestaurantDetail.jsx    # Halaman Detail, Menu, & Form Ulasan
│   │   │   └── PWABadge.jsx                # Banner Instal PWA & Indikator Offline
│   │   ├── config/
│   │   │   └── api.js                      # Konfigurasi Axios & Base URL
│   │   ├── data/
│   │   │   └── initialRestaurants.js       # Fallback Cache Data Kuliner Nusantara
│   │   ├── hooks/
│   │   │   ├── useRestaurants.js           # Custom Hook Fetch Tempat Makan
│   │   │   ├── useFavorites.js             # Custom Hook Manajemen Bookmark
│   │   │   └── useReviews.js               # Custom Hook Fetch & Submit Ulasan
│   │   ├── pages/
│   │   │   ├── ExplorePage.jsx             # Halaman List Utama 1 (Eksplorasi)
│   │   │   ├── RecommendationPage.jsx      # Halaman List Utama 2 (Rekomendasi)
│   │   │   ├── FavoritesPage.jsx           # Halaman List Favorit Tersimpan
│   │   │   ├── CreatePlacePage.jsx         # Halaman Tambah Tempat Makan & Auto-Draft
│   │   │   ├── EditPlacePage.jsx           # Halaman Edit Data Tempat Makan
│   │   │   └── ProfileAboutPage.jsx        # Halaman Profil Pengguna & Tentang Aplikasi
│   │   ├── services/
│   │   │   ├── restaurantService.js        # Service API Restoran
│   │   │   ├── categoryService.js          # Service API Kategori
│   │   │   ├── reviewService.js            # Service API Ulasan
│   │   │   ├── favoriteService.js          # Service Persistence Favorit
│   │   │   └── userService.js              # Service Profil & UUID Pengguna
│   │   ├── utils/
│   │   │   ├── draftStorage.js             # LocalStorage Auto-Save Form Draft
│   │   │   └── helpers.js                  # Formatter Rupiah, Sorting, Filter
│   │   ├── App.jsx                         # State Management & Navigasi Aplikasi
│   │   ├── App.css                         # Styling Antarmuka Mobile-First
│   │   ├── index.css                       # Design Tokens & Root Reset
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js                      # Konfigurasi Vite & vite-plugin-pwa
│   └── package.json
│
├── package.json                            # Root Runner Scripts
├── .gitignore                              # Git Ignore Konfigurasi Bersih
└── README.md
```

---

## 🚀 Panduan Menjalankan Proyek di Komputer Lokal

### 1. Prasyarat Sistem
- **Node.js** (Versi 18 ke atas)
- **Git**

### 2. Instalasi Dependensi
Buka terminal di direktori proyek `TA`, lalu jalankan:

```bash
# Instal dependensi backend
cd backend
npm install

# Instal dependensi frontend
cd ../frontend
npm install

# Kembali ke root
cd ..
```

---

### 3. Menjalankan Backend API
Di terminal pertama, buka direktori `backend` dan jalankan:

```bash
cd backend
npm run dev
```

Server API akan berjalan di: `http://localhost:5000`

> **Catatan Fleksibilitas Backend:**  
> Backend sudah dilengkapi *In-Memory Data Store* otomatis. Jika kredensial Supabase belum diisi pada file `backend/.env`, API tetap akan **langsung berjalan normal** dengan 8 data tempat makan dan ulasan awal!

Jika ingin menghubungkan ke database Supabase pribadi:
1. Buat proyek baru di [Supabase Dashboard](https://supabase.com).
2. Buka menu **SQL Editor**, salin dan jalankan seluruh isi berkas `backend/schema.sql`.
3. Buka **Project Settings** > **API**, salin `Project URL` dan `anon public key`.
4. Isi berkas `backend/.env`:
   ```env
   SUPABASE_URL=https://proyek-anda.supabase.co
   SUPABASE_KEY=anon-public-key-anda
   PORT=5000
   ```
5. Simpan dan restart server (`npm run dev`).

---

### 4. Menjalankan Frontend PWA
Di terminal kedua, buka direktori `frontend` dan jalankan:

```bash
cd frontend
npm run dev
```

Aplikasi PWA akan terbuka di browser Anda pada: `http://localhost:5173`

---

## 📱 Cara Menguji dan Menginstal PWA di Smartphone

Sesuai dengan **Modul 5**, Anda dapat menguji tampilan mobile dan menginstal PWA di HP Anda:

1. Pastikan laptop dan smartphone Anda terhubung ke **jaringan Wi-Fi yang sama**.
2. Di terminal `frontend`, jalankan:
   ```bash
   npm run build
   npm run preview -- --host
   ```
3. Perhatikan link **Network** yang muncul (misalnya `http://192.168.1.10:4173`).
4. Buka browser di smartphone (Google Chrome untuk Android atau Safari untuk iOS), lalu masukkan URL Network tersebut.
5. **Instalasi ke Layar Utama:**
   - **Android (Chrome):** Ketuk tombol titik tiga di kanan atas > pilih **"Tambahkan ke Layar Utama"** (*Add to Home Screen*) atau ketuk tombol **"Instal Aplikasi"** pada banner yang muncul di bawah layar.
   - **iOS (Safari):** Ketuk ikon **Bagikan (Share)** di bagian bawah layar > gulir ke bawah dan pilih **"Add to Home Screen"**.
6. Ikon aplikasi **Lokarasa** akan muncul di layar utama smartphone Anda dan dapat dibuka secara *standalone* layaknya aplikasi native!

---

## 🧪 Pengujian API dengan Postman (Modul 1 & 2)

Koleksi Postman siap pakai telah disediakan di:  
`backend/PPB_Lokarasa_Postman_Collection.json`

### Cara Import ke Postman:
1. Buka aplikasi **Postman**.
2. Klik tombol **Import** di pojok kiri atas.
3. Pilih berkas `backend/PPB_Lokarasa_Postman_Collection.json`.
4. Koleksi permintaan API akan muncul secara otomatis mencakup:
   - `GET /api/categories` — Mengambil seluruh kategori kuliner
   - `POST /api/categories` — Menambahkan kategori baru
   - `GET /api/restaurants` — Mengambil daftar seluruh tempat makan
   - `GET /api/restaurants?is_recommended=true` — Mengambil rekomendasi tempat makan
   - `GET /api/restaurants/:id` — Mengambil detail tempat makan beserta ulasan
   - `POST /api/restaurants` — Mendaftarkan tempat makan baru
   - `GET /api/reviews/restaurant/:restaurantId` — Mengambil ulasan restoran
   - `POST /api/reviews` — Mengirimkan ulasan dan rating baru

---

## 🌐 Panduan Deployment ke Vercel (Modul 2 & Modul 6)

### A. Deploy Backend API ke Vercel
1. Buka [Vercel Dashboard](https://vercel.com) dan klik **Add New** > **Project**.
2. Impor repositori GitHub Anda.
3. Pada **Root Directory**, pilih folder `backend`.
4. Framework Preset otomatis mendeteksi **Other** / **Express**.
5. Tambahkan Environment Variables:
   - `SUPABASE_URL` = URL proyek Supabase Anda
   - `SUPABASE_KEY` = anon public key Supabase Anda
6. Klik **Deploy**. Salin URL publik yang didapatkan (misal: `https://lokarasa-api.vercel.app`).

### B. Deploy Frontend PWA ke Vercel
1. Pada Vercel Dashboard, klik **Add New** > **Project**.
2. Impor repositori yang sama.
3. Pada **Root Directory**, pilih folder `frontend`.
4. Framework Preset akan otomatis mendeteksi **Vite**.
5. Pada **Environment Variables**, tambahkan:
   - `VITE_API_BASE_URL` = URL Backend Vercel Anda (misal: `https://lokarasa-api.vercel.app`).
6. Klik **Deploy**. Aplikasi PWA kini online dan dapat diakses publik dari mana saja!

---

## 🐙 Panduan Mengunggah ke GitHub (Requirement #6)

Untuk mengunggah seluruh source code Tugas Akhir ini ke GitHub:

1. Buat repositori baru di GitHub dengan nama misalnya `Lokarasa-PWA-TA-PPB`.
2. Buka terminal di direktori utama `TA`, lalu jalankan perintah:

```bash
# 1. Inisialisasi Git
git init

# 2. Tambahkan semua file yang sudah siap
git add .

# 3. Buat commit pertama
git commit -m "feat: inisialisasi proyek Tugas Akhir Lokarasa PWA lengkap dengan API"

# 4. Ganti branch utama ke main
git branch -M main

# 5. Hubungkan ke repositori GitHub Anda (ganti link berikut dengan repositori Anda)
git remote add origin https://github.com/USERNAME_ANDA/Lokarasa-PWA-TA-PPB.git

# 6. Unggah ke GitHub
git push -u origin main
```

---

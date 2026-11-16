-- ============================================================================
-- SQL SCHEMA LOKARASA: APLIKASI EKSPLORASI & REKOMENDASI TEMPAT MAKAN
-- Jalankan skrip ini pada SQL Editor di Dashboard Supabase Anda
-- ============================================================================

-- 1. Hapus tabel jika sudah ada sebelumnya (Opsional / Reset)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 2. Buat tabel Kategori Kuliner
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Buat tabel Tempat Makan / Restoran
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category_name TEXT,
  address TEXT NOT NULL,
  city TEXT DEFAULT 'Yogyakarta',
  price_range TEXT DEFAULT '$$', -- $, $$, $$$, $$$$
  avg_price NUMERIC(12, 2) DEFAULT 35000,
  rating NUMERIC(3, 1) DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  description TEXT,
  image_url TEXT,
  phone TEXT,
  opening_hours TEXT DEFAULT '09:00 - 21:00',
  is_recommended BOOLEAN DEFAULT false,
  signature_menu JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Buat tabel Ulasan / Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Masukkan Data Awal (Seed Data Kategori)
INSERT INTO categories (id, name, icon) VALUES
  ('c1010000-0000-0000-0000-000000000001', 'Kuliner Tradisional', '🍲'),
  ('c1010000-0000-0000-0000-000000000002', 'Cafe & Kopi', '☕'),
  ('c1010000-0000-0000-0000-000000000003', 'Street Food & Angkringan', '🍢'),
  ('c1010000-0000-0000-0000-000000000004', 'Seafood & Bakaran', '🦐'),
  ('c1010000-0000-0000-0000-000000000005', 'Bakso & Mie', '🍜'),
  ('c1010000-0000-0000-0000-000000000006', 'Aneka Sambal & Lalapan', '🌶️');

-- 6. Masukkan Data Awal Restoran & Rekomendasi
INSERT INTO restaurants (id, name, category_id, category_name, address, city, price_range, avg_price, rating, review_count, description, image_url, phone, opening_hours, is_recommended, signature_menu) VALUES
  (
    'r2010000-0000-0000-0000-000000000001',
    'Gudeg Yu Djum Wijilan 167',
    'c1010000-0000-0000-0000-000000000001',
    'Kuliner Tradisional',
    'Jl. Wijilan No.167, Panembahan, Kraton',
    'Yogyakarta',
    '$$',
    35000,
    4.8,
    142,
    'Pelopor gudeg kering legendaris khas Jogja yang dimasak dengan kayu bakar selama berjam-jam menghasilkan cita rasa manis gurih yang otentik dan tahan lama.',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    '0812-3456-7890',
    '06:00 - 22:00',
    true,
    '["Gudeg Komplit Telur & Ayam Suwir", "Krecek Pedas Gurih", "Tahu Tempe Bacem"]'::jsonb
  ),
  (
    'r2010000-0000-0000-0000-000000000002',
    'Kopi Klotok Pakem',
    'c1010000-0000-0000-0000-000000000002',
    'Cafe & Kopi',
    'Jl. Kaliurang KM 16, Pakem, Sleman',
    'Yogyakarta',
    '$',
    20000,
    4.9,
    280,
    'Menikmati suasana pedesaan dengan pemandangan sawah hijau asri sambil menyeruput kopi klotok panas dan pisang goreng krispi yang terkenal renyah manis.',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    '0813-9876-5432',
    '07:00 - 21:00',
    true,
    '["Kopi Klotok Panas", "Pisang Goreng Crispy", "Sayur Lodeh Kluwih", "Telur Dadar Crispy"]'::jsonb
  ),
  (
    'r2010000-0000-0000-0000-000000000003',
    'Sate Klathak Pak Pong',
    'c1010000-0000-0000-0000-000000000001',
    'Kuliner Tradisional',
    'Jl. Sultan Agung No.18, Jejeran, Wonokromo, Pleret',
    'Bantul',
    '$$',
    45000,
    4.7,
    195,
    'Sate kambing muda unik yang ditusuk menggunakan jeruji besi sepeda motor agar panas merata ke dalam daging. Diberi bumbu garam sederhana dengan kuah gulai gurih mantap.',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    '0811-2233-4455',
    '09:00 - 23:00',
    true,
    '["Sate Klathak 2 Tusuk", "Tongseng Kambing", "Kicik Kambing", "Gulai Balungan"]'::jsonb
  ),
  (
    'r2010000-0000-0000-0000-000000000004',
    'Angkringan KR (Kedaulatan Rakyat)',
    'c1010000-0000-0000-0000-000000000003',
    'Street Food & Angkringan',
    'Jl. P. Mangkubumi No.40, Gowongan, Jetis',
    'Yogyakarta',
    '$',
    15000,
    4.6,
    98,
    'Spot nongkrong malam legendaris tempat berkumpul mahasiswa dan warga lokal. Menyediakan beraneka ragam nasi kucing, aneka sate usus, telur puyuh, dan Kopi Joss berarang panas.',
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    '0878-1234-5678',
    '17:00 - 02:00',
    false,
    '["Kopi Joss Arang Membara", "Nasi Kucing Sambal Teri", "Sate Kulit Bakar Manis", "Wedang Jahe"]'::jsonb
  ),
  (
    'r2010000-0000-0000-0000-000000000005',
    'Seafood 99 Pasir Putih',
    'c1010000-0000-0000-0000-000000000004',
    'Seafood & Bakaran',
    'Jl. Kaliurang KM 5.5 No.21, Caturtunggal, Depok',
    'Sleman',
    '$$$',
    65000,
    4.7,
    110,
    'Menyajikan olahan hidangan laut segar pilihan mulai dari kepiting saus padang melimpah, udang bakar madu, hingga cumi goreng tepung krispi dengan porsi puas.',
    'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80',
    '0856-7890-1234',
    '11:00 - 22:30',
    true,
    '["Kepiting Saus Padang Spesial", "Udang Bakar Madu Jimbaran", "Cumi Goreng Tepung", "Kangkung Belacan"]'::jsonb
  ),
  (
    'r2010000-0000-0000-0000-000000000006',
    'Bakso Klenger Ratu Sari',
    'c1010000-0000-0000-0000-000000000005',
    'Bakso & Mie',
    'Jl. Wahid Hasyim No.296, Nologaten, Caturtunggal',
    'Sleman',
    '$$',
    30000,
    4.5,
    85,
    'Sensasi menikmati bakso sapi asli dengan ukuran jumbo yang mengenyangkan, mulai dari berat 250 gram hingga 5 kilogram dengan isian tetelan dan telur utuh di dalamnya.',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    '0821-3456-9871',
    '10:00 - 21:00',
    false,
    '["Bakso Klenger Reguler", "Bakso Granat Pedas Cabai", "Mie Pangsit Tetelan"]'::jsonb
  ),
  (
    'r2010000-0000-0000-0000-000000000007',
    'Warung Spesial Sambal (SS) Pandega',
    'c1010000-0000-0000-0000-000000000006',
    'Aneka Sambal & Lalapan',
    'Jl. Pandega Marta No.47, Caturtunggal, Depok',
    'Sleman',
    '$',
    25000,
    4.8,
    220,
    'Pusat aneka sambal Nusantara dengan lebih dari 30 varian sambal segar yang diulek dadakan. Sangat cocok dipadukan dengan ayam goreng gurih, lele bakar, dan sayur asem segar.',
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    '0819-8765-4321',
    '10:00 - 22:00',
    true,
    '["Sambal Bawang Goreng", "Sambal Terasi Segar", "Ayam Goreng Lengkuas", "Jamur Crispy Sambal Korek"]'::jsonb
  ),
  (
    'r2010000-0000-0000-0000-000000000008',
    'Aroma Resto & Coffee Garden',
    'c1010000-0000-0000-0000-000000000002',
    'Cafe & Kopi',
    'Jl. Palagan Tentara Pelajar KM 8.5',
    'Sleman',
    '$$$',
    55000,
    4.6,
    76,
    'Konsep kafe terbuka bernuansa taman tropis yang asri dan sejuk. Tempat sempurna untuk santap siang bersama keluarga, WFC (Work From Cafe), atau bersantai sore.',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    '0812-7788-9900',
    '08:00 - 23:00',
    true,
    '["Caramel Macchiato Signature", "Grilled Salmon Lemon Herb", "Croissant Butter & Berry"]'::jsonb
  );

-- 7. Masukkan Data Awal Ulasan (Reviews)
INSERT INTO reviews (restaurant_id, user_name, rating, comment) VALUES
  ('r2010000-0000-0000-0000-000000000001', 'Budi Santoso', 5, 'Gudegnya manis gurih pas banget di lidah, kreceknya pedas nikmat! Wajib mampir kalau ke Jogja.'),
  ('r2010000-0000-0000-0000-000000000001', 'Siti Rahmawati', 5, 'Packaging rapi dan tahan dibawa keluar kota. Rasanya konsisten sejak dulu.'),
  ('r2010000-0000-0000-0000-000000000002', 'Dimas Pratama', 5, 'Pisang gorengnya legendaris, kopi klotok panas sambil lihat sawah bener-bener healing!'),
  ('r2010000-0000-0000-0000-000000000002', 'Ayu Lestari', 4, 'Suasananya juara, antreannya memang ramai tapi sebanding dengan rasa makanannya.'),
  ('r2010000-0000-0000-0000-000000000003', 'Hendra Gunawan', 5, 'Daging kambingnya empuk banget dan bumbu meresap sempurna karena tusuk jerujinya.'),
  ('r2010000-0000-0000-0000-000000000007', 'Rina Wulandari', 5, 'Pilihan sambalnya banyak banget, pedasnya mantap dan harganya sangat ramah di kantong mahasiswa!');

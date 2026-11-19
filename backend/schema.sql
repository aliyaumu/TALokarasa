-- ============================================================================
-- SQL SCHEMA LOKARASA: APLIKASI EKSPLORASI & REKOMENDASI TEMPAT MAKAN
-- Edisi Khusus Kuliner Favorit & Hidden Gems Kota Semarang
-- Jalankan skrip ini pada SQL Editor di Dashboard Supabase Anda
-- ============================================================================

-- 1. Hapus tabel jika sudah ada sebelumnya (Reset)
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
  city TEXT DEFAULT 'Semarang',
  price_range TEXT DEFAULT '$$', -- $, $$, $$$, $$$$
  avg_price NUMERIC(12, 2) DEFAULT 25000,
  rating NUMERIC(3, 1) DEFAULT 4.8,
  review_count INTEGER DEFAULT 0,
  description TEXT,
  image_url TEXT,
  phone TEXT,
  opening_hours TEXT DEFAULT '10:00 - 21:00 WIB',
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

-- 5. Matikan Row Level Security (RLS) agar API backend leluasa melakukan operasi CRUD
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;

-- 6. Masukkan Data Kategori Kuliner Semarang
INSERT INTO categories (id, name, icon) VALUES
  ('c1010000-0000-0000-0000-000000000001', 'Bakso & Mie', '🍜'),
  ('c1010000-0000-0000-0000-000000000002', 'Kuliner Tradisional', '🍲'),
  ('c1010000-0000-0000-0000-000000000003', 'Aneka Sambal & Penyetan', '🌶️'),
  ('c1010000-0000-0000-0000-000000000004', 'Asian & Donburi', '🍱'),
  ('c1010000-0000-0000-0000-000000000005', 'Street Food & Camilan', '🥟'),
  ('c1010000-0000-0000-0000-000000000006', 'Cafe & Nongkrong', '☕');

-- 7. Masukkan Data Restoran Rekomendasi Semarang
INSERT INTO restaurants (id, name, category_id, category_name, address, city, price_range, avg_price, rating, review_count, description, image_url, phone, opening_hours, is_recommended, signature_menu) VALUES
  (
    'd2010000-0000-0000-0000-000000000001',
    'Kedai Tinari',
    'c1010000-0000-0000-0000-000000000001',
    'Bakso & Mie',
    'Jl. Sawunggaling III No.44, Pedalangan, Kec. Banyumanik',
    'Semarang',
    '$',
    23000,
    4.9,
    312,
    'Spot kuliner bakmie kekinian yang viral di area Tembalang/Banyumanik. Terkenal dengan tekstur mie kenyal berpadu kuah creamy gurih yang medok dan sensasi pedas mantap dari chili oil khas Tinari.',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    '0812-2567-8910',
    '11:00 - 21:00 WIB',
    true,
    '["Creamy Ori Ayam Panggang", "Creamy Mala Daging Sapi", "Mie Chili Oil Singapore", "Dimsum Kuah Creamy"]'::jsonb
  ),
  (
    'd2010000-0000-0000-0000-000000000002',
    'Kedai Melimbah',
    'c1010000-0000-0000-0000-000000000002',
    'Kuliner Tradisional',
    'Jl. Srondol Bumi Indah No.27, Sumurboto, Kec. Banyumanik',
    'Semarang',
    '$',
    18000,
    4.8,
    245,
    'Kedai comfort food idola mahasiswa dengan porsi melimpah dan kuah kaldu hangat yang gurih bening. Sajian misoa kuah komplit dan pangsit pedasnya sangat cocok dinikmati saat santap siang maupun malam.',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    '0821-3456-7812',
    '08:00 - 21:00 WIB',
    true,
    '["Misoa Kuah Komplit Daging", "Pangsit Chili Oil Melimpah", "Bakmi Kuah Kaldu Ayam", "Es Sarsaparilla Badak"]'::jsonb
  ),
  (
    'd2010000-0000-0000-0000-000000000003',
    'Warung Makan Budhe',
    'c1010000-0000-0000-0000-000000000002',
    'Kuliner Tradisional',
    'Jl. Banjarsari Selatan, Tembalang, Kec. Banyumanik',
    'Semarang',
    '$',
    16000,
    4.7,
    189,
    'Warung makan prasmanan masakan rumahan Jawa yang selalu ramai pembeli. Pilihan sayur lodeh, mangut ikan manyung, opor ayam kampung, serta aneka gorengan hangat dengan harga super ramah di kantong.',
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    '0813-9087-6543',
    '07:00 - 20:00 WIB',
    false,
    '["Nasi Rames Mangut Ikan Manyung", "Ayam Goreng Bumbu Lengkuas", "Sayur Asem & Tempe Mendoan", "Sambal Terasi Ulek"]'::jsonb
  ),
  (
    'd2010000-0000-0000-0000-000000000004',
    'Sami Seneng',
    'c1010000-0000-0000-0000-000000000003',
    'Aneka Sambal & Penyetan',
    'Jl. Banjarsari Raya No.40, Tembalang, Kec. Banyumanik',
    'Semarang',
    '$',
    21000,
    4.9,
    420,
    'Spesialis ayam dan bebek penyetan dengan limpahan taburan kremesan renyah gurih keemasan. Dipadukan dengan sambal tomat manis segar atau sambal korek bawang yang pedas membakar lidah.',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    '0857-1234-9876',
    '11:00 - 22:00 WIB',
    true,
    '["Ayam Goreng Kremes Crispy", "Bebek Bakar Sambal Korek", "Lele Goreng Kremes", "Kulit Ayam Goreng Renyah"]'::jsonb
  ),
  (
    'd2010000-0000-0000-0000-000000000005',
    'Bak Mie Serangkai',
    'c1010000-0000-0000-0000-000000000001',
    'Bakso & Mie',
    'Jl. Veteran No.3A, Lempongsari, Kec. Gajahmungkur',
    'Semarang',
    '$$',
    25000,
    4.8,
    275,
    'Kedai bakmi bergaya artisanal di pusat Kota Semarang. Menggunakan mie buatan tangan (handmade) dengan bumbu minyak gurih aromatik dan pilihan topping ayam charsiu serta pangsit goreng renyah.',
    'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80',
    '0811-2789-0123',
    '12:00 - 21:30 WIB',
    true,
    '["Mie Yamin Charsiu Ayam", "Mie Chili Oil Serangkai", "Mie Ayam Komplit Pangsit Kuah", "Pangsit Goreng Emas"]'::jsonb
  ),
  (
    'd2010000-0000-0000-0000-000000000006',
    'Niki Nikudon',
    'c1010000-0000-0000-0000-000000000004',
    'Asian & Donburi',
    'Jl. Tirto Agung No.11, Pedalangan, Kec. Banyumanik',
    'Semarang',
    '$$',
    28000,
    4.7,
    160,
    'Spesialis rice bowl Jepang (Donburi) favorit anak muda Semarang dengan irisan daging sapi empuk berbumbu manis gurih khas Tokyo, disajikan hangat di atas nasi pulen dan telur onsen setengah matang.',
    'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80',
    '0819-0123-4567',
    '10:30 - 21:00 WIB',
    true,
    '["Signature Gyu Nikudon", "Tori Karaage Curry Don", "Spicy Garlic Beef Bowl", "Tamagoyaki Roll"]'::jsonb
  ),
  (
    'd2010000-0000-0000-0000-000000000007',
    'Lumpia Gang Lombok No. 1',
    'c1010000-0000-0000-0000-000000000005',
    'Street Food & Camilan',
    'Jl. Gang Lombok No.1, Purwodinatan, Semarang Tengah',
    'Semarang',
    '$',
    22000,
    4.9,
    510,
    'Pelopor lumpia tertua dan paling legendaris di Semarang sejak abad ke-19. Isian rebung muda manis renyah tanpa bau pesing, berpadu cacahan udang dan telur dengan saus cocolan bawang cokelat kental.',
    'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    '0816-4881-808',
    '08:00 - 17:00 WIB',
    true,
    '["Lumpia Goreng Spesial Rebung Udang", "Lumpia Basah Tradisional", "Saus Bawang Kental & Daun Bawang Segar"]'::jsonb
  ),
  (
    'd2010000-0000-0000-0000-000000000008',
    'Tahu Gimbal Pak H. Edy',
    'c1010000-0000-0000-0000-000000000002',
    'Kuliner Tradisional',
    'Jl. Menteri Supeno, Mugassari (Taman Indonesia Kaya)',
    'Semarang',
    '$',
    25000,
    4.8,
    380,
    'Kuliner ikonik Semarang berisi tahu goreng lembut, potongan lontong, rajangan kol segar, telur ceplok, dan gimbal (bakwan udang) renyah berukuran lebar yang disiram saus petis kacang gurih pedas.',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    '0813-2578-1122',
    '10:00 - 22:00 WIB',
    true,
    '["Tahu Gimbal Komplit Bakwan Udang Jumbo", "Telur Ceplok Petis Pedas", "Kerupuk Udang Renyah"]'::jsonb
  );

-- 8. Masukkan Data Ulasan Komunitas Semarang
INSERT INTO reviews (restaurant_id, user_name, rating, comment) VALUES
  ('d2010000-0000-0000-0000-000000000001', 'Aliya Putri', 5, 'Creamy mala-nya juara banget! Bumbunya medok dan pedas chili oil-nya nagih, porsinya pas untuk makan siang.'),
  ('d2010000-0000-0000-0000-000000000001', 'Bagus Wicaksono', 5, 'Dimsum kuah creamy sama mie chili oil Singapore wajib dipesan. Tempatnya estetik dan pelayanannya cepat.'),
  ('d2010000-0000-0000-0000-000000000002', 'Dinda Larasati', 5, 'Misoa kuah komplit bener-bener comforting! Kuah kaldunya gurih segar dan pangsit cabainya mantap.'),
  ('d2010000-0000-0000-0000-000000000003', 'Rian Hidayat', 4, 'Warung Budhe selalu jadi penyelamat akhir bulan anak Tembalang. Masakan mangut ikan sama opor ayamnya mantap.'),
  ('d2010000-0000-0000-0000-000000000004', 'Siti Nurhaliza', 5, 'Kremesannya melimpah ruah dan super renyah! Sambal korek bawangnya nampol abis, ayamnya empuk gurih.'),
  ('d2010000-0000-0000-0000-000000000005', 'Fajar Ramadhan', 5, 'Bakmi Serangkai salah satu mie yamin terenak di Semarang. Tekstur mienya kenyal dan charsiu ayamnya gurih manis.'),
  ('d2010000-0000-0000-0000-000000000006', 'Kevin Sanjaya', 5, 'Gyu Nikudon dagingnya lembut bumbunya meresap sampai ke nasi. Telur onsennya meleleh sempurna!'),
  ('d2010000-0000-0000-0000-000000000007', 'Ibu Ratna', 5, 'Lumpia Gang Lombok memang nomor satu di Semarang, rebungnya manis tidak pesing sama sekali.');

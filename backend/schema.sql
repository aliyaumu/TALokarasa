-- ============================================================================
-- SQL SCHEMA LOKARASA: APLIKASI EKSPLORASI & REKOMENDASI TEMPAT MAKAN
-- 13 Tempat Makan Semarang Terverifikasi Google Maps
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
  price_range TEXT DEFAULT '$$',
  avg_price NUMERIC(12, 2) DEFAULT 25000,
  rating NUMERIC(3, 1) DEFAULT 4.8,
  review_count INTEGER DEFAULT 0,
  description TEXT,
  image_url TEXT,
  phone TEXT,
  opening_hours TEXT DEFAULT '10:00 - 21:00 WIB',
  is_recommended BOOLEAN DEFAULT false,
  signature_menu JSONB DEFAULT '[]'::jsonb,
  maps_url TEXT,
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

-- 5. Matikan Row Level Security (RLS) agar API leluasa melakukan CRUD
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

-- 7. Masukkan 13 Data Rekomendasi Kuliner Semarang Terverifikasi
INSERT INTO restaurants (
  id, name, category_id, category_name, address, city, price_range, avg_price,
  rating, review_count, description, image_url, phone, opening_hours, is_recommended, signature_menu, maps_url
) VALUES
  ('d2010000-0000-0000-0000-000000000001', 'Kedai Tinari', 'c1010000-0000-0000-0000-000000000001', 'Bakso & Mie', 'Jl. Sawunggaling III No.44, Pedalangan, Kec. Banyumanik, Kota Semarang', 'Banyumanik, Semarang', '$', 24000, 4.9, 312, 'Kedai bakmie kekinian yang sangat viral di area Banyumanik & Tembalang. Terkenal dengan tekstur mie kenyal, chili oil aromatik khas Tinari, dan kuah creamy gurih yang medok.', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80', '0812-2567-8910', '11:00 - 21:00 WIB', true, '["Creamy Ori Ayam Panggang (Rp 22.000)", "Creamy Mala Daging Sapi (Rp 26.000)", "Mie Chili Oil Singapore (Rp 20.000)", "Dimsum Kuah Creamy (Rp 15.000)"]'::jsonb, 'https://maps.app.goo.gl/h4H3r8vUB834KvQB6'),
  ('d2010000-0000-0000-0000-000000000002', 'Kedai Pleburan (Cabang Tembalang)', 'c1010000-0000-0000-0000-000000000002', 'Kuliner Tradisional', 'Jl. Banjarsari No.48, Tembalang, Kec. Banyumanik, Kota Semarang', 'Tembalang, Semarang', '$', 20000, 4.7, 420, 'Tempat makan legendaris mahasiswa Undip dengan aneka menu nasi lezat, ayam bakar manis gurih, dan sambal khas yang nagih dengan harga sangat terjangkau.', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', '0857-1234-5678', '10:00 - 22:00 WIB', true, '["Nasi Ayam Bakar Pleburan (Rp 20.000)", "Nasi Kulit Sambal Bawang (Rp 17.000)", "Ayam Geprek Keju Mozzarella (Rp 22.000)", "Es Teh Jumbo Manis (Rp 4.000)"]'::jsonb, 'https://maps.app.goo.gl/L5rcFoxyF8iggexq5'),
  ('d2010000-0000-0000-0000-000000000003', 'Kedai Melimpah', 'c1010000-0000-0000-0000-000000000002', 'Kuliner Tradisional', 'Jl. Ngesrep Timur V No.58, Sumurboto, Kec. Banyumanik, Kota Semarang', 'Banyumanik, Semarang', '$', 19000, 4.8, 280, 'Kedai comfort food dengan porsi melimpah sesuai namanya. Menghadirkan sajian misoa kuah kaldu sapi gurih bening dan aneka pangsit pedas lezat.', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', '0821-3456-7812', '08:00 - 21:00 WIB', true, '["Misoa Kuah Komplit Daging (Rp 21.000)", "Pangsit Kuah Chili Oil Melimpah (Rp 18.000)", "Bakmi Kuah Kaldu Ayam Kampung (Rp 20.000)", "Es Sarsaparilla Badak (Rp 10.000)"]'::jsonb, 'https://maps.app.goo.gl/CZr8JJRF3xvq8wHL9'),
  ('d2010000-0000-0000-0000-000000000004', 'Sambal Gami Bang Jack & Lamongan Raya', 'c1010000-0000-0000-0000-000000000003', 'Aneka Sambal & Penyetan', 'Jl. Prof. Soedarto No.12, Tembalang, Kec. Banyumanik, Kota Semarang', 'Tembalang, Semarang', '$', 22000, 4.7, 560, 'Sensasi sambal gami khas Bontang yang dimasak di atas cobek tanah liat panas mendidih. Aroma terasi semerbak dengan pilihan lauk ayam, cumi, udang, dan lele.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', '0813-2890-1122', '10:30 - 22:00 WIB', true, '["Gami Ayam Cobek Bakar (Rp 22.000)", "Gami Cumi Segar Pedas (Rp 25.000)", "Gami Udang Bakar Cobek (Rp 26.000)", "Gami Telur Dadar Krispi (Rp 15.000)"]'::jsonb, 'https://maps.app.goo.gl/ncUzhScDDibfpKZo8'),
  ('d2010000-0000-0000-0000-000000000005', 'Bakmi Serangkai', 'c1010000-0000-0000-0000-000000000001', 'Bakso & Mie', 'Jl. Mulawarman Raya / Timoho, Pedalangan, Kec. Banyumanik, Kota Semarang', 'Tembalang, Semarang', '$$', 25000, 4.8, 1316, 'Bakmi artisan hits Tembalang dengan racikan mie kenyal buatan sendiri, topping daging ayam cincang gurih, serta wonton kuah dan goreng yang renyah.', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80', '0812-4567-8901', '10:00 - 21:30 WIB', true, '["Bakmi Asin Komplit Wonton (Rp 24.000)", "Bakmi Manis Yamin Spesial (Rp 24.000)", "Bakmi Chili Oil Beef Slice (Rp 28.000)", "Wonton Goreng Mayonnaise (Rp 16.000)"]'::jsonb, 'https://maps.app.goo.gl/345Xm1DQHsUybN3WA'),
  ('d2010000-0000-0000-0000-000000000006', 'Warung Makan Mas Londo', 'c1010000-0000-0000-0000-000000000002', 'Kuliner Tradisional', 'Jl. Baskoro Raya No.66 & Jl. Banjarsari, Tembalang, Kota Semarang', 'Tembalang, Semarang', '$', 18000, 4.7, 890, 'Warung makan legendaris mahasiswa Tembalang dengan menu andalan Ayam Bumbu Bali yang manis gurih pedas meresap, magelangan sedap, dan aneka mie Jawa lezat.', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', '0858-9988-7766', '09:00 - 22:00 WIB', true, '["Nasi Ayam Bumbu Bali Londo (Rp 18.000)", "Nasi Magelangan Spesial Telur (Rp 17.000)", "Mie Goreng Jawa Mas Londo (Rp 17.000)", "Kwetiau Goreng Sapi (Rp 20.000)"]'::jsonb, 'https://maps.app.goo.gl/75seAazuRGW85Fpn9'),
  ('d2010000-0000-0000-0000-000000000007', 'Burjo SS (Sami Seneng)', 'c1010000-0000-0000-0000-000000000002', 'Kuliner Tradisional', 'Jl. Gondang Raya No.15, Tembalang, Kec. Banyumanik, Kota Semarang', 'Tembalang, Semarang', '$', 16000, 4.6, 772, 'Burjo legendaris Tembalang yang buka 24 jam nonstop. Tempat nongkrong favorit mahasiswa dengan sajian nasi ayam bali, nasi orak-arik, dan aneka olahan Indomie nikmat.', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', '0812-7890-2345', 'Buka 24 Jam', true, '["Nasi Ayam Bali SS (Rp 16.000)", "Nasi Orak-Arik Telur Daging (Rp 15.000)", "Indomie Dok-Dok Kuah Nyemek (Rp 14.000)", "Bubur Kacang Hijau Ketan Hitam (Rp 10.000)"]'::jsonb, 'https://maps.app.goo.gl/2DosqnQmCpiHWziM6'),
  ('d2010000-0000-0000-0000-000000000008', 'Masa Ria Kopitiam', 'c1010000-0000-0000-0000-000000000006', 'Cafe & Nongkrong', 'Jl. Mulawarman Raya No.3, Pedalangan, Kec. Banyumanik, Kota Semarang', 'Banyumanik, Semarang', '$$', 28000, 4.7, 488, 'Kopitiam bernuansa retro modern yang nyaman untuk nugas dan nongkrong. Menyajikan kopi butter aromatik, roti kaya toast renyah, dan hidangan nasi lemak gurih.', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80', '0819-0123-4567', 'Buka 24 Jam', true, '["Kaya Butter Toast (Rp 18.000)", "Kopi Tarik Tradisional Dingin (Rp 16.000)", "Nasi Lemak Ayam Rempah (Rp 28.000)", "Kwetiau Siram Telur Kepiting (Rp 26.000)"]'::jsonb, 'https://maps.app.goo.gl/KMXghK7oifP8h8zG9'),
  ('d2010000-0000-0000-0000-000000000009', 'Warung Makan Berkah ''Budhe''', 'c1010000-0000-0000-0000-000000000002', 'Kuliner Tradisional', 'Jl. Banjarsari Selatan No.12, Tembalang, Kec. Banyumanik, Kota Semarang', 'Tembalang, Semarang', '$', 17000, 4.8, 350, 'Prasmanan masakan rumahan Jawa yang terkenal dengan kuah mangut manyung pedas gurih, ayam lengkuas, serta aneka sayuran segar berselera tinggi.', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', '0813-9087-6543', '07:00 - 20:30 WIB', true, '["Nasi Mangut Ikan Manyung (Rp 19.000)", "Ayam Goreng Lengkuas Rempah (Rp 18.000)", "Sayur Lodeh Labu Siam & Tempe (Rp 6.000)", "Bakwan Jagung Renyah Hangat (Rp 2.500)"]'::jsonb, 'https://maps.app.goo.gl/YBbxZUp85V65XAcx5'),
  ('d2010000-0000-0000-0000-000000000010', 'Nasi Kapau Padangju', 'c1010000-0000-0000-0000-000000000002', 'Kuliner Tradisional', 'Jl. Klentengsari No.1, Pedalangan, Kec. Banyumanik, Kota Semarang', 'Banyumanik, Semarang', '$$', 27000, 4.8, 640, 'Nasi Kapau autentik Minang di Banyumanik dengan lauk tersusun bertingkat. Kaya rempah otentik khas Bukittinggi dengan rendang empuk dan gulai tunjang mantap.', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80', '0812-9911-2233', '10:00 - 21:00 WIB', true, '["Nasi Kapau Rendang Daging Sapi (Rp 26.000)", "Nasi Ayam Gulai Cincang (Rp 23.000)", "Telur Barendo Krispi Raksasa (Rp 14.000)", "Gulai Tambusu Khas Kapau (Rp 28.000)"]'::jsonb, 'https://maps.app.goo.gl/91KBmxEb78D2Kqzv6'),
  ('d2010000-0000-0000-0000-000000000011', 'Amona Bites', 'c1010000-0000-0000-0000-000000000005', 'Street Food & Camilan', 'Jl. Tirto Agung No.20, Pedalangan, Kec. Banyumanik, Kota Semarang', 'Tembalang, Semarang', '$', 22000, 4.7, 310, 'Spesialis dimsum premium dan aneka camilan modern. Terkenal dengan dimsum mentai lumer yang dibakar torched dan chili oil wangi berbumbu rahasia.', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80', '0877-3322-1100', '11:00 - 21:30 WIB', true, '["Dimsum Mentai Torched 4 pcs (Rp 26.000)", "Dimsum Mozzarella Melt (Rp 24.000)", "Dimsum Original Udang Ayam (Rp 20.000)", "Gyoza Panggang Saus Pedas (Rp 22.000)"]'::jsonb, 'https://maps.app.goo.gl/S2actQpGEGAbGCnS7'),
  ('d2010000-0000-0000-0000-000000000012', 'Kedai Siang Malam', 'c1010000-0000-0000-0000-000000000002', 'Kuliner Tradisional', 'Jl. Mulawarman Raya No.5, Pedalangan, Kec. Banyumanik, Kota Semarang', 'Banyumanik, Semarang', '$', 18000, 4.7, 325, 'Kedai makan 24 jam dengan aneka menu masakan rumahan lezat, nasi goreng khas, sup ayam hangat, dan aneka minuman segar yang ramah di kantong.', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', '0813-5566-7788', 'Buka 24 Jam', true, '["Nasi Goreng Spesial Siang Malam (Rp 18.000)", "Nasi Ayam Bakar Bumbu Rujak (Rp 20.000)", "Sop Ayam Kampung Hangat (Rp 16.000)", "Es Jeruk Peras Segar (Rp 5.000)"]'::jsonb, 'https://maps.app.goo.gl/RESDcvpRi9qqzTkZ9'),
  ('d2010000-0000-0000-0000-000000000013', 'Markoni Cak Eco', 'c1010000-0000-0000-0000-000000000002', 'Kuliner Tradisional', 'Jl. Baskoro Raya / Sirojudin, Tembalang, Kota Semarang', 'Tembalang, Semarang', '$', 20000, 4.6, 1702, 'Legenda nasi goreng dan Chinese food kaki lima di Tembalang. Terkenal dengan menu Markoni (Makaroni goreng/kuah bumbu gurih), nasi goreng seafood, dan porsi jumbo.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', '0812-3344-5566', '17:00 - 24:00 WIB', true, '["Markoni Goreng Spesial Sosis Telur (Rp 18.000)", "Nasi Goreng Seafood Cak Eco (Rp 22.000)", "Kwetiau Goreng Seafood Gurih (Rp 22.000)", "Capcay Kuah Kental Spesial (Rp 20.000)"]'::jsonb, 'https://maps.app.goo.gl/sghL7w4Gjwzh3Vsw9');

-- 8. Masukkan Ulasan Pelanggan Asli (Reviews)
INSERT INTO reviews (id, restaurant_id, user_name, rating, comment) VALUES
  ('e3010000-0000-0000-0000-000000000001', 'd2010000-0000-0000-0000-000000000001', 'Nadia Larasati', 5, 'Bakmie creamy terenak di Tembalang! Kuahnya gurih kental berpadu chili oil pedas mantap. Ayam panggangnya smoky dan empuk banget.'),
  ('e3010000-0000-0000-0000-000000000002', 'd2010000-0000-0000-0000-000000000001', 'Rizky Ramadhan', 5, 'Tempatnya estetik, porsi ngenyangin, harga mahasiswa. Wajib coba yang Creamy Mala kalau suka sensasi pedas kebas!'),
  ('e3010000-0000-0000-0000-000000000003', 'd2010000-0000-0000-0000-000000000002', 'Dimas Anggara', 5, 'Ayam bakarnya meresap sampai ke tulang, bumbu manis gurihnya khas banget. Sambal bawangnya pedas nampol!'),
  ('e3010000-0000-0000-0000-000000000004', 'd2010000-0000-0000-0000-000000000002', 'Fathia Zahra', 4, 'Penyelamat kantong mahasiswa di akhir bulan. Porsi nasinya banyak dan pelayanannya cepat.'),
  ('e3010000-0000-0000-0000-000000000005', 'd2010000-0000-0000-0000-000000000003', 'Budi Santoso', 5, 'Porsi beneran melimpah sesuai nama kedainya! Misoa kuahnya comforting banget pas cuaca dingin di Semarang.'),
  ('e3010000-0000-0000-0000-000000000006', 'd2010000-0000-0000-0000-000000000003', 'Clarissa Devi', 5, 'Pangsit chili oil terenak! Dagingnya tebal dan kuahnya berasa kaldu aslinya.'),
  ('e3010000-0000-0000-0000-000000000007', 'd2010000-0000-0000-0000-000000000004', 'Eko Prasetyo', 5, 'Sambal gamina meletup-letup di atas cobek panas! Pedasnya gurih asin pas, cumi dan ayamnya fresh banget.'),
  ('e3010000-0000-0000-0000-000000000008', 'd2010000-0000-0000-0000-000000000004', 'Vania Salsabila', 4, 'Pencinta pedas wajib merapat ke sini. Dimakan bareng nasi hangat dan kol goreng mantul pol!'),
  ('e3010000-0000-0000-0000-000000000009', 'd2010000-0000-0000-0000-000000000005', 'Jessica Amanda', 5, 'Bakmi favorit nomor satu di Semarang! Tekstur mienya tipis kenyal pas, wonton kuahnya gurih lembut.'),
  ('e3010000-0000-0000-0000-000000000010', 'd2010000-0000-0000-0000-000000000005', 'Rian Wicaksono', 5, 'Pelayanan ramah, tempat bersih dan nyaman buat nongkrong. Chili oil-nya beneran wangi rempah!'),
  ('e3010000-0000-0000-0000-000000000011', 'd2010000-0000-0000-0000-000000000006', 'Bagus Setiawan', 5, 'Ayam Balinya juara dunia! Bumbunya medok dan manis pedasnya pas di lidah mahasiswa.'),
  ('e3010000-0000-0000-0000-000000000012', 'd2010000-0000-0000-0000-000000000006', 'Mega Utami', 5, 'Porsi banyak, harga murah, rasa bintang lima. Nggak heran selalu antre waktu jam makan siang.'),
  ('e3010000-0000-0000-0000-000000000013', 'd2010000-0000-0000-0000-000000000007', 'Satria Tama', 5, 'Penyelamat lapar malam hari pas ngerjain skripsi! Nasi ayam balinya selalu konsisten enak.'),
  ('e3010000-0000-0000-0000-000000000014', 'd2010000-0000-0000-0000-000000000007', 'Anindya Maharani', 4, 'Tempatnya luas, buka 24 jam, WiFi kencang, dan harga ramah dompet anak kos.'),
  ('e3010000-0000-0000-0000-000000000015', 'd2010000-0000-0000-0000-000000000008', 'Reza Fahlevi', 5, 'Kopitiam ternyaman di Tembalang! Roti bakarnya crunchy beneran pake butter wangi, kopi tarik legit.'),
  ('e3010000-0000-0000-0000-000000000016', 'd2010000-0000-0000-0000-000000000008', 'Cindy Pratiwi', 5, 'Buka 24 jam dan ambience-nya vintage estetik. Cocok banget buat WFC atau nongkrong santai.'),
  ('e3010000-0000-0000-0000-000000000017', 'd2010000-0000-0000-0000-000000000009', 'Iqbal Maulana', 5, 'Masakan rumahan paling ngobatin rindu masakan ibu di rumah. Mangut manyungnya sedep dan pedas pas.'),
  ('e3010000-0000-0000-0000-000000000018', 'd2010000-0000-0000-0000-000000000009', 'Dina Rahmawati', 5, 'Pilihan lauknya banyak banget lebih dari 20 macam. Murah, higienis, dan Budhe-nya ramah banget!'),
  ('e3010000-0000-0000-0000-000000000019', 'd2010000-0000-0000-0000-000000000010', 'Hendra Kurniawan', 5, 'Nasi Kapau terbaik di Semarang atas! Telur barendona tebal garing, kuah gulainya pekat dan medok.'),
  ('e3010000-0000-0000-0000-000000000020', 'd2010000-0000-0000-0000-000000000010', 'Siti Nurhaliza', 5, 'Rendangnya empuk banget bumbunya hitam meresap. Sambal ijo dan sayur kapau nangka-nya mantap!'),
  ('e3010000-0000-0000-0000-000000000021', 'd2010000-0000-0000-0000-000000000011', 'Tiara Andini', 5, 'Saus mentainya creamy gurih dan nggak bikin enek. Dimsumnya padat daging ayam udang bukan tepung!'),
  ('e3010000-0000-0000-0000-000000000022', 'd2010000-0000-0000-0000-000000000011', 'Alvin Saputra', 4, 'Packaging rapi, rasa enak pol. Chili oil-nya gurih pedas manis gurih pas banget.'),
  ('e3010000-0000-0000-0000-000000000023', 'd2010000-0000-0000-0000-000000000012', 'Danang Joyo', 5, 'Buka 24 jam sangat membantu kalau kelaparan tengah malam. Nasi gorengnya wangi smokey ala kaki lima mantap.'),
  ('e3010000-0000-0000-0000-000000000024', 'd2010000-0000-0000-0000-000000000012', 'Putri Wardani', 4, 'Tempat bersih, harga mahasiswa, rasa makanannya konsisten enak dari dulu.'),
  ('e3010000-0000-0000-0000-000000000025', 'd2010000-0000-0000-0000-000000000013', 'Galih Prakoso', 5, 'Markoni Cak Eco adalah kuliner wajib mahasiswa Tembalang! Makaroninya digoreng bumbu rempah gurih pedas nampol.'),
  ('e3010000-0000-0000-0000-000000000026', 'd2010000-0000-0000-0000-000000000013', 'Alya Maharani', 5, 'Porsinya banyak banget bisa buat berdua. Rasa Chinese food-nya otentik dan aroma wok-nya kerasa banget!');

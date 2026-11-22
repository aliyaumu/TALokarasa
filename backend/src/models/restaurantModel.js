import { supabase, isSupabaseConfigured } from "../config/supabaseClient.js";

// In-Memory store fallback (Semarang Edition)
let mockRestaurants = [
  {
    "id": "d2010000-0000-0000-0000-000000000001",
    "name": "Kedai Tinari",
    "category_id": "c1010000-0000-0000-0000-000000000001",
    "category_name": "Bakso & Mie",
    "address": "Jl. Sawunggaling III No.44, Pedalangan, Kec. Banyumanik, Kota Semarang",
    "city": "Banyumanik, Semarang",
    "maps_url": "https://maps.app.goo.gl/h4H3r8vUB834KvQB6",
    "rating": 4.9,
    "review_count": 312,
    "avg_price": 24000,
    "price_range": "$",
    "phone": "0812-2567-8910",
    "opening_hours": "11:00 - 21:00 WIB",
    "is_recommended": true,
    "image_url": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    "description": "Kedai bakmie kekinian yang sangat viral di area Banyumanik & Tembalang. Terkenal dengan tekstur mie kenyal, chili oil aromatik khas Tinari, dan kuah creamy gurih yang medok.",
    "signature_menu": [
      "Creamy Ori Ayam Panggang (Rp 22.000)",
      "Creamy Mala Daging Sapi (Rp 26.000)",
      "Mie Chili Oil Singapore (Rp 20.000)",
      "Dimsum Kuah Creamy (Rp 15.000)"
    ],
    "sample_reviews": [
      {
        "user_name": "Nadia Larasati",
        "rating": 5,
        "comment": "Bakmie creamy terenak di Tembalang! Kuahnya gurih kental berpadu chili oil pedas mantap. Ayam panggangnya smoky dan empuk banget."
      },
      {
        "user_name": "Rizky Ramadhan",
        "rating": 5,
        "comment": "Tempatnya estetik, porsi ngenyangin, harga mahasiswa. Wajib coba yang Creamy Mala kalau suka sensasi pedas kebas!"
      }
    ]
  },
  {
    "id": "d2010000-0000-0000-0000-000000000002",
    "name": "Kedai Pleburan (Cabang Tembalang)",
    "category_id": "c1010000-0000-0000-0000-000000000002",
    "category_name": "Kuliner Tradisional",
    "address": "Jl. Banjarsari No.48, Tembalang, Kec. Banyumanik, Kota Semarang",
    "city": "Tembalang, Semarang",
    "maps_url": "https://maps.app.goo.gl/L5rcFoxyF8iggexq5",
    "rating": 4.7,
    "review_count": 420,
    "avg_price": 20000,
    "price_range": "$",
    "phone": "0857-1234-5678",
    "opening_hours": "10:00 - 22:00 WIB",
    "is_recommended": true,
    "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    "description": "Tempat makan legendaris mahasiswa Undip dengan aneka menu nasi lezat, ayam bakar manis gurih, dan sambal khas yang nagih dengan harga sangat terjangkau.",
    "signature_menu": [
      "Nasi Ayam Bakar Pleburan (Rp 20.000)",
      "Nasi Kulit Sambal Bawang (Rp 17.000)",
      "Ayam Geprek Keju Mozzarella (Rp 22.000)",
      "Es Teh Jumbo Manis (Rp 4.000)"
    ],
    "sample_reviews": [
      {
        "user_name": "Dimas Anggara",
        "rating": 5,
        "comment": "Ayam bakarnya meresap sampai ke tulang, bumbu manis gurihnya khas banget. Sambal bawangnya pedas nampol!"
      },
      {
        "user_name": "Fathia Zahra",
        "rating": 4,
        "comment": "Penyelamat kantong mahasiswa di akhir bulan. Porsi nasinya banyak dan pelayanannya cepat."
      }
    ]
  },
  {
    "id": "d2010000-0000-0000-0000-000000000003",
    "name": "Kedai Melimpah",
    "category_id": "c1010000-0000-0000-0000-000000000002",
    "category_name": "Kuliner Tradisional",
    "address": "Jl. Ngesrep Timur V No.58, Sumurboto, Kec. Banyumanik, Kota Semarang",
    "city": "Banyumanik, Semarang",
    "maps_url": "https://maps.app.goo.gl/CZr8JJRF3xvq8wHL9",
    "rating": 4.8,
    "review_count": 280,
    "avg_price": 19000,
    "price_range": "$",
    "phone": "0821-3456-7812",
    "opening_hours": "08:00 - 21:00 WIB",
    "is_recommended": true,
    "image_url": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    "description": "Kedai comfort food dengan porsi melimpah sesuai namanya. Menghadirkan sajian misoa kuah kaldu sapi gurih bening dan aneka pangsit pedas lezat.",
    "signature_menu": [
      "Misoa Kuah Komplit Daging (Rp 21.000)",
      "Pangsit Kuah Chili Oil Melimpah (Rp 18.000)",
      "Bakmi Kuah Kaldu Ayam Kampung (Rp 20.000)",
      "Es Sarsaparilla Badak (Rp 10.000)"
    ],
    "sample_reviews": [
      {
        "user_name": "Budi Santoso",
        "rating": 5,
        "comment": "Porsi beneran melimpah sesuai nama kedainya! Misoa kuahnya comforting banget pas cuaca dingin di Semarang."
      },
      {
        "user_name": "Clarissa Devi",
        "rating": 5,
        "comment": "Pangsit chili oil terenak! Dagingnya tebal dan kuahnya berasa kaldu aslinya."
      }
    ]
  },
  {
    "id": "d2010000-0000-0000-0000-000000000004",
    "name": "Sambal Gami Bang Jack & Lamongan Raya",
    "category_id": "c1010000-0000-0000-0000-000000000003",
    "category_name": "Aneka Sambal & Penyetan",
    "address": "Jl. Prof. Soedarto No.12, Tembalang, Kec. Banyumanik, Kota Semarang",
    "city": "Tembalang, Semarang",
    "maps_url": "https://maps.app.goo.gl/ncUzhScDDibfpKZo8",
    "rating": 4.7,
    "review_count": 560,
    "avg_price": 22000,
    "price_range": "$",
    "phone": "0813-2890-1122",
    "opening_hours": "10:30 - 22:00 WIB",
    "is_recommended": true,
    "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    "description": "Sensasi sambal gami khas Bontang yang dimasak di atas cobek tanah liat panas mendidih. Aroma terasi semerbak dengan pilihan lauk ayam, cumi, udang, dan lele.",
    "signature_menu": [
      "Gami Ayam Cobek Bakar (Rp 22.000)",
      "Gami Cumi Segar Pedas (Rp 25.000)",
      "Gami Udang Bakar Cobek (Rp 26.000)",
      "Gami Telur Dadar Krispi (Rp 15.000)"
    ],
    "sample_reviews": [
      {
        "user_name": "Eko Prasetyo",
        "rating": 5,
        "comment": "Sambal gamina meletup-letup di atas cobek panas! Pedasnya gurih asin pas, cumi dan ayamnya fresh banget."
      },
      {
        "user_name": "Vania Salsabila",
        "rating": 4,
        "comment": "Pencinta pedas wajib merapat ke sini. Dimakan bareng nasi hangat dan kol goreng mantul pol!"
      }
    ]
  },
  {
    "id": "d2010000-0000-0000-0000-000000000005",
    "name": "Bakmi Serangkai",
    "category_id": "c1010000-0000-0000-0000-000000000001",
    "category_name": "Bakso & Mie",
    "address": "Jl. Mulawarman Raya / Timoho, Pedalangan, Kec. Banyumanik, Kota Semarang",
    "city": "Tembalang, Semarang",
    "maps_url": "https://maps.app.goo.gl/345Xm1DQHsUybN3WA",
    "rating": 4.8,
    "review_count": 1316,
    "avg_price": 25000,
    "price_range": "$$",
    "phone": "0812-4567-8901",
    "opening_hours": "10:00 - 21:30 WIB",
    "is_recommended": true,
    "image_url": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    "description": "Bakmi artisan hits Tembalang dengan racikan mie kenyal buatan sendiri, topping daging ayam cincang gurih, serta wonton kuah dan goreng yang renyah.",
    "signature_menu": [
      "Bakmi Asin Komplit Wonton (Rp 24.000)",
      "Bakmi Manis Yamin Spesial (Rp 24.000)",
      "Bakmi Chili Oil Beef Slice (Rp 28.000)",
      "Wonton Goreng Mayonnaise (Rp 16.000)"
    ],
    "sample_reviews": [
      {
        "user_name": "Jessica Amanda",
        "rating": 5,
        "comment": "Bakmi favorit nomor satu di Semarang! Tekstur mienya tipis kenyal pas, wonton kuahnya gurih lembut."
      },
      {
        "user_name": "Rian Wicaksono",
        "rating": 5,
        "comment": "Pelayanan ramah, tempat bersih dan nyaman buat nongkrong. Chili oil-nya beneran wangi rempah!"
      }
    ]
  },
  {
    "id": "d2010000-0000-0000-0000-000000000006",
    "name": "Warung Makan Mas Londo",
    "category_id": "c1010000-0000-0000-0000-000000000002",
    "category_name": "Kuliner Tradisional",
    "address": "Jl. Baskoro Raya No.66 & Jl. Banjarsari, Tembalang, Kota Semarang",
    "city": "Tembalang, Semarang",
    "maps_url": "https://maps.app.goo.gl/75seAazuRGW85Fpn9",
    "rating": 4.7,
    "review_count": 890,
    "avg_price": 18000,
    "price_range": "$",
    "phone": "0858-9988-7766",
    "opening_hours": "09:00 - 22:00 WIB",
    "is_recommended": true,
    "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    "description": "Warung makan legendaris mahasiswa Tembalang dengan menu andalan Ayam Bumbu Bali yang manis gurih pedas meresap, magelangan sedap, dan aneka mie Jawa lezat.",
    "signature_menu": [
      "Nasi Ayam Bumbu Bali Londo (Rp 18.000)",
      "Nasi Magelangan Spesial Telur (Rp 17.000)",
      "Mie Goreng Jawa Mas Londo (Rp 17.000)",
      "Kwetiau Goreng Sapi (Rp 20.000)"
    ],
    "sample_reviews": [
      {
        "user_name": "Bagus Setiawan",
        "rating": 5,
        "comment": "Ayam Balinya juara dunia! Bumbunya medok dan manis pedasnya pas di lidah mahasiswa."
      },
      {
        "user_name": "Mega Utami",
        "rating": 5,
        "comment": "Porsi banyak, harga murah, rasa bintang lima. Nggak heran selalu antre waktu jam makan siang."
      }
    ]
  },
  {
    "id": "d2010000-0000-0000-0000-000000000007",
    "name": "Burjo SS (Sami Seneng)",
    "category_id": "c1010000-0000-0000-0000-000000000002",
    "category_name": "Kuliner Tradisional",
    "address": "Jl. Gondang Raya No.15, Tembalang, Kec. Banyumanik, Kota Semarang",
    "city": "Tembalang, Semarang",
    "maps_url": "https://maps.app.goo.gl/2DosqnQmCpiHWziM6",
    "rating": 4.6,
    "review_count": 772,
    "avg_price": 16000,
    "price_range": "$",
    "phone": "0812-7890-2345",
    "opening_hours": "Buka 24 Jam",
    "is_recommended": true,
    "image_url": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    "description": "Burjo legendaris Tembalang yang buka 24 jam nonstop. Tempat nongkrong favorit mahasiswa dengan sajian nasi ayam bali, nasi orak-arik, dan aneka olahan Indomie nikmat.",
    "signature_menu": [
      "Nasi Ayam Bali SS (Rp 16.000)",
      "Nasi Orak-Arik Telur Daging (Rp 15.000)",
      "Indomie Dok-Dok Kuah Nyemek (Rp 14.000)",
      "Bubur Kacang Hijau Ketan Hitam (Rp 10.000)"
    ],
    "sample_reviews": [
      {
        "user_name": "Satria Tama",
        "rating": 5,
        "comment": "Penyelamat lapar malam hari pas ngerjain skripsi! Nasi ayam balinya selalu konsisten enak."
      },
      {
        "user_name": "Anindya Maharani",
        "rating": 4,
        "comment": "Tempatnya luas, buka 24 jam, WiFi kencang, dan harga ramah dompet anak kos."
      }
    ]
  },
  {
    "id": "d2010000-0000-0000-0000-000000000008",
    "name": "Masa Ria Kopitiam",
    "category_id": "c1010000-0000-0000-0000-000000000006",
    "category_name": "Cafe & Nongkrong",
    "address": "Jl. Mulawarman Raya No.3, Pedalangan, Kec. Banyumanik, Kota Semarang",
    "city": "Banyumanik, Semarang",
    "maps_url": "https://maps.app.goo.gl/KMXghK7oifP8h8zG9",
    "rating": 4.7,
    "review_count": 488,
    "avg_price": 28000,
    "price_range": "$$",
    "phone": "0819-0123-4567",
    "opening_hours": "Buka 24 Jam",
    "is_recommended": true,
    "image_url": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    "description": "Kopitiam bernuansa retro modern yang nyaman untuk nugas dan nongkrong. Menyajikan kopi butter aromatik, roti kaya toast renyah, dan hidangan nasi lemak gurih.",
    "signature_menu": [
      "Kaya Butter Toast (Rp 18.000)",
      "Kopi Tarik Tradisional Dingin (Rp 16.000)",
      "Nasi Lemak Ayam Rempah (Rp 28.000)",
      "Kwetiau Siram Telur Kepiting (Rp 26.000)"
    ],
    "sample_reviews": [
      {
        "user_name": "Reza Fahlevi",
        "rating": 5,
        "comment": "Kopitiam ternyaman di Tembalang! Roti bakarnya crunchy beneran pake butter wangi, kopi tarik legit."
      },
      {
        "user_name": "Cindy Pratiwi",
        "rating": 5,
        "comment": "Buka 24 jam dan ambience-nya vintage estetik. Cocok banget buat WFC atau nongkrong santai."
      }
    ]
  },
  {
    "id": "d2010000-0000-0000-0000-000000000009",
    "name": "Warung Makan Berkah 'Budhe'",
    "category_id": "c1010000-0000-0000-0000-000000000002",
    "category_name": "Kuliner Tradisional",
    "address": "Jl. Banjarsari Selatan No.12, Tembalang, Kec. Banyumanik, Kota Semarang",
    "city": "Tembalang, Semarang",
    "maps_url": "https://maps.app.goo.gl/YBbxZUp85V65XAcx5",
    "rating": 4.8,
    "review_count": 350,
    "avg_price": 17000,
    "price_range": "$",
    "phone": "0813-9087-6543",
    "opening_hours": "07:00 - 20:30 WIB",
    "is_recommended": true,
    "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    "description": "Prasmanan masakan rumahan Jawa yang terkenal dengan kuah mangut manyung pedas gurih, ayam lengkuas, serta aneka sayuran segar berselera tinggi.",
    "signature_menu": [
      "Nasi Mangut Ikan Manyung (Rp 19.000)",
      "Ayam Goreng Lengkuas Rempah (Rp 18.000)",
      "Sayur Lodeh Labu Siam & Tempe (Rp 6.000)",
      "Bakwan Jagung Renyah Hangat (Rp 2.500)"
    ],
    "sample_reviews": [
      {
        "user_name": "Iqbal Maulana",
        "rating": 5,
        "comment": "Masakan rumahan paling ngobatin rindu masakan ibu di rumah. Mangut manyungnya sedep dan pedas pas."
      },
      {
        "user_name": "Dina Rahmawati",
        "rating": 5,
        "comment": "Pilihan lauknya banyak banget lebih dari 20 macam. Murah, higienis, dan Budhe-nya ramah banget!"
      }
    ]
  },
  {
    "id": "d2010000-0000-0000-0000-000000000010",
    "name": "Nasi Kapau Padangju",
    "category_id": "c1010000-0000-0000-0000-000000000002",
    "category_name": "Kuliner Tradisional",
    "address": "Jl. Klentengsari No.1, Pedalangan, Kec. Banyumanik, Kota Semarang",
    "city": "Banyumanik, Semarang",
    "maps_url": "https://maps.app.goo.gl/91KBmxEb78D2Kqzv6",
    "rating": 4.8,
    "review_count": 640,
    "avg_price": 27000,
    "price_range": "$$",
    "phone": "0812-9911-2233",
    "opening_hours": "10:00 - 21:00 WIB",
    "is_recommended": true,
    "image_url": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "description": "Nasi Kapau autentik Minang di Banyumanik dengan lauk tersusun bertingkat. Kaya rempah otentik khas Bukittinggi dengan rendang empuk dan gulai tunjang mantap.",
    "signature_menu": [
      "Nasi Kapau Rendang Daging Sapi (Rp 26.000)",
      "Nasi Ayam Gulai Cincang (Rp 23.000)",
      "Telur Barendo Krispi Raksasa (Rp 14.000)",
      "Gulai Tambusu Khas Kapau (Rp 28.000)"
    ],
    "sample_reviews": [
      {
        "user_name": "Hendra Kurniawan",
        "rating": 5,
        "comment": "Nasi Kapau terbaik di Semarang atas! Telur barendona tebal garing, kuah gulainya pekat dan medok."
      },
      {
        "user_name": "Siti Nurhaliza",
        "rating": 5,
        "comment": "Rendangnya empuk banget bumbunya hitam meresap. Sambal ijo dan sayur kapau nangka-nya mantap!"
      }
    ]
  },
  {
    "id": "d2010000-0000-0000-0000-000000000011",
    "name": "Amona Bites",
    "category_id": "c1010000-0000-0000-0000-000000000005",
    "category_name": "Street Food & Camilan",
    "address": "Jl. Tirto Agung No.20, Pedalangan, Kec. Banyumanik, Kota Semarang",
    "city": "Tembalang, Semarang",
    "maps_url": "https://maps.app.goo.gl/S2actQpGEGAbGCnS7",
    "rating": 4.7,
    "review_count": 310,
    "avg_price": 22000,
    "price_range": "$",
    "phone": "0877-3322-1100",
    "opening_hours": "11:00 - 21:30 WIB",
    "is_recommended": true,
    "image_url": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    "description": "Spesialis dimsum premium dan aneka camilan modern. Terkenal dengan dimsum mentai lumer yang dibakar torched dan chili oil wangi berbumbu rahasia.",
    "signature_menu": [
      "Dimsum Mentai Torched 4 pcs (Rp 26.000)",
      "Dimsum Mozzarella Melt (Rp 24.000)",
      "Dimsum Original Udang Ayam (Rp 20.000)",
      "Gyoza Panggang Saus Pedas (Rp 22.000)"
    ],
    "sample_reviews": [
      {
        "user_name": "Tiara Andini",
        "rating": 5,
        "comment": "Saus mentainya creamy gurih dan nggak bikin enek. Dimsumnya padat daging ayam udang bukan tepung!"
      },
      {
        "user_name": "Alvin Saputra",
        "rating": 4,
        "comment": "Packaging rapi, rasa enak pol. Chili oil-nya gurih pedas manis gurih pas banget."
      }
    ]
  },
  {
    "id": "d2010000-0000-0000-0000-000000000012",
    "name": "Kedai Siang Malam",
    "category_id": "c1010000-0000-0000-0000-000000000002",
    "category_name": "Kuliner Tradisional",
    "address": "Jl. Mulawarman Raya No.5, Pedalangan, Kec. Banyumanik, Kota Semarang",
    "city": "Banyumanik, Semarang",
    "maps_url": "https://maps.app.goo.gl/RESDcvpRi9qqzTkZ9",
    "rating": 4.7,
    "review_count": 325,
    "avg_price": 18000,
    "price_range": "$",
    "phone": "0813-5566-7788",
    "opening_hours": "Buka 24 Jam",
    "is_recommended": true,
    "image_url": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    "description": "Kedai makan 24 jam dengan aneka menu masakan rumahan lezat, nasi goreng khas, sup ayam hangat, dan aneka minuman segar yang ramah di kantong.",
    "signature_menu": [
      "Nasi Goreng Spesial Siang Malam (Rp 18.000)",
      "Nasi Ayam Bakar Bumbu Rujak (Rp 20.000)",
      "Sop Ayam Kampung Hangat (Rp 16.000)",
      "Es Jeruk Peras Segar (Rp 5.000)"
    ],
    "sample_reviews": [
      {
        "user_name": "Danang Joyo",
        "rating": 5,
        "comment": "Buka 24 jam sangat membantu kalau kelaparan tengah malam. Nasi gorengnya wangi smokey ala kaki lima mantap."
      },
      {
        "user_name": "Putri Wardani",
        "rating": 4,
        "comment": "Tempat bersih, harga mahasiswa, rasa makanannya konsisten enak dari dulu."
      }
    ]
  },
  {
    "id": "d2010000-0000-0000-0000-000000000013",
    "name": "Markoni Cak Eco",
    "category_id": "c1010000-0000-0000-0000-000000000002",
    "category_name": "Kuliner Tradisional",
    "address": "Jl. Baskoro Raya / Sirojudin, Tembalang, Kota Semarang",
    "city": "Tembalang, Semarang",
    "maps_url": "https://maps.app.goo.gl/sghL7w4Gjwzh3Vsw9",
    "rating": 4.6,
    "review_count": 1702,
    "avg_price": 20000,
    "price_range": "$",
    "phone": "0812-3344-5566",
    "opening_hours": "17:00 - 24:00 WIB",
    "is_recommended": true,
    "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    "description": "Legenda nasi goreng dan Chinese food kaki lima di Tembalang. Terkenal dengan menu Markoni (Makaroni goreng/kuah bumbu gurih), nasi goreng seafood, dan porsi jumbo.",
    "signature_menu": [
      "Markoni Goreng Spesial Sosis Telur (Rp 18.000)",
      "Nasi Goreng Seafood Cak Eco (Rp 22.000)",
      "Kwetiau Goreng Seafood Gurih (Rp 22.000)",
      "Capcay Kuah Kental Spesial (Rp 20.000)"
    ],
    "sample_reviews": [
      {
        "user_name": "Galih Prakoso",
        "rating": 5,
        "comment": "Markoni Cak Eco adalah kuliner wajib mahasiswa Tembalang! Makaroninya digoreng bumbu rempah gurih pedas nampol."
      },
      {
        "user_name": "Alya Maharani",
        "rating": 5,
        "comment": "Porsinya banyak banget bisa buat berdua. Rasa Chinese food-nya otentik dan aroma wok-nya kerasa banget!"
      }
    ]
  }
];

export const RestaurantModel = {
  async getAll(params = {}) {
    if (isSupabaseConfigured) {
      let query = supabase.from("restaurants").select(`
        *,
        categories ( id, name, icon )
      `);

      if (params.search) {
        query = query.ilike("name", `%${params.search}%`);
      }
      if (params.category_id) {
        query = query.eq("category_id", params.category_id);
      }
      if (params.category && params.category !== "Semua") {
        query = query.eq("category_name", params.category);
      }
      if (params.is_recommended !== undefined) {
        query = query.eq("is_recommended", params.is_recommended === "true" || params.is_recommended === true);
      }

      if (params.sort_by) {
        const order = params.order === "asc";
        query = query.order(params.sort_by, { ascending: order });
      } else {
        // Tampilkan tempat makan yang baru ditambahkan di paling atas
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }

    // Fallback in-memory filter & sort
    let result = [...mockRestaurants];
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.address?.toLowerCase().includes(q)
      );
    }
    if (params.category && params.category !== "Semua") {
      result = result.filter((r) => r.category_name === params.category);
    }
    if (params.category_id) {
      result = result.filter((r) => r.category_id === params.category_id);
    }
    if (params.is_recommended !== undefined) {
      const isRec = params.is_recommended === "true" || params.is_recommended === true;
      result = result.filter((r) => r.is_recommended === isRec);
    }

    const sortKey = params.sort_by || "rating";
    const isAsc = params.order === "asc";
    result.sort((a, b) => {
      const valA = a[sortKey] ?? 0;
      const valB = b[sortKey] ?? 0;
      if (typeof valA === "string") {
        return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return isAsc ? valA - valB : valB - valA;
    });

    return result;
  },

  async getById(id) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("restaurants")
        .select(`
          *,
          categories ( id, name, icon ),
          reviews ( id, user_name, rating, comment, created_at )
        `)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    }

    const item = mockRestaurants.find((r) => r.id === id);
    if (!item) throw new Error("Tempat makan tidak ditemukan");
    return item;
  },

  async create(payload) {
    const CATEGORY_MAP = {
      "Bakso & Mie": "c1010000-0000-0000-0000-000000000001",
      "Kuliner Tradisional": "c1010000-0000-0000-0000-000000000002",
      "Aneka Sambal & Penyetan": "c1010000-0000-0000-0000-000000000003",
      "Asian & Donburi": "c1010000-0000-0000-0000-000000000004",
      "Street Food & Camilan": "c1010000-0000-0000-0000-000000000005",
      "Cafe & Nongkrong": "c1010000-0000-0000-0000-000000000006",
    };

    const catName = payload.category_name || "Bakso & Mie";
    const mappedCatId = payload.category_id || CATEGORY_MAP[catName] || null;

    const newRecord = {
      name: payload.name,
      category_id: mappedCatId,
      category_name: catName,
      address: payload.address || "Semarang",
      city: payload.city || "Semarang",
      price_range: payload.price_range || "$$",
      avg_price: Number(payload.avg_price) || 25000,
      rating: Number(payload.rating) || 4.9,
      review_count: 1,
      description: payload.description || "",
      image_url: payload.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      phone: payload.phone || "0812-0000-0000",
      opening_hours: payload.opening_hours || "10:00 - 21:00 WIB",
      is_recommended: payload.is_recommended !== undefined ? Boolean(payload.is_recommended) : true,
      signature_menu: Array.isArray(payload.signature_menu) ? payload.signature_menu : ["Menu Spesial"],
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("restaurants")
        .insert([newRecord])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const created = {
      ...newRecord,
      id: `resto-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    mockRestaurants.unshift(created);
    return created;
  },

  async update(id, payload) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("restaurants")
        .update({
          ...payload,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const idx = mockRestaurants.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error("Tempat makan tidak ditemukan");
    mockRestaurants[idx] = {
      ...mockRestaurants[idx],
      ...payload,
      updated_at: new Date().toISOString(),
    };
    return mockRestaurants[idx];
  },

  async remove(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from("restaurants").delete().eq("id", id);
      if (error) throw error;
      return { message: "Tempat makan berhasil dihapus" };
    }

    const idx = mockRestaurants.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error("Tempat makan tidak ditemukan");
    mockRestaurants.splice(idx, 1);
    return { message: "Tempat makan berhasil dihapus" };
  },
};

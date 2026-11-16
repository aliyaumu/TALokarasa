import { supabase, isSupabaseConfigured } from "../config/supabaseClient.js";

// In-Memory store fallback
let mockRestaurants = [
  {
    id: "r2010000-0000-0000-0000-000000000001",
    name: "Gudeg Yu Djum Wijilan 167",
    category_id: "c1010000-0000-0000-0000-000000000001",
    category_name: "Kuliner Tradisional",
    address: "Jl. Wijilan No.167, Panembahan, Kraton",
    city: "Yogyakarta",
    price_range: "$$",
    avg_price: 35000,
    rating: 4.8,
    review_count: 142,
    description: "Pelopor gudeg kering legendaris khas Jogja yang dimasak dengan kayu bakar selama berjam-jam menghasilkan cita rasa manis gurih yang otentik dan tahan lama.",
    image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    phone: "0812-3456-7890",
    opening_hours: "06:00 - 22:00",
    is_recommended: true,
    signature_menu: ["Gudeg Komplit Telur & Ayam Suwir", "Krecek Pedas Gurih", "Tahu Tempe Bacem"],
    created_at: new Date().toISOString()
  },
  {
    id: "r2010000-0000-0000-0000-000000000002",
    name: "Kopi Klotok Pakem",
    category_id: "c1010000-0000-0000-0000-000000000002",
    category_name: "Cafe & Kopi",
    address: "Jl. Kaliurang KM 16, Pakem, Sleman",
    city: "Yogyakarta",
    price_range: "$",
    avg_price: 20000,
    rating: 4.9,
    review_count: 280,
    description: "Menikmati suasana pedesaan dengan pemandangan sawah hijau asri sambil menyeruput kopi klotok panas dan pisang goreng krispi yang terkenal renyah manis.",
    image_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    phone: "0813-9876-5432",
    opening_hours: "07:00 - 21:00",
    is_recommended: true,
    signature_menu: ["Kopi Klotok Panas", "Pisang Goreng Crispy", "Sayur Lodeh Kluwih", "Telur Dadar Crispy"],
    created_at: new Date().toISOString()
  },
  {
    id: "r2010000-0000-0000-0000-000000000003",
    name: "Sate Klathak Pak Pong",
    category_id: "c1010000-0000-0000-0000-000000000001",
    category_name: "Kuliner Tradisional",
    address: "Jl. Sultan Agung No.18, Jejeran, Wonokromo, Pleret",
    city: "Bantul",
    price_range: "$$",
    avg_price: 45000,
    rating: 4.7,
    review_count: 195,
    description: "Sate kambing muda unik yang ditusuk menggunakan jeruji besi sepeda motor agar panas merata ke dalam daging. Diberi bumbu garam sederhana dengan kuah gulai gurih mantap.",
    image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    phone: "0811-2233-4455",
    opening_hours: "09:00 - 23:00",
    is_recommended: true,
    signature_menu: ["Sate Klathak 2 Tusuk", "Tongseng Kambing", "Kicik Kambing", "Gulai Balungan"],
    created_at: new Date().toISOString()
  },
  {
    id: "r2010000-0000-0000-0000-000000000004",
    name: "Angkringan KR (Kedaulatan Rakyat)",
    category_id: "c1010000-0000-0000-0000-000000000003",
    category_name: "Street Food & Angkringan",
    address: "Jl. P. Mangkubumi No.40, Gowongan, Jetis",
    city: "Yogyakarta",
    price_range: "$",
    avg_price: 15000,
    rating: 4.6,
    review_count: 98,
    description: "Spot nongkrong malam legendaris tempat berkumpul mahasiswa dan warga lokal. Menyediakan beraneka ragam nasi kucing, aneka sate usus, telur puyuh, dan Kopi Joss berarang panas.",
    image_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    phone: "0878-1234-5678",
    opening_hours: "17:00 - 02:00",
    is_recommended: false,
    signature_menu: ["Kopi Joss Arang Membara", "Nasi Kucing Sambal Teri", "Sate Kulit Bakar Manis", "Wedang Jahe"],
    created_at: new Date().toISOString()
  },
  {
    id: "r2010000-0000-0000-0000-000000000005",
    name: "Seafood 99 Pasir Putih",
    category_id: "c1010000-0000-0000-0000-000000000004",
    category_name: "Seafood & Bakaran",
    address: "Jl. Kaliurang KM 5.5 No.21, Caturtunggal, Depok",
    city: "Sleman",
    price_range: "$$$",
    avg_price: 65000,
    rating: 4.7,
    review_count: 110,
    description: "Menyajikan olahan hidangan laut segar pilihan mulai dari kepiting saus padang melimpah, udang bakar madu, hingga cumi goreng tepung krispi dengan porsi puas.",
    image_url: "https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80",
    phone: "0856-7890-1234",
    opening_hours: "11:00 - 22:30",
    is_recommended: true,
    signature_menu: ["Kepiting Saus Padang Spesial", "Udang Bakar Madu Jimbaran", "Cumi Goreng Tepung", "Kangkung Belacan"],
    created_at: new Date().toISOString()
  },
  {
    id: "r2010000-0000-0000-0000-000000000006",
    name: "Bakso Klenger Ratu Sari",
    category_id: "c1010000-0000-0000-0000-000000000005",
    category_name: "Bakso & Mie",
    address: "Jl. Wahid Hasyim No.296, Nologaten, Caturtunggal",
    city: "Sleman",
    price_range: "$$",
    avg_price: 30000,
    rating: 4.5,
    review_count: 85,
    description: "Sensasi menikmati bakso sapi asli dengan ukuran jumbo yang mengenyangkan, mulai dari berat 250 gram hingga 5 kilogram dengan isian tetelan dan telur utuh di dalamnya.",
    image_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    phone: "0821-3456-9871",
    opening_hours: "10:00 - 21:00",
    is_recommended: false,
    signature_menu: ["Bakso Klenger Reguler", "Bakso Granat Pedas Cabai", "Mie Pangsit Tetelan"],
    created_at: new Date().toISOString()
  },
  {
    id: "r2010000-0000-0000-0000-000000000007",
    name: "Warung Spesial Sambal (SS) Pandega",
    category_id: "c1010000-0000-0000-0000-000000000006",
    category_name: "Aneka Sambal & Lalapan",
    address: "Jl. Pandega Marta No.47, Caturtunggal, Depok",
    city: "Sleman",
    price_range: "$",
    avg_price: 25000,
    rating: 4.8,
    review_count: 220,
    description: "Pusat aneka sambal Nusantara dengan lebih dari 30 varian sambal segar yang diulek dadakan. Sangat cocok dipadukan dengan ayam goreng gurih, lele bakar, dan sayur asem segar.",
    image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    phone: "0819-8765-4321",
    opening_hours: "10:00 - 22:00",
    is_recommended: true,
    signature_menu: ["Sambal Bawang Goreng", "Sambal Terasi Segar", "Ayam Goreng Lengkuas", "Jamur Crispy Sambal Korek"],
    created_at: new Date().toISOString()
  },
  {
    id: "r2010000-0000-0000-0000-000000000008",
    name: "Aroma Resto & Coffee Garden",
    category_id: "c1010000-0000-0000-0000-000000000002",
    category_name: "Cafe & Kopi",
    address: "Jl. Palagan Tentara Pelajar KM 8.5",
    city: "Sleman",
    price_range: "$$$",
    avg_price: 55000,
    rating: 4.6,
    review_count: 76,
    description: "Konsep kafe terbuka bernuansa taman tropis yang asri dan sejuk. Tempat sempurna untuk santap siang bersama keluarga, WFC (Work From Cafe), atau bersantai sore.",
    image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    phone: "0812-7788-9900",
    opening_hours: "08:00 - 23:00",
    is_recommended: true,
    signature_menu: ["Caramel Macchiato Signature", "Grilled Salmon Lemon Herb", "Croissant Butter & Berry"],
    created_at: new Date().toISOString()
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
        query = query.order("rating", { ascending: false });
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
    const newRecord = {
      name: payload.name,
      category_id: payload.category_id || null,
      category_name: payload.category_name || "Kuliner Tradisional",
      address: payload.address || "Yogyakarta",
      city: payload.city || "Yogyakarta",
      price_range: payload.price_range || "$$",
      avg_price: Number(payload.avg_price) || 25000,
      rating: Number(payload.rating) || 4.5,
      review_count: 0,
      description: payload.description || "",
      image_url: payload.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      phone: payload.phone || "0812-0000-0000",
      opening_hours: payload.opening_hours || "09:00 - 21:00",
      is_recommended: Boolean(payload.is_recommended),
      signature_menu: Array.isArray(payload.signature_menu) ? payload.signature_menu : [],
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

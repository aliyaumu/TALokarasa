import { supabase, isSupabaseConfigured } from "../config/supabaseClient.js";

// In-Memory store fallback (Semarang Edition)
let mockRestaurants = [
  {
    id: "d2010000-0000-0000-0000-000000000001",
    name: "Kedai Tinari",
    category_id: "c1010000-0000-0000-0000-000000000001",
    category_name: "Bakso & Mie",
    address: "Jl. Sawunggaling III No.44, Pedalangan, Kec. Banyumanik",
    city: "Semarang",
    price_range: "$",
    avg_price: 23000,
    rating: 4.9,
    review_count: 312,
    description: "Spot kuliner bakmie kekinian yang viral di area Tembalang/Banyumanik. Terkenal dengan tekstur mie kenyal berpadu kuah creamy gurih yang medok dan sensasi pedas mantap dari chili oil khas Tinari.",
    image_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    phone: "0812-2567-8910",
    opening_hours: "11:00 - 21:00 WIB",
    is_recommended: true,
    signature_menu: ["Creamy Ori Ayam Panggang", "Creamy Mala Daging Sapi", "Mie Chili Oil Singapore", "Dimsum Kuah Creamy"],
    created_at: new Date().toISOString()
  },
  {
    id: "d2010000-0000-0000-0000-000000000002",
    name: "Kedai Melimbah",
    category_id: "c1010000-0000-0000-0000-000000000002",
    category_name: "Kuliner Tradisional",
    address: "Jl. Srondol Bumi Indah No.27, Sumurboto, Kec. Banyumanik",
    city: "Semarang",
    price_range: "$",
    avg_price: 18000,
    rating: 4.8,
    review_count: 245,
    description: "Kedai comfort food idola mahasiswa dengan porsi melimpah dan kuah kaldu hangat yang gurih bening. Sajian misoa kuah komplit dan pangsit pedasnya sangat cocok dinikmati saat santap siang maupun malam.",
    image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    phone: "0821-3456-7812",
    opening_hours: "08:00 - 21:00 WIB",
    is_recommended: true,
    signature_menu: ["Misoa Kuah Komplit Daging", "Pangsit Chili Oil Melimpah", "Bakmi Kuah Kaldu Ayam", "Es Sarsaparilla Badak"],
    created_at: new Date().toISOString()
  },
  {
    id: "d2010000-0000-0000-0000-000000000003",
    name: "Warung Makan Budhe",
    category_id: "c1010000-0000-0000-0000-000000000002",
    category_name: "Kuliner Tradisional",
    address: "Jl. Banjarsari Selatan, Tembalang, Kec. Banyumanik",
    city: "Semarang",
    price_range: "$",
    avg_price: 16000,
    rating: 4.7,
    review_count: 189,
    description: "Warung makan prasmanan masakan rumahan Jawa yang selalu ramai pembeli. Pilihan sayur lodeh, mangut ikan, opor ayam kampung, serta aneka gorengan hangat dengan harga yang super ramah di kantong.",
    image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    phone: "0813-9087-6543",
    opening_hours: "07:00 - 20:00 WIB",
    is_recommended: false,
    signature_menu: ["Nasi Rames Mangut Ikan Manyung", "Ayam Goreng Bumbu Lengkuas", "Sayur Asem & Tempe Mendoan", "Sambal Terasi Ulek"],
    created_at: new Date().toISOString()
  },
  {
    id: "d2010000-0000-0000-0000-000000000004",
    name: "Sami Seneng",
    category_id: "c1010000-0000-0000-0000-000000000003",
    category_name: "Aneka Sambal & Penyetan",
    address: "Jl. Banjarsari Raya No.40, Tembalang, Kec. Banyumanik",
    city: "Semarang",
    price_range: "$",
    avg_price: 21000,
    rating: 4.9,
    review_count: 420,
    description: "Spesialis ayam dan bebek penyetan dengan limpahan taburan kremesan renyah gurih keemasan. Dipadukan dengan sambal tomat manis segar atau sambal korek bawang yang pedas membakar lidah.",
    image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    phone: "0857-1234-9876",
    opening_hours: "11:00 - 22:00 WIB",
    is_recommended: true,
    signature_menu: ["Ayam Goreng Kremes Crispy", "Bebek Bakar Sambal Korek", "Lele Goreng Kremes", "Kulit Ayam Goreng Renyah"],
    created_at: new Date().toISOString()
  },
  {
    id: "d2010000-0000-0000-0000-000000000005",
    name: "Bak Mie Serangkai",
    category_id: "c1010000-0000-0000-0000-000000000001",
    category_name: "Bakso & Mie",
    address: "Jl. Veteran No.3A, Lempongsari, Kec. Gajahmungkur",
    city: "Semarang",
    price_range: "$$",
    avg_price: 25000,
    rating: 4.8,
    review_count: 275,
    description: "Kedai bakmi bergaya artisanal di pusat Kota Semarang. Menggunakan mie buatan tangan (*handmade*) dengan bumbu minyak gurih aromatik dan pilihan topping ayam charsiu serta pangsit goreng renyah.",
    image_url: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80",
    phone: "0811-2789-0123",
    opening_hours: "12:00 - 21:30 WIB",
    is_recommended: true,
    signature_menu: ["Mie Yamin Charsiu Ayam", "Mie Chili Oil Serangkai", "Mie Ayam Komplit Pangsit Kuah", "Pangsit Goreng Emas"],
    created_at: new Date().toISOString()
  },
  {
    id: "d2010000-0000-0000-0000-000000000006",
    name: "Niki Nikudon",
    category_id: "c1010000-0000-0000-0000-000000000004",
    category_name: "Asian & Donburi",
    address: "Jl. Tirto Agung No.11, Pedalangan, Kec. Banyumanik",
    city: "Semarang",
    price_range: "$$",
    avg_price: 28000,
    rating: 4.7,
    review_count: 160,
    description: "Spesialis rice bowl Jepang (Donburi) favorit anak muda Semarang dengan irisan daging sapi empuk berbumbu manis gurih khas Tokyo, disajikan hangat di atas nasi pulen dan telur onsen setengah matang.",
    image_url: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80",
    phone: "0819-0123-4567",
    opening_hours: "10:30 - 21:00 WIB",
    is_recommended: true,
    signature_menu: ["Signature Gyu Nikudon", "Tori Karaage Curry Don", "Spicy Garlic Beef Bowl", "Tamagoyaki Roll"],
    created_at: new Date().toISOString()
  },
  {
    id: "d2010000-0000-0000-0000-000000000007",
    name: "Lumpia Gang Lombok No. 1",
    category_id: "c1010000-0000-0000-0000-000000000005",
    category_name: "Street Food & Camilan",
    address: "Jl. Gang Lombok No.1, Purwodinatan, Semarang Tengah",
    city: "Semarang",
    price_range: "$",
    avg_price: 22000,
    rating: 4.9,
    review_count: 510,
    description: "Pelopor lumpia tertua dan paling legendaris di Semarang sejak abad ke-19. Isian rebung muda manis renyah tanpa bau pesing, berpadu cacahan udang dan telur dengan saus cocolan bawang cokelat kental.",
    image_url: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80",
    phone: "0816-4881-808",
    opening_hours: "08:00 - 17:00 WIB",
    is_recommended: true,
    signature_menu: ["Lumpia Goreng Spesial Rebung Udang", "Lumpia Basah Tradisional", "Saus Bawang Kental & Daun Bawang Segar"],
    created_at: new Date().toISOString()
  },
  {
    id: "d2010000-0000-0000-0000-000000000008",
    name: "Tahu Gimbal Pak H. Edy",
    category_id: "c1010000-0000-0000-0000-000000000002",
    category_name: "Kuliner Tradisional",
    address: "Jl. Menteri Supeno, Mugassari (Taman Indonesia Kaya)",
    city: "Semarang",
    price_range: "$",
    avg_price: 25000,
    rating: 4.8,
    review_count: 380,
    description: "Kuliner ikonik Semarang berisi tahu goreng lembut, potongan lontong, rajangan kol segar, telur ceplok, dan gimbal (bakwan udang) renyah berukuran lebar yang disiram saus petis kacang gurih pedas.",
    image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    phone: "0813-2578-1122",
    opening_hours: "10:00 - 22:00 WIB",
    is_recommended: true,
    signature_menu: ["Tahu Gimbal Komplit Bakwan Udang Jumbo", "Telur Ceplok Petis Pedas", "Kerupuk Udang Renyah"],
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
      address: payload.address || "Semarang",
      city: payload.city || "Semarang",
      price_range: payload.price_range || "$$",
      avg_price: Number(payload.avg_price) || 25000,
      rating: Number(payload.rating) || 4.8,
      review_count: 0,
      description: payload.description || "",
      image_url: payload.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      phone: payload.phone || "0812-0000-0000",
      opening_hours: payload.opening_hours || "10:00 - 21:00 WIB",
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

import { supabase, isSupabaseConfigured } from "../config/supabaseClient.js";

// In-Memory store fallback (Semarang Edition)
let mockReviews = [
  {
    id: "rev-1",
    restaurant_id: "d2010000-0000-0000-0000-000000000001",
    user_name: "Aliya Putri",
    rating: 5,
    comment: "Creamy mala-nya juara banget! Bumbunya medok dan pedas chili oil-nya nagih, porsinya pas untuk makan siang.",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "rev-2",
    restaurant_id: "d2010000-0000-0000-0000-000000000001",
    user_name: "Bagus Wicaksono",
    rating: 5,
    comment: "Dimsum kuah creamy sama mie chili oil Singapore wajib dipesan. Tempatnya estetik dan pelayanannya cepat.",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "rev-3",
    restaurant_id: "d2010000-0000-0000-0000-000000000002",
    user_name: "Dinda Larasati",
    rating: 5,
    comment: "Misoa kuah komplit bener-bener comforting! Kuah kaldunya gurih segar dan pangsit cabainya mantap.",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "rev-4",
    restaurant_id: "d2010000-0000-0000-0000-000000000003",
    user_name: "Rian Hidayat",
    rating: 4,
    comment: "Warung Budhe selalu jadi penyelamat akhir bulan anak Tembalang. Masakan mangut ikan sama opor ayamnya mantap.",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "rev-5",
    restaurant_id: "d2010000-0000-0000-0000-000000000004",
    user_name: "Siti Nurhaliza",
    rating: 5,
    comment: "Kremesannya melimpah ruah dan super renyah! Sambal korek bawangnya nampol abis, ayamnya empuk gurih.",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "rev-6",
    restaurant_id: "d2010000-0000-0000-0000-000000000005",
    user_name: "Fajar Ramadhan",
    rating: 5,
    comment: "Bakmi Serangkai salah satu mie yamin terenak di Semarang. Tekstur mienya kenyal dan charsiu ayamnya gurih manis.",
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: "rev-7",
    restaurant_id: "d2010000-0000-0000-0000-000000000006",
    user_name: "Kevin Sanjaya",
    rating: 5,
    comment: "Gyu Nikudon dagingnya lembut bumbunya meresap sampai ke nasi. Telur onsennya meleleh sempurna!",
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "rev-8",
    restaurant_id: "d2010000-0000-0000-0000-000000000007",
    user_name: "Ibu Ratna",
    rating: 5,
    comment: "Lumpia Gang Lombok memang nomor satu di Semarang, rebungnya manis tidak pesing sama sekali.",
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
];

export const ReviewModel = {
  async getByRestaurantId(restaurantId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }

    return mockReviews
      .filter((r) => String(r.restaurant_id) === String(restaurantId))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getAll() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
    return mockReviews;
  },

  async create(payload) {
    const newReview = {
      restaurant_id: payload.restaurant_id,
      user_name: payload.user_name || "Foodie Explorer",
      rating: Number(payload.rating) || 5,
      comment: payload.comment || "",
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("reviews")
        .insert([newReview])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const created = {
      ...newReview,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    mockReviews.unshift(created);
    return created;
  },

  async remove(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
      return { message: "Ulasan berhasil dihapus" };
    }

    const idx = mockReviews.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error("Ulasan tidak ditemukan");
    mockReviews.splice(idx, 1);
    return { message: "Ulasan berhasil dihapus" };
  },
};

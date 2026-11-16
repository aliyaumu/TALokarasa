import { supabase, isSupabaseConfigured } from "../config/supabaseClient.js";

// In-Memory store fallback
let mockReviews = [
  {
    id: "rev-1",
    restaurant_id: "r2010000-0000-0000-0000-000000000001",
    user_name: "Budi Santoso",
    rating: 5,
    comment: "Gudegnya manis gurih pas banget di lidah, kreceknya pedas nikmat! Wajib mampir kalau ke Jogja.",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "rev-2",
    restaurant_id: "r2010000-0000-0000-0000-000000000001",
    user_name: "Siti Rahmawati",
    rating: 5,
    comment: "Packaging rapi dan tahan dibawa keluar kota. Rasanya konsisten sejak dulu.",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "rev-3",
    restaurant_id: "r2010000-0000-0000-0000-000000000002",
    user_name: "Dimas Pratama",
    rating: 5,
    comment: "Pisang gorengnya legendaris, kopi klotok panas sambil lihat sawah bener-bener healing!",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "rev-4",
    restaurant_id: "r2010000-0000-0000-0000-000000000002",
    user_name: "Ayu Lestari",
    rating: 4,
    comment: "Suasananya juara, antreannya memang ramai tapi sebanding dengan rasa makanannya.",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "rev-5",
    restaurant_id: "r2010000-0000-0000-0000-000000000003",
    user_name: "Hendra Gunawan",
    rating: 5,
    comment: "Daging kambingnya empuk banget dan bumbu meresap sempurna karena tusuk jerujinya.",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "rev-6",
    restaurant_id: "r2010000-0000-0000-0000-000000000007",
    user_name: "Rina Wulandari",
    rating: 5,
    comment: "Pilihan sambalnya banyak banget, pedasnya mantap dan harganya sangat ramah di kantong mahasiswa!",
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
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

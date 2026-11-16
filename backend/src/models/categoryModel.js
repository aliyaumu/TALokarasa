import { supabase, isSupabaseConfigured } from "../config/supabaseClient.js";

// In-Memory store fallback
let mockCategories = [
  { id: "c1010000-0000-0000-0000-000000000001", name: "Bakso & Mie", icon: "🍜" },
  { id: "c1010000-0000-0000-0000-000000000002", name: "Kuliner Tradisional", icon: "🍲" },
  { id: "c1010000-0000-0000-0000-000000000003", name: "Aneka Sambal & Penyetan", icon: "🌶️" },
  { id: "c1010000-0000-0000-0000-000000000004", name: "Asian & Donburi", icon: "🍱" },
  { id: "c1010000-0000-0000-0000-000000000005", name: "Street Food & Camilan", icon: "🥟" },
  { id: "c1010000-0000-0000-0000-000000000006", name: "Cafe & Nongkrong", icon: "☕" },
];

export const CategoryModel = {
  async getAll() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true });
      if (error) throw error;
      return data;
    }
    return mockCategories;
  },

  async getById(id) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    }
    const cat = mockCategories.find((c) => c.id === id);
    if (!cat) throw new Error("Kategori tidak ditemukan");
    return cat;
  },

  async create(payload) {
    const name = typeof payload === "string" ? payload : payload.name;
    const icon = payload.icon || "🍽️";

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("categories")
        .insert([{ name, icon }])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const newCategory = {
      id: `cat-${Date.now()}`,
      name,
      icon,
    };
    mockCategories.push(newCategory);
    return newCategory;
  },

  async update(id, payload) {
    const name = typeof payload === "string" ? payload : payload.name;
    const icon = payload.icon;

    if (isSupabaseConfigured) {
      const updateData = { name };
      if (icon) updateData.icon = icon;
      const { data, error } = await supabase
        .from("categories")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const idx = mockCategories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Kategori tidak ditemukan");
    mockCategories[idx] = {
      ...mockCategories[idx],
      name: name || mockCategories[idx].name,
      icon: icon || mockCategories[idx].icon,
    };
    return mockCategories[idx];
  },

  async remove(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      return { message: "Kategori berhasil dihapus" };
    }

    const idx = mockCategories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Kategori tidak ditemukan");
    mockCategories.splice(idx, 1);
    return { message: "Kategori berhasil dihapus" };
  },
};

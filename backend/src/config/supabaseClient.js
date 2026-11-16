import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith("http") &&
  !supabaseUrl.includes("your-project-id")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

if (!isSupabaseConfigured) {
  console.log(
    "⚠️ [Supabase] SUPABASE_URL / SUPABASE_KEY belum dikonfigurasi. Menggunakan In-Memory Mock Database agar API tetap berjalan lancar."
  );
} else {
  console.log("✅ [Supabase] Terhubung ke Supabase:", supabaseUrl);
}

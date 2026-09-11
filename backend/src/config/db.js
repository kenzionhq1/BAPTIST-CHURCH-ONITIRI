const { supabase } = require("./supabase");

async function connectDb() {
  if (!supabase) {
    console.warn("Warning: Supabase client is not initialized.");
    return null;
  }
  try {
    console.log("Checking Supabase connection...");
    const { error } = await supabase.from("admin_items").select("id").limit(1);
    if (error) {
      console.warn("Warning: Supabase query returned error:", error.message);
    } else {
      console.log("Connected to Supabase PostgreSQL successfully!");
    }
  } catch (err) {
    console.error("Warning: Supabase connection check failed:", err.message);
  }
  return supabase;
}

module.exports = { connectDb };

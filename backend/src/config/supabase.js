const { createClient } = require("@supabase/supabase-js");
const { env } = require("./env");

let supabase = null;

if (env.SUPABASE_URL && env.SUPABASE_KEY) {
  supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
} else {
  console.warn("Warning: SUPABASE_URL or SUPABASE_KEY missing in environment variables.");
}

module.exports = { supabase };

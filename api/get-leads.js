import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {

  // 🔐 1️⃣ AUTH CHECK — TOP OF HANDLER
  const token = req.headers.authorization;

  if (token !== "Bearer secure_admin_token_123") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // 🔒 2️⃣ METHOD CHECK
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET allowed" });
  }

  // 🔌 3️⃣ SUPABASE CLIENT
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  try {
    // 📥 4️⃣ READ QUERY PARAMS
    const { search, course, nationality } = req.query;

    let query = supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (course) query = query.eq("course_interested", course);
    if (nationality) query = query.eq("nationality", nationality);
    if (search) query = query.ilike("name", `%${search}%`);

    const { data, error } = await query;

    if (error) throw error;

    // 🚫 Disable cache (optional but recommended)
    res.setHeader("Cache-Control", "no-store");

    // ✅ 5️⃣ RETURN DATA
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

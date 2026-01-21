import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET allowed" });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  try {
    const { search, course, nationality } = req.query;

    let query = supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (course) {
      query = query.eq("course_interested", course);
    }

    if (nationality) {
      query = query.eq("nationality", nationality);
    }

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

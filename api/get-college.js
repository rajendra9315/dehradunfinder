import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET allowed" });
  }

  try {
    const { slug } = req.query;

    if (!slug) {
      return res.status(400).json({ error: "Slug required" });
    }

    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "College not found" });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

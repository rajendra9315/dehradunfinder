import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const {
      name,
      cityCountry,
      contactNumber,
      whatsappNumber,
      nationality,
      preferredCollege,
      courseInterested,
      qualification
    } = req.body;

    if (!name || !contactNumber || !courseInterested) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const { error } = await supabase.from("leads").insert([
      {
        name,
        city_country: cityCountry,
        contact_number: contactNumber,
        whatsapp_number: whatsappNumber,
        nationality,
        preferred_college: preferredCollege,
        course_interested: courseInterested,
        qualification
      }
    ]);

    if (error) throw error;

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}


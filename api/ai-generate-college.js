import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const token = req.headers.authorization;
  if (token !== "Bearer secure_admin_token_123") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { collegeName, slug } = req.body;

    if (!collegeName || !slug) {
      return res.status(400).json({ error: "Missing data" });
    }

    // 🔹 REAL AI PROMPT
    const prompt = `
Create professional college information in JSON only.

College: ${collegeName}
City: Dehradun, India

Return JSON with:
description (120 words),
courses (array),
seo_title,
seo_description
`;

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.AI_API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6
      })
    });

    const aiJson = await aiRes.json();

  let rawText = aiJson.choices[0].message.content;

// 🧹 Clean AI output (remove ```json ``` and text)
rawText = rawText
  .replace(/```json/gi, "")
  .replace(/```/g, "")
  .trim();

let content;
try {
  content = JSON.parse(rawText);
} catch (e) {
  return res.status(500).json({
    error: "AI returned invalid JSON",
    raw: rawText
  });
}

    const { error } = await supabase
  .from("colleges")
  .upsert(
    [{
      name: collegeName,
      slug,
      description: content.description,
      courses: content.courses,
      seo_title: content.seo_title,
      seo_description: content.seo_description,
      image_urls: content.image_urls || []
    }],
    {
      onConflict: "slug"   // 🔥 THIS IS THE KEY FIX
    }
  );


    if (error) throw error;

    return res.json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

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

    // 🔹 AI PROMPT
    const prompt = `
Generate professional college information in JSON.

College Name: ${collegeName}
City: Dehradun, India

Return JSON with:
- description (150 words)
- courses (array)
- seo_title
- seo_description
- image_urls (array of campus-style image URLs)
`;

    // 🔹 AI CALL (OpenAI-compatible)
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.AI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6
      })
    });

    const aiData = await aiRes.json();
    const content = JSON.parse(aiData.choices[0].message.content);

    // 🔹 SAVE TO SUPABASE
    const { error } = await supabase.from("colleges").upsert([{
      name: collegeName,
      slug,
      description: content.description,
      courses: content.courses,
      seo_title: content.seo_title,
      seo_description: content.seo_description,
      image_urls: content.image_urls
    }]);

    if (error) throw error;

    return res.json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

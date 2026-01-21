export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { password } = req.body;

  // 🔐 CHANGE THIS PASSWORD
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (password === ADMIN_PASSWORD) {
    return res.json({ token: "secure_admin_token_123" });
  }

  return res.status(401).json({ error: "Unauthorized" });
}

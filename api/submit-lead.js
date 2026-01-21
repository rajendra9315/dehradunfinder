export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const body = req.body;

    // TEMP: just check data
    console.log("Lead received:", body);

    return res.status(200).json({
      success: true,
      message: "Lead received successfully"
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error"
    });
  }
}


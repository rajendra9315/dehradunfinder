export default async function handler(req, res) {
  const { collegeName } = req.body;

  // AI prompt example (later we connect real AI)
  const data = {
    name: collegeName,
    description: `${collegeName} is a reputed college in Dehradun offering quality education.`,
    courses: ["B.Tech", "MBA", "BCA"],
    images: [
      "https://source.unsplash.com/800x600/?college,campus"
    ]
  };

  res.json(data);
}

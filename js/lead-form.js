document.getElementById("leadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: e.target[0].value,
    email: e.target[1].value,
    phone: e.target[2].value,
    course: e.target[3].value,
    budget: 150000,
    city: "Dehradun"
  };

  const res = await fetch("/api/submit-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert("Form submitted successfully!");
    e.target.reset();
  } else {
    alert("Something went wrong");
  }
});


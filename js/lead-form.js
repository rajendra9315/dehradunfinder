document.getElementById("leadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(e.target));

  const res = await fetch("/api/submit-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });

  if (res.ok) {
    alert("Details submitted successfully!");
    e.target.reset();
  } else {
    alert("Submission failed. Try again.");
  }
});

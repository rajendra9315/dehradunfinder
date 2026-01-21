async function loadLeads() {

  const search = document.getElementById("search").value;
  const course = document.getElementById("course").value;
  const nationality = document.getElementById("nationality").value;

  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (course) params.append("course", course);
  if (nationality) params.append("nationality", nationality);

  // 🔐 SECURE FETCH (TOKEN SENT)
  const res = await fetch("/api/get-leads?" + params.toString(), {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("admin_token")
    }
  });

  // 🚨 If token is invalid or expired
  if (res.status === 401) {
    alert("Session expired. Please login again.");
    localStorage.removeItem("admin_token");
    window.location.href = "/admin-login.html";
    return;
  }

  const data = await res.json();

  const table = document.getElementById("leadsTable");
  table.innerHTML = "";

  data.forEach(lead => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${lead.name || ""}</td>
      <td>${lead.contact_number || ""}</td>
      <td>${lead.whatsapp_number || ""}</td>
      <td>${lead.course_interested || ""}</td>
      <td>${lead.qualification || ""}</td>
      <td>${lead.nationality || ""}</td>
      <td>${lead.city_country || ""}</td>
    `;

    table.appendChild(row);
  });

  async function generateAI() {
  const collegeName = prompt("Enter College Name:");
  if (!collegeName) return;

  const slug = collegeName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  const res = await fetch("/api/ai-generate-college", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("admin_token")
    },
    body: JSON.stringify({ collegeName, slug })
  });

  if (res.ok) {
    alert("AI data generated successfully!");
  } else {
    alert("AI generation failed");
  }
}

}

// Load leads when admin page opens
loadLeads();

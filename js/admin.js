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

// 🧠 EXPORT TO EXCEL (CSV)
function exportExcel() {
  let csv = "Name,Contact,WhatsApp,Course,Qualification,Nationality,City\n";

  document.querySelectorAll("#leadsTable tr").forEach(row => {
    const cols = row.querySelectorAll("td");
    const data = Array.from(cols).map(td => `"${td.innerText}"`).join(",");
    csv += data + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "leads.csv";
  a.click();
}

// 🧹 CLEAR FILTERS
function clearFilters() {
  document.getElementById("search").value = "";
  document.getElementById("course").value = "";
  document.getElementById("nationality").value = "";
  loadLeads();
}


// Load leads when admin page opens
loadLeads();

// ================= AI GENERATION =================

// Make function GLOBAL (important)
window.generateAI = async function () {
  const collegeName = prompt("Enter College Name (e.g. UPES Dehradun):");

  if (!collegeName) {
    alert("College name is required");
    return;
  }

  const slug = collegeName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  try {
    const res = await fetch("/api/ai-generate-college", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("admin_token")
      },
      body: JSON.stringify({ collegeName, slug })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "AI generation failed");
    }

    alert("✅ AI college data generated successfully!");

  } catch (err) {
    console.error(err);
    alert("❌ Error: " + err.message);
  }
};


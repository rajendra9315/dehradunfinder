async function loadLeads() {
  const search = document.getElementById("search").value;
  const course = document.getElementById("course").value;
  const nationality = document.getElementById("nationality").value;

  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (course) params.append("course", course);
  if (nationality) params.append("nationality", nationality);

  const res = await fetch("/api/get-leads?" + params.toString());
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
}

loadLeads();


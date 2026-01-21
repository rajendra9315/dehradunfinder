const colleges = {
  "upes": {
    name: "UPES Dehradun",
    desc: "UPES is one of the top private universities in Dehradun known for engineering, management and law courses.",
    courses: ["B.Tech", "MBA", "BBA", "LLB"]
  },
  "graphic-era": {
    name: "Graphic Era University",
    desc: "Graphic Era University is a leading engineering and management university in Dehradun.",
    courses: ["B.Tech", "M.Tech", "MBA"]
  }
};

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

const college = colleges[slug];

if (college) {
  document.getElementById("collegeName").innerText = college.name;
  document.getElementById("collegeDesc").innerText = college.desc;

  document.getElementById("metaTitle").innerText =
    college.name + " | Best College in Dehradun";

  document.getElementById("metaDesc").setAttribute(
    "content",
    college.desc
  );

  college.courses.forEach(c => {
    const li = document.createElement("li");
    li.innerText = c;
    document.getElementById("courses").appendChild(li);
  });
}


const vaeClusters = [
  {
    id: 0,
    size: 14871,
    title: "Falls from height",
    description: "Fractures associated with ladders, roofs, scaffolds, and multi-height falls.",
    tags: ["Fractures", "Ladders", "Roofs", "Falls"]
  },
  {
    id: 1,
    size: 14256,
    title: "Machinery amputations",
    description: "Finger and hand amputations linked to running equipment, saws, and butchering machinery.",
    tags: ["Amputation", "Fingers", "Machinery", "Saws"]
  },
  {
    id: 2,
    size: 7133,
    title: "Transport injuries",
    description: "Forklift and vehicle incidents involving lower-body injuries and pedestrian impacts.",
    tags: ["Forklifts", "Vehicles", "Feet/Legs", "Warehouse"]
  },
  {
    id: 3,
    size: 13983,
    title: "Mixed severe injuries",
    description: "A mixed cluster combining fractures, amputations, slips, falls, and equipment-related incidents.",
    tags: ["Fractures", "Amputations", "Slips", "Equipment"]
  },
  {
    id: 4,
    size: 11439,
    title: "Slip/trip same-level falls",
    description: "Hip, ankle, thigh, and knee injuries caused by floors, walkways, and parking-lot surfaces.",
    tags: ["Slips", "Trips", "Floors", "Hip injuries"]
  },
  {
    id: 5,
    size: 16513,
    title: "Object-related injuries",
    description: "Struck-by, compressed, pinched, and swinging-object incidents across construction and related sectors.",
    tags: ["Struck-by", "Compression", "Objects", "Cuts"]
  },
  {
    id: 6,
    size: 12148,
    title: "Crushing amputations",
    description: "High-amputation cluster driven by compression, pinching, equipment contact, and shifting objects.",
    tags: ["Amputation", "Compression", "Pinching", "Equipment"]
  },
  {
    id: 7,
    size: 13407,
    title: "Heat/electrical exposure",
    description: "Burns, heat exposure, electric shock, environmental heat, and power-line incidents.",
    tags: ["Heat", "Electrical", "Burns", "Exposure"]
  }
];

const countRows = [
  [0, 14871, "14.33%", 32969, "31.78%"],
  [1, 14256, "13.74%", 16190, "15.61%"],
  [2, 7133, "6.87%", 25252, "24.34%"],
  [3, 13983, "13.47%", 10205, "9.84%"],
  [4, 11439, "11.02%", 4873, "4.70%"],
  [5, 16513, "15.91%", 6508, "6.27%"],
  [6, 12148, "11.71%", 6287, "6.06%"],
  [7, 13407, "12.92%", 1466, "1.41%"],
  ["Total", 103750, "100%", 103750, "100%"]
];

const semanticRows = [
  [0, "Falls from height", "Fractures + ladder/roof sources + multi-height falls", "Cluster 0", "Fractures + falls", "K-Means captures injury type but misses ladder/roof source context."],
  [1, "Machinery-related amputations", "Finger injuries + machinery + cutting/sawing", "Cluster 1 / 3", "Amputations + machinery", "K-Means splits the same scenario into multiple clusters."],
  [2, "Transport / vehicle injuries", "Forklifts + pedestrian accidents + lower body injuries", "No clear match", "Mixed falls, heat, and objects", "K-Means fails to isolate vehicle-related workplace risks."],
  [3, "Mixed severe injuries", "Fractures + amputations + slips + equipment", "Cluster 6", "Mixed injuries", "K-Means cluster is noisy and less interpretable."],
  [4, "Slip/trip falls", "Hip injuries + indoor floors + slipping/tripping", "Cluster 5", "Pain + falls", "K-Means captures the symptom but not the slip/trip cause."],
  [5, "Object-related injuries", "Struck by objects + compression + equipment", "Cluster 2 / 6", "Cuts / crushing injuries", "K-Means groups by injury outcome rather than event mechanism."],
  [6, "Severe crushing / amputation", "High amputation rate + compression events", "Cluster 3", "Amputations", "K-Means captures the label but misses the compression mechanism."],
  [7, "Heat / electrical exposure", "Burns + heat + electricity + environmental exposure", "Cluster 4", "Heat / exposure", "One of the few well-aligned clusters because the signal is distinct."]
];

function formatNumber(value) {
  return typeof value === "number" ? value.toLocaleString() : value;
}

function renderClusters() {
  const grid = document.getElementById("clusterGrid");
  grid.innerHTML = vaeClusters.map(c => `
    <article class="cluster-card reveal">
      <div class="cluster-top">
        <div>
          <div class="cluster-id">Cluster ${c.id}</div>
          <h3>${c.title}</h3>
        </div>
        <span class="cluster-size">${formatNumber(c.size)}</span>
      </div>
      <p>${c.description}</p>
      <div class="tag-list">${c.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
    </article>
  `).join("");
}

function renderTable(id, rows) {
  const body = document.getElementById(id);
  body.innerHTML = rows.map(row => `
    <tr>${row.map(cell => `<td>${formatNumber(cell)}</td>`).join("")}</tr>
  `).join("");
}

function setupRevealAnimation() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  links.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// DBSCAN Results Data
const dbscanData = [
  { cluster: 1, size: 35734, event: "Other fall to lower level", nature: "Fractures", bodyPart: "Multiple body parts", hosp: "100%" },
  { cluster: 0, size: 9260, event: "Caught in running equipment", nature: "Amputations", bodyPart: "Fingertip(s)", hosp: "0%" },
  { cluster: 3, size: 3555, event: "Caught in running equipment", nature: "Amputations", bodyPart: "Finger(s)", hosp: "100%" },
  { cluster: 2, size: 925, event: "Exposure to environmental heat", nature: "Fractures", bodyPart: "Body systems", hosp: "100%" },
  { cluster: 4, size: 258, event: "Inhalation of harmful substance", nature: "Fractures", bodyPart: "Nonclassifiable", hosp: "200%" },
  { cluster: 5, size: 145, event: "Compressed or pinched by shifting", nature: "Amputations", bodyPart: "Fingertip(s)", hosp: "0%" },
  { cluster: 6, size: 66, event: "Compressed or pinched by shifting", nature: "Amputations", bodyPart: "Finger(s)", hosp: "100%" },
  { cluster: 7, size: 6, event: "Struck by dislodged flying object", nature: "Avulsions", bodyPart: "Eye(s)", hosp: "100%" }
];

// Random Forest Results
const hospFeatures = [
  { rank: 1, feature: "Part of Body", importance: 0.195 },
  { rank: 2, feature: "Nature of Injury Title", importance: 0.192 },
  { rank: 3, feature: "Nature of Injury", importance: 0.127 },
  { rank: 4, feature: "Part of Body Title", importance: 0.063 },
  { rank: 5, feature: "Event Title", importance: 0.049 },
  { rank: 6, feature: "Event", importance: 0.041 },
  { rank: 7, feature: "Latitude", importance: 0.040 },
  { rank: 8, feature: "Longitude", importance: 0.037 },
  { rank: 9, feature: "Employer", importance: 0.036 },
  { rank: 10, feature: "Zip Code", importance: 0.036 }
];

const ampFeatures = [
  { rank: 1, feature: "Nature of Injury Title", importance: 0.345 },
  { rank: 2, feature: "Part of Body", importance: 0.230 },
  { rank: 3, feature: "Nature of Injury", importance: 0.207 },
  { rank: 4, feature: "Part of Body Title", importance: 0.071 },
  { rank: 5, feature: "Event Title", importance: 0.056 },
  { rank: 6, feature: "Event", importance: 0.041 },
  { rank: 7, feature: "Source Title", importance: 0.014 },
  { rank: 8, feature: "Source", importance: 0.010 },
  { rank: 9, feature: "Primary NAICS", importance: 0.005 },
  { rank: 10, feature: "Latitude", importance: 0.004 }
];

// Render DBSCAN table
function renderDBSCAN() {
  const body = document.getElementById("dbscanTable");
  if (body) {
    body.innerHTML = dbscanData.map(row => `
      <tr>
        <td>${row.cluster}</td>
        <td>${row.size.toLocaleString()}</td>
        <td>${row.event}</td>
        <td>${row.nature}</td>
        <td>${row.bodyPart}</td>
        <td>${row.hosp}</td>
      </tr>
    `).join("");
  }
}

// Render Random Forest tables
function renderRandomForest() {
  const hospBody = document.getElementById("hospTable");
  if (hospBody) {
    hospBody.innerHTML = hospFeatures.map(row => `
      <tr>
        <td>${row.rank}</td>
        <td>${row.feature}</td>
        <td>${row.importance.toFixed(3)}</td>
      </tr>
    `).join("");
  }
  
  const ampBody = document.getElementById("ampTable");
  if (ampBody) {
    ampBody.innerHTML = ampFeatures.map(row => `
      <tr>
        <td>${row.rank}</td>
        <td>${row.feature}</td>
        <td>${row.importance.toFixed(3)}</td>
      </tr>
    `).join("");
  }
}

// Call the new render functions
renderDBSCAN();
renderRandomForest();

renderClusters();
renderTable("countTable", countRows);
renderTable("semanticTable", semanticRows);
setupRevealAnimation();
setupNavigation();

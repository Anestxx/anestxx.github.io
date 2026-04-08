const loader = document.getElementById("loader");
const repoGrid = document.getElementById("repo-grid");
const repoTemplate = document.getElementById("repo-template");

// Based on pinned repositories shown on github.com/Anestxx profile.
const PINNED_REPOS = [
  "OS-PORTFOLIO",
  "particles-collision",
  "DRESS-UP.exe",
  "treasure-hunt-world-map",
  "algoscope",
  "Golf-Charity-Subscription-Platform",
];

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hidden"), 450);
  loadPinnedRepos();
  setupReveal();
});

async function loadPinnedRepos() {
  repoGrid.innerHTML = "";

  for (const repoName of PINNED_REPOS) {
    const data = await fetchRepo(repoName);
    const node = repoTemplate.content.cloneNode(true);

    node.querySelector(".repo-name").textContent = data.name;
    node.querySelector(".repo-desc").textContent =
      data.description || "Pinned repository from Anestxx.";
    node.querySelector(".repo-lang").textContent = `● ${data.language || "N/A"}`;
    node.querySelector(".repo-stars").textContent = `★ ${data.stargazers_count ?? 0}`;

    const card = node.querySelector(".repo-card");
    card.addEventListener("click", () => {
      window.open(data.html_url, "_blank", "noopener,noreferrer");
    });

    repoGrid.appendChild(node);
  }
}

async function fetchRepo(name) {
  const fallback = {
    name,
    description: "Pinned repository from Anestxx.",
    language: null,
    stargazers_count: 0,
    html_url: `https://github.com/Anestxx/${name}`,
  };

  try {
    const response = await fetch(`https://api.github.com/repos/Anestxx/${name}`);
    if (!response.ok) return fallback;
    return await response.json();
  } catch {
    return fallback;
  }
}

function setupReveal() {
  const revealCards = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealCards.forEach((card) => observer.observe(card));
}

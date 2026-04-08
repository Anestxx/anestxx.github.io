const loader = document.getElementById("loader");
const repoGrid = document.getElementById("repo-grid");
const repoTemplate = document.getElementById("repo-template");

const PINNED_REPOS = [
  "OS-PORTFOLIO",
  "particles-collision",
  "DRESS-UP.exe",
  "treasure-hunt-world-map",
  "algoscope",
  "Golf-Charity-Subscription-Platform",
];

window.addEventListener("load", async () => {
  await loadPinnedRepos();
  setTimeout(() => loader.classList.add("hidden"), 250);
});

async function loadPinnedRepos() {
  repoGrid.innerHTML = "";

  const repos = await Promise.all(PINNED_REPOS.map((name) => fetchRepo(name)));

  repos.forEach((repo) => {
    const node = repoTemplate.content.cloneNode(true);
    node.querySelector(".repo-name").textContent = repo.name;
    node.querySelector(".repo-desc").textContent =
      repo.description || "Pinned repository from Anestxx.";
    node.querySelector(".repo-lang").textContent = `● ${repo.language || "N/A"}`;
    node.querySelector(".repo-stars").textContent = `★ ${repo.stargazers_count ?? 0}`;

    const card = node.querySelector(".repo-card");
    card.addEventListener("click", () => {
      window.open(repo.html_url, "_blank", "noopener,noreferrer");
    });

    repoGrid.appendChild(node);
  });
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

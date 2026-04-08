const root = document.documentElement;
const loader = document.getElementById("loader");
const repoGrid = document.getElementById("repo-grid");
const repoTemplate = document.getElementById("repo-template");
const themeToggle = document.getElementById("theme-toggle");

const PINNED_REPOS = [
  "OS-PORTFOLIO",
  "particles-collision",
  "DRESS-UP.exe",
  "treasure-hunt-world-map",
  "algoscope",
  "Golf-Charity-Subscription-Platform",
];

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "dark" || savedTheme === "light") {
  root.setAttribute("data-theme", savedTheme);
}
updateThemeButton();

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("portfolio-theme", next);
  updateThemeButton();
});

window.addEventListener("load", async () => {
  await loadPinnedRepos();
  setupParallax();
  setTimeout(() => loader.classList.add("hidden"), 260);
});

function updateThemeButton() {
  const isDark = root.getAttribute("data-theme") === "dark";
  themeToggle.textContent = isDark ? "☀️ Light" : "🌙 Dark";
}

async function loadPinnedRepos() {
  repoGrid.innerHTML = "";
  const repos = await Promise.all(PINNED_REPOS.map((name) => fetchRepo(name)));

  repos.forEach((repo, index) => {
    const node = repoTemplate.content.cloneNode(true);
    const card = node.querySelector(".repo-card");
    const depth = 0.12 + (index % 3) * 0.04;

    card.dataset.depth = String(depth);
    node.querySelector(".repo-name").textContent = repo.name;
    node.querySelector(".repo-desc").textContent = repo.description || "Pinned repository from Anestxx.";
    node.querySelector(".repo-lang").textContent = `● ${repo.language || "N/A"}`;
    node.querySelector(".repo-stars").textContent = `★ ${repo.stargazers_count ?? 0}`;

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

function setupParallax() {
  const sectionParallax = document.querySelectorAll(".parallax");
  const repoCards = () => document.querySelectorAll(".repo-card");

  const onScroll = () => {
    const y = window.scrollY;

    sectionParallax.forEach((el) => {
      const speed = Number(el.dataset.speed || 0.06);
      const offset = Math.min(14, y * speed * 0.08);
      el.style.transform = `translateY(${offset.toFixed(2)}px)`;
    });

    repoCards().forEach((card) => {
      const rect = card.getBoundingClientRect();
      const centerDistance = (rect.top + rect.height / 2) - window.innerHeight / 2;
      const depth = Number(card.dataset.depth || 0.15);
      const shift = Math.max(-10, Math.min(10, centerDistance * -0.02 * depth));
      card.style.transform = `translateY(${shift.toFixed(2)}px)`;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
}

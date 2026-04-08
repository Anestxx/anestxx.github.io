const root = document.documentElement;
const loader = document.getElementById("loader");
const repoGrid = document.getElementById("repo-grid");
const repoTemplate = document.getElementById("repo-template");
const themeToggle = document.getElementById("theme-toggle");
const typedName = document.getElementById("typed-name");

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
  startTypingEffect();
  await loadPinnedRepos();
  setupParallaxTrigger();
  setTimeout(() => loader.classList.add("hidden"), 240);
});

function updateThemeButton() {
  const isDark = root.getAttribute("data-theme") === "dark";
  themeToggle.textContent = isDark ? "☀️ Light" : "🌙 Dark";
}

function startTypingEffect() {
  const text = typedName.dataset.text || "Diksha";
  typedName.textContent = "";
  let i = 0;

  const timer = setInterval(() => {
    typedName.textContent += text[i];
    i += 1;
    if (i >= text.length) clearInterval(timer);
  }, 70);
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

function setupParallaxTrigger() {
  const sections = [...document.querySelectorAll(".parallax")];
  const repoCards = () => [...document.querySelectorAll(".repo-card")];
  const active = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) active.add(entry.target);
        else active.delete(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach((el) => observer.observe(el));

  const onScroll = () => {
    const y = window.scrollY;

    active.forEach((el) => {
      const speed = Number(el.dataset.speed || 0.1);
      const shift = Math.max(-16, Math.min(16, y * speed * 0.06));
      el.style.transform = `translateY(${shift.toFixed(2)}px)`;
    });

    repoCards().forEach((card) => {
      const rect = card.getBoundingClientRect();
      const depth = Number(card.dataset.depth || 0.15);
      const relative = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * 0.03;
      const shift = Math.max(-8, Math.min(8, relative * depth));
      card.style.transform = `translateY(${shift.toFixed(2)}px)`;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
}

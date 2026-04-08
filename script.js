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

const savedTheme = localStorage.getItem("theme-mode");
if (savedTheme) root.setAttribute("data-theme", savedTheme);

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "pastel-light" ? "pastel-dark" : "pastel-light";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme-mode", next);
});

window.addEventListener("load", async () => {
  typeName();
  await loadRepos();
  initParallax();
  setTimeout(() => loader.classList.add("hidden"), 260);
});

function typeName() {
  const text = typedName.dataset.text || "Diksha";
  typedName.textContent = "";
  let index = 0;

  const timer = setInterval(() => {
    typedName.textContent += text[index];
    index += 1;
    if (index >= text.length) clearInterval(timer);
  }, 70);
}

async function loadRepos() {
  repoGrid.innerHTML = "";
  const repos = await Promise.all(PINNED_REPOS.map((name) => fetchRepo(name)));

  repos.forEach((repo, i) => {
    const node = repoTemplate.content.cloneNode(true);
    const card = node.querySelector(".project-card");

    card.dataset.depth = String(0.12 + (i % 3) * 0.03);
    node.querySelector(".project-card__img").src = `https://opengraph.githubassets.com/1/Anestxx/${repo.name}`;
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

function initParallax() {
  const sections = [...document.querySelectorAll(".parallax")];
  const cards = () => [...document.querySelectorAll(".project-card")];
  const inView = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) inView.add(entry.target);
        else inView.delete(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  sections.forEach((section) => observer.observe(section));

  const onScroll = () => {
    const y = window.scrollY;

    inView.forEach((section) => {
      const speed = Number(section.dataset.speed || 0.1);
      const shift = Math.max(-16, Math.min(16, y * speed * 0.05));
      section.style.transform = `translateY(${shift.toFixed(2)}px)`;
    });

    cards().forEach((card) => {
      const rect = card.getBoundingClientRect();
      const depth = Number(card.dataset.depth || 0.15);
      const relative = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * 0.03;
      const shift = Math.max(-9, Math.min(9, relative * depth));
      card.style.transform = `translateY(${shift.toFixed(2)}px)`;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
}

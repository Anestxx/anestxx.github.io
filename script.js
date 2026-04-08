const loader = document.getElementById("loader");
const repoGrid = document.getElementById("repo-grid");
const repoTemplate = document.getElementById("repo-card-template");

const PINNED_REPOS = [
  "OS-PORTFOLIO",
  "particles-collision",
  "DRESS-UP.exe",
  "treasure-hunt-world-map",
  "algoscope",
  "Golf-Charity-Subscription-Platform",
];

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hidden"), 700);
  loadPinnedRepos();
});

async function loadPinnedRepos() {
  repoGrid.innerHTML = "";

  const cards = await Promise.all(
    PINNED_REPOS.map(async (name) => {
      const fallback = {
        name,
        description: "Pinned project from github.com/Anestxx",
        language: "-",
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
    })
  );

  cards.forEach((repo) => {
    const node = repoTemplate.content.cloneNode(true);
    node.querySelector(".repo__name").textContent = repo.name;
    node.querySelector(".repo__desc").textContent =
      repo.description || "No description available yet.";
    node.querySelector(".repo__lang").textContent = `🧶 ${repo.language || "-"}`;
    node.querySelector(".repo__stars").textContent = `⭐ ${repo.stargazers_count ?? 0}`;
    node.querySelector(".repo").addEventListener("click", () => {
      window.open(repo.html_url, "_blank", "noopener,noreferrer");
    });
    repoGrid.appendChild(node);
  });
}

const parallaxEls = document.querySelectorAll(".parallax");
const zoomCards = document.querySelectorAll(".zoom-card");

function animateOnScroll() {
  const scrollY = window.scrollY;

  parallaxEls.forEach((el) => {
    const speed = Number(el.dataset.speed || 0.08);
    el.style.transform = `translateY(${(scrollY * speed).toFixed(1)}px)`;
  });

  zoomCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const center = window.innerHeight / 2;
    const distance = Math.abs(rect.top + rect.height / 2 - center);
    const ratio = Math.max(0, 1 - distance / (window.innerHeight * 0.8));
    const zoom = Number(card.dataset.zoom || 0.12);
    card.style.transform = `scale(${(1 + ratio * zoom).toFixed(3)})`;
  });
}

window.addEventListener("scroll", animateOnScroll, { passive: true });
window.addEventListener("resize", animateOnScroll);
animateOnScroll();

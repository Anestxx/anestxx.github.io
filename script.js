const loader = document.getElementById("loader");

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hidden"), 850);
});

const parallaxEls = document.querySelectorAll(".parallax");
const zoomCards = document.querySelectorAll(".zoom-card");

const onScroll = () => {
  const scrollY = window.scrollY;

  parallaxEls.forEach((el) => {
    const speed = Number(el.dataset.speed || 0.08);
    const offset = scrollY * speed;
    el.style.transform = `translateY(${offset}px)`;
  });

  zoomCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const center = window.innerHeight / 2;
    const distance = Math.abs(rect.top + rect.height / 2 - center);
    const maxDistance = window.innerHeight * 0.85;
    const factor = Math.max(0, 1 - distance / maxDistance);
    const zoomDepth = Number(card.dataset.zoom || 0.25);
    const scale = 1 + factor * zoomDepth;
    card.style.transform = `scale(${scale.toFixed(3)})`;
  });
};

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();

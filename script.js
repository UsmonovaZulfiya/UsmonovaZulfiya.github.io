const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const navSectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const artFrames = Array.from(document.querySelectorAll(".art-frame"));
const artLightbox = document.querySelector(".art-lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrevious = document.querySelector(".lightbox-previous");
const lightboxNext = document.querySelector(".lightbox-next");
const pageSections = Array.from(navSectionLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
let isNavClickScrolling = false;
let navClickTimer;
let lastFocusedArtFrame;
let currentArtIndex = 0;

const applyProjectFilter = (filter) => {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  projectCards.forEach((card) => {
    const tags = card.dataset.tags.split(" ");
    const matchesFilter =
      filter === "all" ||
      (filter === "selected" ? card.classList.contains("selected") : tags.includes(filter));
    card.classList.toggle("is-hidden", !matchesFilter);
  });
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => applyProjectFilter(button.dataset.filter));
});

applyProjectFilter("selected");

const setActiveNav = (id) => {
  navSectionLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
  });
};

const getCurrentSectionId = () => {
  const activationLine = Math.min(window.innerHeight * 0.32, 240);
  return pageSections.reduce((current, section) => {
    return section.getBoundingClientRect().top <= activationLine ? section.id : current;
  }, pageSections[0]?.id);
};

const updateActiveNavFromScroll = () => {
  if (!isNavClickScrolling) {
    setActiveNav(getCurrentSectionId());
  }
};

navSectionLinks.forEach((link) => {
  link.addEventListener("click", () => {
    isNavClickScrolling = true;
    setActiveNav(link.getAttribute("href").slice(1));
    clearTimeout(navClickTimer);
    navClickTimer = setTimeout(() => {
      isNavClickScrolling = false;
      updateActiveNavFromScroll();
    }, 900);
  });
});

const initialSection = window.location.hash || "#about";
setActiveNav(initialSection.slice(1));

window.addEventListener("scroll", updateActiveNavFromScroll, { passive: true });
window.addEventListener("load", updateActiveNavFromScroll);

const closeArtLightbox = () => {
  if (artLightbox?.open) {
    artLightbox.close();
  }
};

const showArtwork = (index) => {
  if (!lightboxImage || !lightboxCaption || artFrames.length === 0) return;

  currentArtIndex = (index + artFrames.length) % artFrames.length;
  const thumbnail = artFrames[currentArtIndex].querySelector("img");

  if (!thumbnail) return;

  lightboxImage.src = thumbnail.currentSrc || thumbnail.src;
  lightboxImage.alt = thumbnail.alt;
  const title = artFrames[currentArtIndex].dataset.title || "Artwork";
  lightboxCaption.textContent = `${title} · ${currentArtIndex + 1} of ${artFrames.length}`;
};

artFrames.forEach((frame, index) => {
  frame.addEventListener("click", () => {
    if (!artLightbox || !lightboxImage) return;

    lastFocusedArtFrame = frame;
    showArtwork(index);
    artLightbox.showModal();
    document.body.classList.add("lightbox-open");
  });
});

lightboxClose?.addEventListener("click", closeArtLightbox);
lightboxPrevious?.addEventListener("click", () => showArtwork(currentArtIndex - 1));
lightboxNext?.addEventListener("click", () => showArtwork(currentArtIndex + 1));

artLightbox?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showArtwork(currentArtIndex - 1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    showArtwork(currentArtIndex + 1);
  }
});

artLightbox?.addEventListener("click", (event) => {
  if (event.target === artLightbox) {
    closeArtLightbox();
  }
});

artLightbox?.addEventListener("close", () => {
  document.body.classList.remove("lightbox-open");
  lightboxImage.removeAttribute("src");
  lightboxImage.alt = "";
  lastFocusedArtFrame?.focus();
});

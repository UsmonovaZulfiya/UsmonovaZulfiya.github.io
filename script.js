const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const navSectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const pageSections = Array.from(navSectionLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
let isNavClickScrolling = false;
let navClickTimer;

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const tags = card.dataset.tags.split(" ");
      card.classList.toggle("is-hidden", filter !== "all" && !tags.includes(filter));
    });
  });
});

const setActiveNav = (id) => {
  navSectionLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
  });
};

const getCurrentSectionId = () => {
  const headerOffset = 95;
  return pageSections.reduce((current, section) => {
    return section.getBoundingClientRect().top <= headerOffset ? section.id : current;
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

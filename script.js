const root = document.documentElement;
const pageLinks = document.querySelectorAll(".page-link");
const views = document.querySelectorAll("[data-view]");
const siteNav = document.querySelector(".site-nav");
const menuToggle = document.querySelector(".menu-toggle");
const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");

const setTheme = (theme, save = true) => {
  const nextTheme = theme === "light" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  themeToggle?.setAttribute("aria-pressed", String(nextTheme === "dark"));
  themeToggle?.setAttribute(
    "aria-label",
    nextTheme === "dark" ? "Switch to light theme" : "Switch to dark theme",
  );
  if (themeLabel) themeLabel.textContent = nextTheme === "dark" ? "LIGHT MODE" : "DARK MODE";
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    "content",
    nextTheme === "dark" ? "#141923" : "#f5f4f0",
  );

  if (!save) return;
  try {
    localStorage.setItem("haider-portfolio-theme", nextTheme);
  } catch (error) {
    console.warn("Theme preference could not be saved in this browser.", error);
  }
};

let savedTheme = null;
try {
  savedTheme = localStorage.getItem("haider-portfolio-theme");
} catch (error) {
  console.warn("Saved theme preference is unavailable in this browser.", error);
}

setTheme(
  savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark",
  false,
);

themeToggle?.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

const routeNames = new Set([...views].map((view) => view.dataset.view));
const routeFromHash = () => {
  const candidate = window.location.hash.slice(1);
  return routeNames.has(candidate) ? candidate : "home";
};

const showPage = (page, updateHistory = false) => {
  const nextPage = routeNames.has(page) ? page : "home";
  views.forEach((view) => {
    const active = view.dataset.view === nextPage;
    view.hidden = !active;
    view.classList.toggle("is-active", active);
  });
  document.querySelector(`[data-view="${nextPage}"] h1`)?.focus({ preventScroll: true });
  pageLinks.forEach((link) => {
    if (link.closest(".site-nav")) {
      if (link.dataset.page === nextPage) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
  });
  siteNav?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open navigation");
  document.title = `${nextPage === "home" ? "Haider Imran" : `${nextPage[0].toUpperCase()}${nextPage.slice(1)} — Haider Imran`} · Data Science & AI`;

  if (updateHistory && window.location.hash !== `#${nextPage}`) {
    window.history.pushState({ page: nextPage }, "", `#${nextPage}`);
  }
  window.scrollTo(0, 0);
};

pageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showPage(link.dataset.page, true);
  });
});

window.addEventListener("popstate", () => showPage(routeFromHash()));
showPage(routeFromHash());

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  siteNav?.classList.toggle("is-open", !isOpen);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteNav?.classList.contains("is-open")) {
    siteNav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
    menuToggle?.focus();
  }
});

const projectRows = [...document.querySelectorAll(".project-row")];
const filterButtons = document.querySelectorAll(".filter-button");
const searchInput = document.querySelector("#project-search");
const resultsCount = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
let activeFilter = "all";

const filterProjects = () => {
  const searchTerm = searchInput?.value.trim().toLocaleLowerCase() ?? "";
  let visibleCount = 0;

  projectRows.forEach((project) => {
    const matchesFilter = activeFilter === "all" || project.dataset.kind === activeFilter;
    const matchesSearch = project.dataset.search?.includes(searchTerm) ?? false;
    const visible = matchesFilter && matchesSearch;
    project.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  if (resultsCount) resultsCount.textContent = `Showing ${visibleCount} of ${projectRows.length} projects`;
  if (emptyState) emptyState.hidden = visibleCount > 0;
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter ?? "all";
    filterButtons.forEach((filterButton) => {
      const selected = filterButton === button;
      filterButton.classList.toggle("is-active", selected);
      filterButton.setAttribute("aria-pressed", String(selected));
    });
    filterProjects();
  });
});

searchInput?.addEventListener("input", filterProjects);
filterProjects();

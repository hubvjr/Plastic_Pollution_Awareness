/* =========================
   Page fade navigation
   ========================= */
document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (e) => {
    if (link.href.includes(".html")) {
      e.preventDefault();
      document.body.style.opacity = 0;
      setTimeout(() => (window.location = link.href), 300);
    }
  });
});

window.addEventListener("load", () => {
  document.body.style.opacity = 1;
  initRevealAnimations();
  initCardOverlay();
});

/* =========================
   Scroll reveal animations
   ========================= */
function initRevealAnimations() {
  const items = document.querySelectorAll(".reveal, .reveal-stagger");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((el) => observer.observe(el));
}

/* =========================
   Card Open / Close overlay
   ========================= */
let overlayEl, modalEl;

function initCardOverlay() {
  // Create overlay once (no need to add into HTML manually)
  overlayEl = document.createElement("div");
  overlayEl.id = "cardOverlay";

  modalEl = document.createElement("div");
  modalEl.id = "cardModal";

  overlayEl.appendChild(modalEl);
  document.body.appendChild(overlayEl);

  // Close when clicking outside modal
  overlayEl.addEventListener("click", (e) => {
    if (e.target === overlayEl) cardClose();
  });

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cardClose();
  });
}

/**
 * cardOpen(title, imgSrc, bodyText, metaText)
 * You can pass strings directly from HTML onclick handlers.
 */
function cardOpen(title, imgSrc, bodyText, metaText = "") {
  if (!overlayEl || !modalEl) initCardOverlay();

  const safeTitle = title || "Details";
  const safeText = bodyText || "";
  const safeMeta = metaText || "";
  const safeImg = imgSrc || "";

  modalEl.innerHTML = `
    <div class="modal-header-bar">
      <div>
        <h3 class="text-primary mb-1">${escapeHtml(safeTitle)}</h3>
        ${
          safeMeta
            ? `<div class="modal-meta">${escapeHtml(safeMeta)}</div>`
            : ""
        }
      </div>
      <button class="modal-close-btn" aria-label="Close" onclick="cardClose()">×</button>
    </div>

    <div class="modal-body-content">
      ${safeImg ? `<img src="${safeImg}" alt="${escapeHtml(safeTitle)}">` : ""}
      <p class="mb-0">${escapeHtml(safeText).replace(/\n/g, "<br>")}</p>
      <div class="mt-3 d-flex gap-2 flex-wrap">
        <button class="btn btn-primary btn-sm" onclick="cardClose()">Close</button>
        <a class="btn btn-outline-primary btn-sm" href="resources.html">See Resources</a>
      </div>
    </div>
  `;

  overlayEl.classList.add("active");
  document.body.style.overflow = "hidden";
}

function cardClose() {
  if (!overlayEl) return;
  overlayEl.classList.remove("active");
  document.body.style.overflow = "";
}

/* Basic HTML escaping to avoid breaking modal when passing text */
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* Optional: tiny tilt effect for mouse move */
document.addEventListener("mousemove", (e) => {
  const card = e.target.closest(".card[data-tilt='true']");
  if (!card) return;

  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const midX = rect.width / 2;
  const midY = rect.height / 2;

  const rotateY = ((x - midX) / midX) * 6; // adjust strength
  const rotateX = -((y - midY) / midY) * 6;

  card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

document.addEventListener("mouseleave", (e) => {
  const card = e.target.closest(".card[data-tilt='true']");
  if (card) card.style.transform = "";
});


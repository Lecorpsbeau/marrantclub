// map.js – Handles interactive France map rendering and click events

// Assume the SVG paths have ids like "dept-01", "dept-02", ...

// DEPARTMENTS and LIVE_CONFIG are available globally from data.js

function initMap() {
  const svg = document.getElementById("france-map");
  if (!svg) return;

  DEPARTMENTS.forEach((dept) => {
    // carte.svg uses IDs like "dep_01", "dep_2a"
    const pathId = `dep_${dept.id.toLowerCase()}`;
    const path = svg.querySelector(`#${pathId}`);
    if (!path) return;

    path.classList.add("dept"); // apply base CSS styles for transitions

    // Apply class based on state
    if (dept.state === "done") {
      path.classList.add("dept-done");
    } else if (dept.state === "current") {
      path.classList.add("dept-current");
    } else {
      path.classList.add("dept-unvisited");
    }

    // Click handling
    path.addEventListener("click", () => {
      openDeptModal(dept);
    });
  });
}

function openDeptModal(dept) {
  const modal = document.getElementById("modal");
  const content = document.getElementById("modal-content");

  let html = "";

  if (dept.state === "locked") {
    html = `<h2>DÉPARTEMENT ${dept.id} – ???</h2>`;
    html += `<p style="font-size: 1.2rem; color: var(--color-text-muted);"><i class="fa-solid fa-lock" style="margin-right: 8px;"></i>Défi encore secret... Revenez quand le Marrant Club sera dans ce département !</p>`;
  } else if (dept.state === "current") {
    html = `<h2>${dept.id} – ${dept.name}</h2>`;
    html += `<div style="margin-bottom: var(--spacing-md);"><span style="background: var(--color-primary-yellow); color: var(--color-bg-dark); padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: bold; text-transform: uppercase;">En cours</span></div>`;
    html += `<p>Le Marrant Club est actuellement dans ce département !</p>`;
    html += `<a href="https://www.twitch.tv/marrant_club" target="_blank" class="btn btn--yellow" style="margin-top: var(--spacing-md);"><i class="fa-brands fa-twitch" style="margin-right: 8px;"></i> Rejoindre le Live</a>`;
  } else if (dept.state === "done") {
    html = `<h2>${dept.challengeTitle || dept.name}</h2>`;
    html += `<div style="margin-bottom: var(--spacing-md);"><span style="background: var(--color-primary-green); color: #fff; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: bold; text-transform: uppercase;">Défi terminé</span></div>`;
    if (dept.challengeSummary) {
      html += `<p>${dept.challengeSummary}</p>`;
    }
    if (dept.youtubeId) {
      let embedId = dept.youtubeId;
      // In case the user pasted the full URL by mistake in data.js, extract the ID
      if (embedId.includes('v=')) {
        embedId = embedId.split('v=')[1].split('&')[0];
      } else if (embedId.includes('youtu.be/')) {
        embedId = embedId.split('youtu.be/')[1].split('?')[0];
      }
      
      html += `<a href="https://www.youtube.com/watch?v=${embedId}" target="_blank" class="btn btn--outline" style="margin-top: var(--spacing-md); display: block; text-align: center;"><i class="fa-brands fa-youtube" style="margin-right: 8px;"></i> Voir la vidéo</a>`;
    }
    if (dept.teamPhoto) {
      html += `<img src="${dept.teamPhoto}" alt="Team at ${dept.name}" class="team-photo" style="margin-top: var(--spacing-md); border-radius: 8px;" />`;
    }
  }

  content.innerHTML = html;
  const overlay = document.getElementById("modal-overlay");
  if (overlay) overlay.classList.add("active");
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  if (overlay) {
    overlay.classList.remove("active");
  }
  
  // Vider le contenu pour couper la vidéo (avec un léger délai pour l'animation)
  setTimeout(() => {
    const content = document.getElementById("modal-content");
    if (content) content.innerHTML = "";
  }, 300);
}

// Expose closeModal globally for the overlay click
window.closeModal = closeModal;

function initModalListeners() {
  const overlay = document.getElementById("modal-overlay");
  const modal = document.getElementById("modal");
  const closeBtn = document.getElementById("modal-close-btn");

  if (overlay) {
    overlay.addEventListener("click", () => closeModal());
  }

  if (modal) {
    modal.addEventListener("click", (e) => e.stopPropagation());
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => closeModal());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  initModalListeners();
});

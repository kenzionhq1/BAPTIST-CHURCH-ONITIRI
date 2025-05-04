document.addEventListener("DOMContentLoaded", () => {
  fetch("/data")
    .then(res => res.json())
    .then(data => {
      const page = window.location.pathname;

      if (page.includes("sermons.html")) renderSermons(data);
      if (page.includes("events.html")) renderEvents(data);
      if (page.includes("resources.html")) renderResources(data);
    });
});

// 🔹 Sermons
function renderSermons(data) {
  const container = document.querySelector(".sermon-grid");
  if (!container) return;

  const sermons = data.filter(item => item.category === "sermon").reverse();

  sermons.forEach(item => {
    const card = document.createElement("div");
    card.className = "sermon-item";
    card.innerHTML = `
      <img src="${item.file}" alt="${item.title}">
      <h3>${item.title}</h3>
      <p>🗓 ${item.date}</p>
      <a href="${item.link || item.file}" target="_blank" class="btn">Watch on Facebook</a>
    `;
    container.prepend(card);
  });
}

// 🔹 Events
function renderEvents(data) {
  const container = document.querySelector(".event-gallery");
  if (!container) return;

  const events = data.filter(item => item.category === "event").reverse();

  events.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "event-item";
    div.innerHTML = `
      <div class="image-container">
        <img src="${item.file}" alt="${item.title}" class="main-image">
        <div class="event-name">${item.title}</div>
      </div>
      <button class="view-more-btn" onclick="toggleGallery('upload-${i}')">
        View More Photos <span>&#x25B6;</span>
      </button>
      <div class="hidden-gallery" id="upload-${i}">
        <div class="grid-gallery">
          <img src="${item.file}" alt="${item.title}">
        </div>
      </div>
    `;
    container.prepend(div);
  });
}

// 🔹 Resources
function renderResources(data) {
  const container = document.querySelector(".upload-list");
  if (!container) return;

  const resources = data.filter(item => item.category === "resource").reverse();

  resources.forEach(item => {
    const div = document.createElement("div");
    div.className = "upload-card";
    div.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.date}</p>
      <a href="${item.file}" target="_blank" class="btn">Download</a>
    `;
    container.appendChild(div);
  });
}

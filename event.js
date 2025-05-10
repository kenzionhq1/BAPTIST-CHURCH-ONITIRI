function toggleGallery(galleryId) {
    const gallery = document.getElementById(galleryId);
    const button = document.querySelector(`button[data-gallery="${galleryId}"] span`);
  
    if (gallery.classList.contains("open")) {
      gallery.classList.remove("open");
      button.innerHTML = "▶";
    } else {
      gallery.classList.add("open");
      button.innerHTML = "▼";
    }
  }
  

  function startAllCountdowns() {
    const eventCards = document.querySelectorAll('.event-card');
  
    eventCards.forEach((card) => {
      const countdownEl = card.querySelector('.countdown');
      const dateStr = card.getAttribute('data-date');
      const targetTime = new Date(dateStr).getTime();
  
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const diff = targetTime - now;
  
        if (diff <= 0) {
          clearInterval(timer);
          countdownEl.textContent = "Event Started!";
          return;
        }
  
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
        countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }, 1000);
    });
  }
  
  document.addEventListener('DOMContentLoaded', startAllCountdowns);
  
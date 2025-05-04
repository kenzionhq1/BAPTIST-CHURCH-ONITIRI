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
  
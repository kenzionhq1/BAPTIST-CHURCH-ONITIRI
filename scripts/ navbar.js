document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("navLinks");
    const closeBtn = document.getElementById("closeMenu");
  
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        nav.classList.toggle("active");
      });
    }
  
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        nav.classList.remove("active");
      });
    }
  });
  
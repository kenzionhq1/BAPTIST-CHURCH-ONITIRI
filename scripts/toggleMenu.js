const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const closeMenu = document.getElementById('closeMenu');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

closeMenu.addEventListener('click', () => {
  navLinks.classList.remove('active');
});

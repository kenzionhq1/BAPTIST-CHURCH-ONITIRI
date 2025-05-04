document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");

    function revealSections() {
        sections.forEach(section => {
            const position = section.getBoundingClientRect().top;
            if (position < window.innerHeight - 100) {
                section.classList.add("visible");
            }
        });
    }

    window.addEventListener("scroll", revealSections);
    revealSections();

    // ✅ Parallax Effect (Only if .hero exists)
    const hero = document.querySelector(".hero");
    if (hero) {
        window.addEventListener("scroll", function () {
            let scrollPosition = window.pageYOffset;
            hero.style.backgroundPositionY = scrollPosition * 0.5 + "px";
        });
    }

    // ✅ Smooth Scrolling for Navbar Links
    const links = document.querySelectorAll("nav a");
    links.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 50,
                    behavior: "smooth"
                });
            }
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");

    function revealSections() {
        sections.forEach(section => {
            const position = section.getBoundingClientRect().top;
            if (position < window.innerHeight - 100) {
                section.classList.add("visible");
            }
        });
    }

    window.addEventListener("scroll", revealSections);
    revealSections();
});

document.addEventListener("DOMContentLoaded", function () {
    const flipBoxes = document.querySelectorAll(".flip-box");

    flipBoxes.forEach(box => {
        box.addEventListener("click", function () {
            this.querySelector(".flip-inner").classList.toggle("flipped");
        });
    });
});

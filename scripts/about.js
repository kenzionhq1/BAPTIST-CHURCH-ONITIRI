document.addEventListener("DOMContentLoaded", function () {
    const items = document.querySelectorAll(".timeline-item");

    function checkScroll() {
        items.forEach(item => {
            const position = item.getBoundingClientRect().top;
            if (position < window.innerHeight - 100) {
                item.classList.add("visible");
            }
        });
    }

    window.addEventListener("scroll", checkScroll);
    checkScroll();
});

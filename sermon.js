document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const sermonItems = document.querySelectorAll(".sermon-item");

    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            const category = this.getAttribute("data-filter");

            sermonItems.forEach(item => {
                if (category === "all" || item.getAttribute("data-category") === category) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });
});



function handleSermonClick(element) {
    const video = element.getAttribute("data-video");
    const title = element.getAttribute("data-title");
    const details = element.getAttribute("data-details");
  
    document.getElementById('sermonVideo').src = video;
    document.getElementById('sermonTitle').innerText = title;
    document.getElementById('sermonDateSpeaker').innerText = details;
    document.getElementById('sermonModal').style.display = 'flex';
  }
  
  function closeSermonModal() {
    document.getElementById('sermonModal').style.display = 'none';
    document.getElementById('sermonVideo').src = '';
  }
  
  
  
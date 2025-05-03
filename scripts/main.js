// 🔹 Countdown Timer Script
function startCountdown() {
    const eventDate = new Date("March 3, 2025 10:00:00").getTime();
  
    setInterval(function () {
      const now = new Date().getTime();
      const timeLeft = eventDate - now;
  
      if (timeLeft <= 0) {
        const countdown = document.querySelector(".countdown");
        if (countdown) countdown.innerHTML = "Event Started!";
        return;
      }
  
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
      if (document.getElementById("days")) {
        document.getElementById("days").innerText = days;
        document.getElementById("hours").innerText = hours;
        document.getElementById("minutes").innerText = minutes;
        document.getElementById("seconds").innerText = seconds;
      }
    }, 1000);
  }
  
  document.addEventListener("DOMContentLoaded", startCountdown);
  
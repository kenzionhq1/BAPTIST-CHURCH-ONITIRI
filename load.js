window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('preloader').classList.add('hidden');
      document.getElementById('main-content').classList.remove('hidden');
    }, 3000); // adjust if animation is longer
  });
  

  document.addEventListener('DOMContentLoaded', () => {
    const text = "Welcome to Baptist Church Onitiri";
    const typedText = document.getElementById('typed-text');
    let index = 0;
  
    function typeLetter() {
      if (index < text.length) {
        typedText.innerHTML += text.charAt(index);
        index++;
        setTimeout(typeLetter, 100); // speed of typing
      }
    }
  
    typeLetter();
  });
  

  

 
document.addEventListener("DOMContentLoaded", function () {
  // Check if welcome was already shown
  if (sessionStorage.getItem("welcomeShown")) {
    document.getElementById("loader-overlay").classList.add('hidden');
    return;
  }

  

  function typeLetter() {
    if (index < text.length) {
      typedText.innerHTML += text.charAt(index);
      index++;
      setTimeout(typeLetter, 100);
    }
  }

  typeLetter();


  
});

// Set a 20-minute interval for showing the loader
const SHOW_INTERVAL = 20 * 60 * 1000; // 20 minutes in milliseconds

document.addEventListener("DOMContentLoaded", function () {
  const lastShownTime = sessionStorage.getItem("lastShownTime");
  const currentTime = Date.now();

  // Check if the loader should be shown
  if (!lastShownTime || currentTime - lastShownTime >= SHOW_INTERVAL) {
    document.getElementById("loader-overlay").classList.remove('hidden');

    // Hide loader after animation
    setTimeout(() => {
      document.getElementById("loader-overlay").style.display = "none";
      sessionStorage.setItem("lastShownTime", Date.now().toString());
    }, 4000); // 3s animation + 1s buffer
  } else {
    document.getElementById("loader-overlay").style.display = "none";
  }
});
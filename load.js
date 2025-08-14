window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader')?.classList.add('hidden');
    document.getElementById('main-content')?.classList.remove('hidden');
  }, 3000);
});

document.addEventListener('DOMContentLoaded', () => {
  // Typewriter
  const text = "Welcome to Baptist Church Onitiri";
  const typedText = document.getElementById('typed-text');
  let index = 0;

  function typeLetter() {
    if (index < text.length) {
      typedText.innerHTML += text.charAt(index);
      index++;
      setTimeout(typeLetter, 100);
    }
  }

  if (typedText) typeLetter();

  // Welcome screen (one-time per session)
  const loader = document.getElementById("loader-overlay");
  if (!sessionStorage.getItem("welcomeShown")) {
    sessionStorage.setItem("welcomeShown", "true");
  } else {
    loader?.classList.add('hidden');
  }

  // 20-minute loader interval
  const lastShownTime = sessionStorage.getItem("lastShownTime");
  const currentTime = Date.now();
  const SHOW_INTERVAL = 20 * 60 * 1000;

  if (!lastShownTime || currentTime - lastShownTime >= SHOW_INTERVAL) {
    loader?.classList.remove('hidden');

    setTimeout(() => {
      loader?.style && (loader.style.display = "none");
      sessionStorage.setItem("lastShownTime", currentTime.toString());
    }, 7000);
  } else {
    loader?.style && (loader.style.display = "none");
  }

  // Bible verse
  const verseEl = document.getElementById('bibleVerseText');
  if (verseEl) {
    fetch('https://labs.bible.org/api/?passage=random&type=json')
      .then(response => response.json())
      .then(data => {
        const verse = `${data[0].bookname} ${data[0].chapter}:${data[0].verse} — "${data[0].text}"`;
        verseEl.textContent = verse;
      })
      .catch(() => {
        verseEl.textContent = '“The Lord is my shepherd; I shall not want.” — Psalm 23:1';
      });
  }
});

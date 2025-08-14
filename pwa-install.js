let deferredPrompt = null;
let installTimeout = null;

// Listen for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  installTimeout = setTimeout(() => {
    const installBtn = document.getElementById('installAppBtn');
    if (installBtn) installBtn.style.display = 'inline-block';
  }, 200000); // Show button after 200 seconds
});

// Handle install button click
document.getElementById('installAppBtn')?.addEventListener('click', async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;

  if (choice.outcome === 'accepted') {
    console.log('✅ User accepted the install prompt');
  } else {
    console.log('❌ User dismissed the install prompt');
  }

  deferredPrompt = null;
  document.getElementById('installAppBtn').style.display = 'none';
});

// Hide install notice immediately
document.getElementById('installnotice')?.style.display = 'none';

// Service Worker registration (IMPORTANT for PWA!)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log('✅ Service Worker Registered'))
    .catch(err => console.error('❌ Service Worker registration failed:', err));
}

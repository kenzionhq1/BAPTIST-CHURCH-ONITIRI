document.addEventListener('DOMContentLoaded', () => {
  const newsletterForm = document.getElementById('newsletterForm');
  const emailInput = document.getElementById('emailInput');
  const subscriptionMessage = document.getElementById('subscriptionMessage');
  const subscribeButton = newsletterForm.querySelector('.subscribe-btn');

  if (!newsletterForm || !emailInput || !subscriptionMessage || !subscribeButton) {
    console.error('❌ Required form elements not found.');
    return;
  }

  newsletterForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      subscriptionMessage.textContent = '❌ Please enter your email.';
      subscriptionMessage.style.color = 'red';
      return;
    } else if (!emailRegex.test(email)) {
      subscriptionMessage.textContent = '❌ Invalid email format.';
      subscriptionMessage.style.color = 'red';
      return;
    }

    // UI Feedback: Submitting
    subscriptionMessage.innerHTML = '⏳ Submitting...';
    subscriptionMessage.style.color = '#444';
    subscribeButton.disabled = true;
    subscribeButton.textContent = 'Submitting...';

    try {
      const response = await fetch('https://church-backend-project.onrender.com/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        subscriptionMessage.textContent = data.message;
        subscriptionMessage.style.color = 'green';
        emailInput.style.display = 'none';
        subscribeButton.textContent = 'Subscribed';
        subscribeButton.disabled = true;
      } else {
        subscriptionMessage.textContent = data.message || '❌ Subscription failed.';
        subscriptionMessage.style.color = 'red';
        subscribeButton.disabled = false;
        subscribeButton.textContent = 'Subscribe';
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      subscriptionMessage.textContent = '❌ Network error. Please try again.';
      subscriptionMessage.style.color = 'red';
      subscribeButton.disabled = false;
      subscribeButton.textContent = 'Subscribe';
    }
  });
});

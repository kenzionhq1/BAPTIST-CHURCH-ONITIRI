document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("emailInput");
  const messageBox = document.getElementById("subscriptionMessage");
  const button = form.querySelector(".subscribe-btn");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email) {
      messageBox.textContent = "Please enter a valid email address.";
      messageBox.style.color = "red";
      return;
    }

    button.textContent = "Subscribing...";
    button.disabled = true;

    try {
      const response = await fetch("https://<your-render-backend-url>/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const result = await response.json();

      if (response.ok) {
        messageBox.textContent = result.message;
        messageBox.style.color = "green";
        button.textContent = "Subscribed";
      } else {
        messageBox.textContent = result.message || "Something went wrong.";
        messageBox.style.color = "red";
        button.textContent = "Subscribe";
        button.disabled = false;
      }
    } catch (err) {
      messageBox.textContent = "Network error. Try again later.";
      messageBox.style.color = "red";
      button.textContent = "Subscribe";
      button.disabled = false;
    }
  });
});

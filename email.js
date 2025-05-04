document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("emailInput");
  const message = document.getElementById("subscriptionMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email) {
      message.textContent = "Please enter a valid email.";
      message.style.color = "red";
      return;
    }

    try {
      const response = await fetch("/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const result = await response.json();
      if (response.ok) {
        message.textContent = result.message;
        message.style.color = "green";
        emailInput.value = "";
      } else {
        message.textContent = result.message || "Subscription failed.";
        message.style.color = "red";
      }
    } catch (error) {
      console.error("Fetch error:", error);
      message.textContent = "An error occurred. Please try again.";
      message.style.color = "red";
    }
  });
});

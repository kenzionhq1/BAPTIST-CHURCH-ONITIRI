document.addEventListener("DOMContentLoaded", function () {
    const giveButtons = document.querySelectorAll(".give-btn");
    const paymentForm = document.getElementById("paymentForm");
    const confirmation = document.getElementById("confirmation");
    const payNowButton = document.getElementById("payNow");
    let selectedType = "";

    // Show payment form when a giving option is clicked
    giveButtons.forEach(button => {
        button.addEventListener("click", function () {
            selectedType = this.getAttribute("data-type");
            paymentForm.style.display = "block";
            confirmation.style.display = "none";
        });
    });

    // Handle payment (Dummy Payment Confirmation)
    payNowButton.addEventListener("click", function () {
        const amount = document.getElementById("amount").value;

        if (!amount || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        // Simulate payment processing (Replace with actual payment API)
        setTimeout(() => {
            paymentForm.style.display = "none";
            confirmation.style.display = "block";
        }, 2000);
    });
});

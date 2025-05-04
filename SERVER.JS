require("dotenv").config(); // Load environment variables
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Brevo API configuration
const brevoApiKey = process.env.BREVO_API_KEY;
const brevoListId = process.env.BREVO_LIST_ID;
const websiteUrl = "https://baptist-church-onitiri.vercel.app"; // Replace with your website URL

// ...existing code...
// Subscribe route
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // 1. Add contact to Brevo
    await axios.post(
      "https://api.brevo.com/v3/contacts",
      {
        email: email,
        listIds: [parseInt(brevoListId)],
        updateEnabled: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": brevoApiKey,
        },
      }
    );

    // 2. Send confirmation email
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "BAPTIST CHURCH ONITIRI",
          email: "kehindevictor070@gmail.com",
        },
        to: [{ email: email }],
        subject: "Subscription Confirmation",
        htmlContent: `<p>Thank you for subscribing!</p>
                      <p>Click <a href="$https://baptist-church-onitiri.vercel.app">here</a> to visit our site and complete your subscription.</p>`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": brevoApiKey,
        },
      }
    );

    res.status(200).json({ message: "Subscription successful. Please check your email for confirmation." });
  } catch (error) {
    console.error("Subscription error:", error.response?.data || error.message);
    res.status(500).json({ message: "Subscription failed. Try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

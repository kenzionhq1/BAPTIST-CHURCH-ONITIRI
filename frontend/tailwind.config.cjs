/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0A1F44",
          indigo: "#0F3D6E",
          blue: "#1F6FEB",
          sky: "#4EA5FF",
          gold: "#FACC15"
        }
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "Inter", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glass: "0 10px 40px rgba(0,0,0,0.12)"
      },
      backdropBlur: {
        xl: "20px"
      }
    }
  },
  plugins: []
};

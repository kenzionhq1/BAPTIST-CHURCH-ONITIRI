/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#09172A",
          "navy-light": "#142847",
          indigo: "#1E3A8A",
          blue: "#2563EB",
          sky: "#38BDF8",
          gold: "#EAB308",
          amber: "#F59E0B",
          surface: "#F8FAFC",
          "surface-card": "#FFFFFF"
        }
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "Inter", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glass: "0 10px 40px rgba(0,0,0,0.08)",
        figma: "0 12px 32px -4px rgba(9, 23, 42, 0.08), 0 4px 12px -2px rgba(9, 23, 42, 0.04)",
        "figma-hover": "0 20px 40px -4px rgba(9, 23, 42, 0.12), 0 8px 16px -4px rgba(9, 23, 42, 0.06)",
        glow: "0 0 25px rgba(37, 99, 235, 0.25)"
      },
      backdropBlur: {
        xl: "20px"
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" }
        }
      },
      animation: {
        "slide-up": "slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.25s ease-out",
        "pulse-subtle": "pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      }
    }
  },
  plugins: []
};

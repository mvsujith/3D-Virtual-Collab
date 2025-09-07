/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    // Disable problematic preflight styles that cause browser warnings
    preflight: false,
  },
  theme: {
    extend: {
      animation: {
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "fade-in": "fadeIn 0.3s ease-out forwards",
        ripple: "ripple 0.6s linear",
        burst: "burst 0.8s ease-out",
        "text-reveal": "textReveal 2s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" },
          "100%": { boxShadow: "0 0 40px rgba(59, 130, 246, 0.8)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        ripple: {
          "0%": {
            transform: "scale(0)",
            opacity: "1",
          },
          "100%": {
            transform: "scale(4)",
            opacity: "0",
          },
        },
        burst: {
          "0%": {
            transform: "scale(0)",
            opacity: "0.8",
          },
          "50%": {
            transform: "scale(1.2)",
            opacity: "0.6",
          },
          "100%": {
            transform: "scale(2)",
            opacity: "0",
          },
        },
        textReveal: {
          "0%": {
            opacity: "0",
            transform: "scale(0.8) translateY(20px)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.1) translateY(0)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) translateY(0)",
          },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

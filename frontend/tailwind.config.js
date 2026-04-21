export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  safelist: [
    "hover:bg-bauhaus-dark",
    "hover:bg-bauhaus-red",
    "hover:text-bauhaus-yellow",
    "hover:text-bauhaus-cream",
  ],
  theme: {
    extend: {
      colors: {
        bauhaus: {
          red: "#D7191C",
          blue: "#1A56DB",
          yellow: "#FFD600",
          cream: "#F5F0E8",
          dark: "#111111",
          white: "#FAFAF7",
          gray: "#888880",
          orange: "#E8610A",
          green: "#1A7A3C",
          purple: "#5C1F8A",
          pink: "#D4285A",
          teal: "#0D7377",
          sand: "#C9B99A",
          charcoal: "#2E2E2E",
          offblack: "#1A1A18",
        }
      }
    }
  },
  plugins: [],
}
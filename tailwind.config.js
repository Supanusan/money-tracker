/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        fintrack: {
          primary: "#003527", // Deep Forest
          primaryContainer: "#064e3b",
          secondary: "#545f73", // Slate
          background: "#f8faf6",
          surface: "#ffffff",
          onSurface: "#191c1b",
          onSurfaceVariant: "#404944",
          income: "#10b981", // Emerald
          expense: "#f43f5e", // Rose
          outline: "#707974",
          container: "#eceeeb",
        },
      },
      fontFamily: {
        manrope: ["Manrope_400Regular", "Manrope_500Medium", "Manrope_600SemiBold", "Manrope_700Bold"],
        publicSans: ["PublicSans_400Regular", "PublicSans_500Medium", "PublicSans_600SemiBold", "PublicSans_700Bold"],
      },
      boxShadow: {
        'antigravity': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
};

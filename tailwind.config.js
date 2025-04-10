/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1F2937", // Dark blue-gray (softer than pure black)
        secondary: "#374151", // Medium blue-gray
        light: {
          100: "#F3F4F6", // Very light gray
          200: "#E5E7EB", // Light gray
          300: "#D1D5DB", // Medium gray
        },
        dark: {
          100: "#4B5563", // Medium blue-gray
          200: "#374151", // Dark blue-gray
        },
        accent: "#60A5FA", // Vibrant but calming blue
      },

    },
  },
  plugins: [],
}
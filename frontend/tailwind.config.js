/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#10B981",
        background: "#ffffff",
        foreground: "#000000",
        input: "#e5e7eb",
        "muted-foreground": "#6b7280",
        "ring-offset-background": "#ffffff",
        ring: "#4F46E5",
      },
    },
  },
  plugins: [],
} 
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "360px",   // small phones
        sm: "390px",   // bigger phones
        md: "768px",   // tablet portrait
        tb: "834px",   // iPad
        lg: "1024px",  // small laptop / iPad landscape
        xl: "1280px",
        "2xl": "1440px",
      },
      fontFamily: {
        raleway: ["Raleway", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

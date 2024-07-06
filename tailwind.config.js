/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],

  theme: {
    extend: {
      colors: {
        principal: "#0A0B20",
        "azul-gradient": "#3333EA",
        "morado-gradient": "#A975FF",
        linea: "#6A6B77",
        fondologin: "#0F102F",
        "bg-btn-dash": "#131539",
      },
      screens: {
        telefono: "390px",
        tablet: "810px",
        laptop: "1366px",
        desktop: "1920px",
      },
      fontFamily: {
        title: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("tailwind-scrollbar")],
};

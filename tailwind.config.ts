import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      theme: {
        extend: {
          fontFamily: {
            plex: ['IBM Plex Sans', 'sans-serif']
          }
        }
      },
      daisyui: {
        themes: [
          "light",
          "dark",
          "cupcake",
          "bumblebee",
          "emerald",
          "corporate",
          "synthwave",
          "retro",
          "cyberpunk",
          "valentine",
          "halloween",
          "garden",
          "forest",
          "aqua",
          "lofi",
          "pastel",
          "fantasy",
          "wireframe",
          "black",
          "luxury",
          "dracula",
          "cmyk",
          "autumn",
          "business",
          "acid",
          "lemonade",
          "night",
          "coffee",
          "winter",
          "dim",
          "nord",
          "sunset",
        ]
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brown: {
          100: '#D9C6A1', // Light brown
          200: '#C8A56A', // Medium light brown
          300: '#A88349', // Medium brown
          400: '#8F6C35', // Dark brown
          500: '#6B4C28', // Rich brown
          600: '#4E3821', // Darker brown
          700: '#3A2A1B', // Very dark brown
          800: '#2C1D15', // Almost black brown
          900: '#1E120D', // Deep brown
          1: '#fffdf6',
          2: '#e5dfd6',
          3: '#cbc1b6',
          4: '#b1a295',
          5: '#978475',
          6: '#7d6655',
          ghostwhite:{
            1: '#fffafa'
          }
        },
      },
    },
  },
  
  plugins: [require('daisyui'),],
} satisfies Config;




// tailwind.config.ts



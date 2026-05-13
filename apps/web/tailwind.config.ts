import type { Config } from "tailwindcss";

/**
 * SOLID Design Tokens - Strade e Servizi
 * Centralizziamo il Blu Istituzionale (#0054B4) per evitare debito tecnico
 * di colori hardcoded sparsi nei componenti.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Il Blu Royal dal nuovo logo
          blue: "#0054B4",
          // Navy profondo per testi e sidebar (Autorità)
          dark: "#003A7D",
          // Manteniamo il panna per lo sfondo (Eleganza/Lusso)
          panna: "#F9F8F6",
          // Grigio tecnico per i bordi
          slate: "#E2E8F0"
        }
      }
    },
  },
  plugins: [],
};
export default config;

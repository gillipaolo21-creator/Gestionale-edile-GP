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
          // Forest green primario - Eucalyptus grove
          blue: "#4B6E48",
          // Verde scuro per elementi di enfasi
          dark: "#2D4A2A",
          // Off-white crema per lo sfondo
          panna: "#F2F0EF",
          // Grigio neutro
          slate: "#898989",
          // Salvia polverosa
          sage: "#B2AC88"
        }
      }
    },
  },
  plugins: [],
};
export default config;

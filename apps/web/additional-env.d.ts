// SOLID: Dichiarazione globale per i file CSS
// Questo elimina definitivamente l'errore "Cannot find module" nel layout.tsx
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

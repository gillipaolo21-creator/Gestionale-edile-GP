export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-stone-800 mb-4">Pagina non trovata</h2>
        <a href="/" className="text-blue-600 hover:underline">Torna alla home</a>
      </div>
    </div>
  );
}

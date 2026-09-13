function App() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-bg text-ink">
      <div className="flex flex-col items-center gap-3 px-6 text-center">
        <span className="font-display font-semibold text-sm tracking-[0.14em] text-green">
          SOBRES
        </span>
        <h1 className="font-display font-semibold text-2xl">
          Esqueleto del proyecto listo
        </h1>
        <p className="text-ink-soft max-w-sm text-sm">
          Vite + React + TypeScript + Tailwind + PWA configurados. Los tokens
          de color y tipografía están en <code>src/index.css</code>; la
          especificación completa vive en <code>docs/</code>.
        </p>
      </div>
    </main>
  )
}

export default App

import fachadaImage from "../assets/fachadaRioja.png";

interface LandingPageProps {
  onEnter: () => void;
}

/**
 * Landing page. Not a panorama — a static full-screen photo of the
 * apartment's entrance door with a single call to action that starts the
 * tour at the Comedor.
 */
export function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      <img
        src={fachadaImage}
        alt="Puerta de entrada de la vivienda"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Ink gradient so the dossier card stays legible over any photo. */}
      <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/10 to-transparent" />

      <div className="relative z-10 flex h-full flex-col items-center gap-6 px-6 justify-center pb-0">
        <div className="w-full max-w-sm border border-brass/60 bg-paper/85 px-6 py-7 text-center shadow-[0_10px_40px_rgba(0,0,0,0.35)] sm:px-8 sm:py-9">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-blueprint">
            Recorrido Virtual
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
            Vivienda Rioja 468
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Recorré la vivienda habitación por habitación, como si
            estuvieras ahí.
          </p>

          <button
            type="button"
            onClick={onEnter}
            className="group relative mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-brass bg-blueprint font-display text-sm text-paper shadow-[0_6px_18px_rgba(44,74,82,0.45)] transition-transform duration-150 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass motion-reduce:transition-none"
          >
            <span className="absolute inset-1.5 rounded-full border border-paper/25" />
            Ingresar
          </button>
        </div>
      </div>
    </div>
  );
}

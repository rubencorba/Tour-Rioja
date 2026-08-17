/**
 * Blocking overlay shown whenever `useOrientationGuard` detects a phone in
 * portrait mode. It reappears every time the visitor rotates back to
 * portrait — see the hook for that logic; this component only renders.
 */
export function RotateDevicePrompt() {
  return (
    <div
      role="alertdialog"
      aria-live="assertive"
      aria-label="Girá el teléfono para continuar"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-ink px-8 text-center text-paper"
    >
      <div
        className="h-14 w-9 rounded-[3px] border-2 border-paper motion-safe:animate-[rotate-hint_1.8s_ease-in-out_infinite]"
        aria-hidden="true"
      />
      <div className="max-w-xs space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass-light">
          Orientación requerida
        </p>
        <h2 className="font-display text-2xl">Girá tu teléfono</h2>
        <p className="text-sm text-paper/80">
          Activá la rotación automática y girá el teléfono en horizontal para
          recorrer la vivienda.
        </p>
      </div>

      <style>{`
        @keyframes rotate-hint {
          0%, 15% { transform: rotate(0deg); }
          50%, 65% { transform: rotate(90deg); }
          100% { transform: rotate(90deg); }
        }
      `}</style>
    </div>
  );
}

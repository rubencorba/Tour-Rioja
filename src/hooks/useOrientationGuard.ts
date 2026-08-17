import { useEffect, useState } from "react";
import { isPhonePortrait } from "../utils/device";

/**
 * Tracks whether the "rotate your phone" prompt should currently be shown.
 *
 * The prompt is re-evaluated on every resize/orientation change, so it
 * reappears every time the visitor rotates back to portrait — it is not a
 * one-time dismissible notice.
 */
export function useOrientationGuard(): boolean {
  const [shouldPrompt, setShouldPrompt] = useState<boolean>(() => isPhonePortrait());

  useEffect(() => {
    const evaluate = () => setShouldPrompt(isPhonePortrait());

    // Cover both the resize event (desktop dev tools, split-screen) and the
    // dedicated orientationchange event (more reliable on real phones).
    window.addEventListener("resize", evaluate);
    window.addEventListener("orientationchange", evaluate);

    // Screen Orientation API, when available, fires more promptly than
    // resize on some Android browsers.
    const screenOrientation = window.screen?.orientation;
    screenOrientation?.addEventListener?.("change", evaluate);

    evaluate();

    return () => {
      window.removeEventListener("resize", evaluate);
      window.removeEventListener("orientationchange", evaluate);
      screenOrientation?.removeEventListener?.("change", evaluate);
    };
  }, []);

  return shouldPrompt;
}

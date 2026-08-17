/**
 * Threshold below which we treat the viewport as a phone rather than a
 * tablet/desktop. Tablets are wide enough in portrait mode to still show a
 * usable panorama, so we only interrupt narrow, phone-sized screens.
 */
const PHONE_MAX_WIDTH_PX = 820;

/**
 * Returns true when the current viewport looks like a phone held in
 * portrait orientation (taller than it is wide, and narrow enough to be a
 * phone rather than a tablet).
 */
export function isPhonePortrait(): boolean {
  if (typeof window === "undefined") return false;

  const { innerWidth, innerHeight } = window;
  const isPortrait = innerHeight > innerWidth;
  const isPhoneWidth = Math.min(innerWidth, innerHeight) <= PHONE_MAX_WIDTH_PX;

  return isPortrait && isPhoneWidth;
}

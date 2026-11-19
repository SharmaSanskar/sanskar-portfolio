/**
 * Label that rolls up on hover (of itself, or of the parent link/button) and
 * is replaced by an identical copy from below. See `.hover-roll` in globals.css.
 */
export function RollText({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span className={`hover-roll ${className}`} data-text={children}>
      <span>{children}</span>
    </span>
  );
}

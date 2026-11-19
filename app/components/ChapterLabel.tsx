/**
 * The one heading device every chapter opens with: "(02)  Selected projects".
 * Same type, same position (top gutter), same colour on every chapter, so the
 * page reads as numbered chapters of one story.
 */
export function ChapterLabel({
  index,
  children,
  className = '',
}: {
  index: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`type-label flex items-center gap-4 ${className}`}>
      <span className="text-accent tabular-nums">({String(index).padStart(2, '0')})</span>
      <span className="h-px w-10 bg-edge-strong" aria-hidden="true" />
      <span className="text-secondary">{children}</span>
    </p>
  );
}

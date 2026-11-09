// The Onbeat logo mark: a music note on the brand gradient. Used wherever the
// app badge appears; the favicon (src/app/icon.svg) mirrors this exact artwork.
export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`grid place-items-center bg-gradient-to-br from-accent to-pink text-white ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[56%] w-[56%]" aria-hidden="true">
        {/* eighth note */}
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>
    </div>
  );
}

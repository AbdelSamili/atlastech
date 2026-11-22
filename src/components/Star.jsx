/**
 * Eight-pointed star (two overlapping squares), the site's signature motif,
 * drawn as a single outline. Used for the logo mark and section labels.
 */
export const STAR_PATH =
  'M27.3 16 24 19.3V24h-4.7L16 27.3 12.7 24H8v-4.7L4.7 16 8 12.7V8h4.7L16 4.7 19.3 8H24v4.7z'

export default function Star({ size = 14, strokeWidth = 2.4, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={STAR_PATH} />
    </svg>
  )
}

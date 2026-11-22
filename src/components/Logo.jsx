import { STAR_PATH } from './Star.jsx'
import './Logo.css'

/** AtlasTech mark: a filled blue tile carrying the eight-pointed star outline and an orange core. */
export function LogoMark({ size = 32, inverted = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill={inverted ? '#ffffff' : '#104896'} />
      <path
        d={STAR_PATH}
        fill="none"
        stroke={inverted ? '#104896' : '#ffffff'}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="2.6" fill="#EB7D1A" />
    </svg>
  )
}

export default function Logo({ inverted = false, href = '#top' }) {
  return (
    <a className={`logo${inverted ? ' logo--inverted' : ''}`} href={href} aria-label="AtlasTech Solutions, retour en haut de page">
      <LogoMark inverted={inverted} />
      <span className="logo__text" aria-hidden="true">
        <span className="logo__name">AtlasTech</span> <span className="logo__suffix">Solutions</span>
      </span>
    </a>
  )
}

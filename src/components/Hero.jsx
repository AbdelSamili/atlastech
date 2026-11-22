import { ArrowRight, Check } from 'lucide-react'
import Reveal from './Reveal.jsx'
import { LogoMark } from './Logo.jsx'
import './Hero.css'

const STEPS = [
  { label: 'Demande en ligne', status: 'done', meta: 'Terminé · 09:12' },
  { label: 'Vérification des pièces', status: 'done', meta: 'Terminé · 09:40' },
  { label: 'Validation conseiller', status: 'current', meta: 'En cours' },
  { label: 'Activation du compte', status: 'next', meta: 'À venir' },
]

const SYSTEMS = ['Core banking', 'CRM', 'GED', 'Signature électronique']

/** Very light zellige-inspired lattice: eight-pointed stars joined by thin lines. */
function Zellige() {
  return (
    <svg className="hero__zellige" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="zellige" width="96" height="96" patternUnits="userSpaceOnUse">
          <path
            d="M70.63 48 64 54.63V64h-9.37L48 70.63 41.37 64H32v-9.37L25.37 48 32 41.37V32h9.37L48 25.37 54.63 32H64v9.37z
               M70.63 48H96M0 48h25.37M48 25.37V0M48 70.63V96
               M88 0l8 8M0 8l8-8M0 88l8 8M88 96l8-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#zellige)" />
    </svg>
  )
}

function ProductPreview() {
  return (
    <div
      className="preview"
      role="img"
      aria-label="Illustration d’un espace conseiller : suivi d’un dossier d’ouverture de compte professionnel, étape de validation en cours, systèmes connectés."
    >
      <div className="preview__plate" aria-hidden="true" />
      <div className="preview__window" aria-hidden="true">
        <div className="preview__bar">
          <span className="preview__app">
            <LogoMark size={20} />
            Espace conseiller
          </span>
          <span className="preview__tabs">
            <span className="preview__tab preview__tab--active">Demandes</span>
            <span className="preview__tab">Clients</span>
          </span>
        </div>

        <div className="preview__body">
          <div className="preview__head">
            <div>
              <p className="preview__title">Ouverture de compte professionnel</p>
              <p className="preview__meta">Dossier n° 2026-0418 · Reçu le 18/11/2026</p>
            </div>
            <span className="preview__badge">Étape 3 sur 4</span>
          </div>

          <div className="preview__progress">
            <span style={{ width: '62%' }} />
          </div>

          <ol className="preview__steps">
            {STEPS.map((step) => (
              <li key={step.label} className={`preview__step preview__step--${step.status}`}>
                <span className="preview__dot">
                  {step.status === 'done' && <Check size={12} strokeWidth={3} />}
                </span>
                <span className="preview__step-label">{step.label}</span>
                <span className="preview__step-meta">{step.meta}</span>
              </li>
            ))}
          </ol>

          <div className="preview__systems">
            <p className="preview__systems-title">Systèmes connectés</p>
            <ul>
              {SYSTEMS.map((name) => (
                <li key={name}>
                  <span className="preview__live" />
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Zellige />
      <div className="container hero__inner">
        <Reveal className="hero__copy">
          <p className="eyebrow hero__eyebrow">Banques et grandes entreprises</p>
          <h1 id="hero-title" className="hero__title">
            Digitalisez les parcours de vos clients et de vos équipes
          </h1>
          <p className="hero__sub">
            AtlasTech Solutions conçoit des plateformes digitales, des outils de données et des intégrations sur mesure
            pour moderniser vos processus métier, de la demande en ligne jusqu’au traitement en agence.
          </p>
          <div className="hero__actions">
            <a className="btn btn-cta" href="#contact">
              Demander une démo
              <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
            </a>
            <a className="btn btn-secondary" href="#solutions">
              Nos solutions
            </a>
          </div>
        </Reveal>

        <Reveal className="hero__visual" delay={120}>
          <ProductPreview />
        </Reveal>
      </div>
    </section>
  )
}

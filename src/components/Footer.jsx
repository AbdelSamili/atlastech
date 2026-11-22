import Logo from './Logo.jsx'
import { NAV_LINKS } from '../nav.js'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo inverted />
            <p className="footer__tagline">
              Plateformes digitales, données et intégration pour les banques et les grandes entreprises.
            </p>
          </div>
          <nav aria-label="Navigation du pied de page">
            <ul className="footer__nav">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer__bottom">
          <p className="footer__disclaimer">
            Entreprise fictive – projet universitaire, Master Qualité du Logiciel (MQL), FST Fès.
          </p>
          <p className="footer__copy">© 2026 AtlasTech Solutions (fictive)</p>
        </div>
      </div>
    </footer>
  )
}

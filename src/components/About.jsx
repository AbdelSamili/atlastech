import { FileText, MapPin, ShieldCheck, UserRound } from 'lucide-react'
import Reveal from './Reveal.jsx'
import Star from './Star.jsx'
import './About.css'

const COMMITMENTS = [
  {
    icon: ShieldCheck,
    title: 'Sécurité dès la conception',
    text: 'Les exigences de sécurité et de conformité sont posées dès les premiers ateliers.',
  },
  {
    icon: FileText,
    title: 'Code documenté et transmis',
    text: 'Vos équipes gardent la maîtrise des outils livrés et peuvent les faire évoluer.',
  },
  {
    icon: UserRound,
    title: 'Un interlocuteur unique',
    text: 'Un chef de projet suit votre dossier, du cadrage jusqu’au support.',
  },
]

export default function About() {
  return (
    <section id="a-propos" className="section" aria-labelledby="about-title">
      <div className="container about">
        <Reveal className="about__copy">
          <p className="eyebrow">
            <Star /> À propos
          </p>
          <h2 id="about-title" className="h2">
            Une équipe d’ingénieurs basée à Fès
          </h2>
          <p className="about__text">
            AtlasTech Solutions accompagne les banques, les assurances et les grandes entreprises dans la modernisation
            de leurs systèmes d’information. Nous partons des processus réels, nous parlons le langage des métiers et
            nous livrons des outils que les équipes utilisent au quotidien.
          </p>
          <p className="about__text">
            Notre conviction est simple : un projet digital réussi se mesure à ce qu’il change pour le client final et
            pour le collaborateur qui traite sa demande.
          </p>
          <p className="about__place">
            <MapPin size={18} strokeWidth={1.75} aria-hidden="true" />
            Fès, Maroc
          </p>
        </Reveal>

        <Reveal className="card about__card" delay={100}>
          <h3 className="about__card-title">Nos engagements</h3>
          <ul className="about__list">
            {COMMITMENTS.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <span className="about__icon">
                  <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <div>
                  <p className="about__item-title">{title}</p>
                  <p className="about__item-text">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

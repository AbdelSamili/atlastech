import HubSpotForm from './HubSpotForm.jsx'
import Reveal from './Reveal.jsx'
import Star from './Star.jsx'
import './Contact.css'

const NEXT_STEPS = [
  'Nous étudions votre demande et revenons vers vous.',
  'Nous fixons un premier échange de 30 minutes avec vos équipes.',
  'Nous préparons une démonstration adaptée à votre activité.',
]

export default function Contact() {
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container contact__inner">
        <Reveal className="contact__intro">
          <p className="eyebrow">
            <Star /> Contact
          </p>
          <h2 id="contact-title" className="h2">
            Demander une démo
          </h2>
          <p className="lead contact__lead">
            Présentez-nous votre projet en quelques lignes. Un membre de l’équipe vous recontacte pour organiser une
            démonstration autour de vos propres processus.
          </p>

          <h3 className="contact__next-title">Ce qui se passe ensuite</h3>
          <ol className="contact__next">
            {NEXT_STEPS.map((text, i) => (
              <li key={text}>
                <span className="contact__next-num" aria-hidden="true">
                  {i + 1}
                </span>
                {text}
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="card contact__form" delay={100}>
          <HubSpotForm />
        </Reveal>
      </div>
    </section>
  )
}

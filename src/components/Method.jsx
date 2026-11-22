import Reveal from './Reveal.jsx'
import Star from './Star.jsx'
import './Method.css'

const STEPS = [
  {
    title: 'Écouter',
    text: 'Ateliers avec vos équipes métier et IT pour comprendre vos processus, vos contraintes et vos priorités.',
  },
  {
    title: 'Concevoir',
    text: 'Maquettes, architecture et plan de livraison, validés avec vous avant la première ligne de code.',
  },
  {
    title: 'Livrer',
    text: 'Développement par itérations courtes, tests à chaque étape et mise en production maîtrisée.',
  },
  {
    title: 'Accompagner',
    text: 'Formation des utilisateurs, maintenance et évolutions, bien après le lancement.',
  },
]

export default function Method() {
  return (
    <section id="methode" className="section method" aria-labelledby="methode-title">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">
            <Star /> Méthode
          </p>
          <h2 id="methode-title" className="h2">
            Une méthode en quatre étapes, du premier atelier au suivi
          </h2>
          <p className="lead method__lead">
            Chaque projet suit le même cadre. Vous savez à tout moment où en est le travail et ce qui vient ensuite.
          </p>
        </Reveal>

        <ol className="method__steps">
          {STEPS.map((step, i) => (
            <Reveal as="li" key={step.title} className="method__step" delay={i * 90}>
              <span className="method__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="method__title">
                <span className="visually-hidden">Étape {i + 1} : </span>
                {step.title}
              </h3>
              <p className="method__text">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

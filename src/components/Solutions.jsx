import { ChartColumn, MonitorSmartphone, Workflow } from 'lucide-react'
import Reveal from './Reveal.jsx'
import Star from './Star.jsx'
import './Solutions.css'

const SOLUTIONS = [
  {
    icon: MonitorSmartphone,
    title: 'Plateformes digitales',
    text: 'Portails clients, applications mobiles et espaces conseillers. Des parcours en ligne clairs, de la demande à la signature.',
  },
  {
    icon: ChartColumn,
    title: 'Données & reporting',
    text: 'Entrepôts de données, tableaux de bord et reporting réglementaire. Des indicateurs fiables, partagés par toutes les équipes.',
  },
  {
    icon: Workflow,
    title: 'Intégration de systèmes',
    text: 'API, connecteurs et reprise de vos applications existantes. Vos outils échangent enfin les bonnes données, au bon moment.',
  },
]

export default function Solutions() {
  return (
    <section id="solutions" className="section" aria-labelledby="solutions-title">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">
            <Star /> Solutions
          </p>
          <h2 id="solutions-title" className="h2">
            Trois expertises pour des processus plus simples
          </h2>
          <p className="lead">
            Nous intervenons là où vos clients et vos collaborateurs perdent du temps : les parcours, les données et
            les échanges entre applications.
          </p>
        </Reveal>

        <ul className="solutions__grid">
          {SOLUTIONS.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} className="card solution" delay={i * 80}>
              <span className="solution__icon">
                <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <h3 className="solution__title">{title}</h3>
              <p className="solution__text">{text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

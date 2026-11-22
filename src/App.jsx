import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Solutions from './components/Solutions.jsx'
import Method from './components/Method.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <Header />
      <main id="contenu">
        <Hero />
        <Solutions />
        <Method />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

import { useEffect, useId, useRef, useState } from 'react'
import { CircleCheck, Info } from 'lucide-react'
import './HubSpotForm.css'

/*
 * HubSpot form embed ("hs-form-frame" format).
 *
 * Values come from Vite environment variables (see .env.example), injected at build time:
 *   VITE_HUBSPOT_REGION     data-region     e.g. "eu1"
 *   VITE_HUBSPOT_PORTAL_ID  data-portal-id  e.g. "149836789"
 *   VITE_HUBSPOT_FORM_ID    data-form-id    e.g. "9d1edabd-..."
 *
 * When all three are set, the real HubSpot form is rendered. Otherwise a
 * demonstration form is shown, which sends nothing.
 */
const env = import.meta.env
const REGION = (env.VITE_HUBSPOT_REGION || '').trim()
const PORTAL_ID = (env.VITE_HUBSPOT_PORTAL_ID || '').trim()
const FORM_ID = (env.VITE_HUBSPOT_FORM_ID || '').trim()

export const isHubSpotConfigured = Boolean(REGION && PORTAL_ID && FORM_ID)

// na1 is served from js.hsforms.net, every other region from js-<region>.hsforms.net
const SCRIPT_HOST = REGION === 'na1' ? 'js.hsforms.net' : `js-${REGION}.hsforms.net`
const SCRIPT_SRC = `https://${SCRIPT_HOST}/forms/embed/${PORTAL_ID}.js`
const SCRIPT_ID = 'hubspot-forms-embed'
const READY_EVENT = 'hs-form-event:on-ready'
const LOAD_TIMEOUT_MS = 20000

/**
 * Injects the HubSpot loader once per page. Called after the frame div is in
 * the DOM. The loader watches the page with a MutationObserver, so a frame div
 * added later (component re-mount, hot reload) is picked up by the same script.
 */
function ensureScript(onError) {
  let script = document.getElementById(SCRIPT_ID)
  if (!script) {
    script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = SCRIPT_SRC
    script.defer = true
    script.addEventListener('error', () => script.remove()) // allow a retry on next mount
    document.body.appendChild(script)
  }
  script.addEventListener('error', onError)
  return () => script.removeEventListener('error', onError)
}

function HubSpotEmbed() {
  const frameRef = useRef(null)
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    const frame = frameRef.current
    let ready = false
    const markReady = () => {
      ready = true
      setStatus('ready')
    }

    // HubSpot fires this event on the frame container; it bubbles to window.
    const onReady = (e) => {
      if (!e.detail?.formId || e.detail.formId === FORM_ID) markReady()
    }
    window.addEventListener(READY_EVENT, onReady)

    // Fallback: consider the form ready once its iframe has loaded.
    const observer = new MutationObserver(() => {
      const iframe = frame.querySelector('iframe')
      if (iframe) {
        iframe.addEventListener('load', markReady, { once: true })
        observer.disconnect()
      }
    })
    observer.observe(frame, { childList: true, subtree: true })

    const removeErrorListener = ensureScript(() => !ready && setStatus('error'))
    const timer = setTimeout(() => !ready && setStatus('error'), LOAD_TIMEOUT_MS)

    return () => {
      window.removeEventListener(READY_EVENT, onReady)
      observer.disconnect()
      removeErrorListener()
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="hubspot-embed">
      {status === 'loading' && (
        <div className="form-skeleton" role="status">
          <span className="visually-hidden">Chargement du formulaire…</span>
          <div className="form-skeleton__row" aria-hidden="true">
            <div className="form-skeleton__field" />
            <div className="form-skeleton__field" />
          </div>
          <div className="form-skeleton__field" aria-hidden="true" />
          <div className="form-skeleton__field" aria-hidden="true" />
          <div className="form-skeleton__field form-skeleton__field--area" aria-hidden="true" />
          <div className="form-skeleton__button" aria-hidden="true" />
          <p className="form-skeleton__label" aria-hidden="true">
            Chargement du formulaire…
          </p>
        </div>
      )}
      {status === 'error' && (
        <p className="hubspot-embed__error" role="alert">
          Le formulaire n’a pas pu être chargé. Vérifiez votre connexion ou désactivez le bloqueur de contenu, puis
          rechargez la page.
        </p>
      )}
      <div
        ref={frameRef}
        className="hs-form-frame"
        data-region={REGION}
        data-form-id={FORM_ID}
        data-portal-id={PORTAL_ID}
      />
    </div>
  )
}

const FIELDS = [
  { name: 'firstname', label: 'Prénom', type: 'text', autoComplete: 'given-name', half: true },
  { name: 'lastname', label: 'Nom', type: 'text', autoComplete: 'family-name', half: true },
  { name: 'email', label: 'E-mail professionnel', type: 'email', autoComplete: 'email' },
  { name: 'company', label: 'Entreprise', type: 'text', autoComplete: 'organization' },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(values) {
  const errors = {}
  if (!values.firstname.trim()) errors.firstname = 'Indiquez votre prénom.'
  if (!values.lastname.trim()) errors.lastname = 'Indiquez votre nom.'
  if (!values.email.trim()) errors.email = 'Indiquez votre e-mail professionnel.'
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Saisissez une adresse e-mail valide, par exemple nom@entreprise.ma.'
  if (!values.company.trim()) errors.company = 'Indiquez le nom de votre entreprise.'
  return errors
}

const EMPTY = { firstname: '', lastname: '', email: '', company: '', message: '' }

/** Fallback when HubSpot is not configured: validates locally, never sends data anywhere. */
function PlaceholderForm() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const formRef = useRef(null)
  const successRef = useRef(null)
  const uid = useId()

  useEffect(() => {
    if (sent) successRef.current?.focus()
  }, [sent])

  const onChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      formRef.current?.querySelector(`[name="${first}"]`)?.focus()
      return
    }
    // Intentionally no network request: this is a demonstration form.
    setSent(true)
  }

  if (sent) {
    return (
      <div className="demo-success" ref={successRef} tabIndex={-1} role="status">
        <CircleCheck size={28} strokeWidth={1.75} aria-hidden="true" className="demo-success__icon" />
        <p className="demo-success__title">Merci {values.firstname.trim()}, votre demande est bien enregistrée</p>
        <p className="demo-success__text">
          Ceci est une démonstration : aucune donnée n’a été envoyée. Une fois relié à HubSpot, ce formulaire créera
          automatiquement un contact dans le CRM.
        </p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setValues(EMPTY)
            setSent(false)
          }}
        >
          Envoyer une autre demande
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} className="demo-form" onSubmit={onSubmit} noValidate aria-describedby={`${uid}-note`}>
      <div className="demo-form__grid">
        {FIELDS.map((f) => {
          const id = `${uid}-${f.name}`
          const err = errors[f.name]
          return (
            <div key={f.name} className={`field${f.half ? ' field--half' : ''}`}>
              <label htmlFor={id}>
                {f.label} <span aria-hidden="true" className="field__req">*</span>
              </label>
              <input
                id={id}
                name={f.name}
                type={f.type}
                autoComplete={f.autoComplete}
                value={values[f.name]}
                onChange={onChange}
                required
                aria-invalid={err ? 'true' : undefined}
                aria-describedby={err ? `${id}-err` : undefined}
              />
              {err && (
                <p id={`${id}-err`} className="field__error">
                  {err}
                </p>
              )}
            </div>
          )
        })}

        <div className="field">
          <label htmlFor={`${uid}-message`}>
            Message <span className="field__opt">(facultatif)</span>
          </label>
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={4}
            value={values.message}
            onChange={onChange}
            placeholder="Votre projet en quelques lignes"
          />
        </div>
      </div>

      <button type="submit" className="btn btn-cta demo-form__submit">
        Envoyer
      </button>

      <p id={`${uid}-note`} className="demo-form__note">
        <Info size={16} strokeWidth={1.75} aria-hidden="true" />
        Formulaire de démonstration – sera connecté à HubSpot
      </p>
    </form>
  )
}

export default function HubSpotForm() {
  return isHubSpotConfigured ? <HubSpotEmbed /> : <PlaceholderForm />
}

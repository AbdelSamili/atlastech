import { useEffect, useId, useRef, useState } from 'react'
import { CircleCheck, Info } from 'lucide-react'
import './HubSpotForm.css'

/*
 * HubSpot form embed.
 *
 * Values come from Vite environment variables (see .env.example):
 *   VITE_HUBSPOT_REGION      e.g. "eu1" or "na1"
 *   VITE_HUBSPOT_PORTAL_ID   e.g. "12345678"
 *   VITE_HUBSPOT_FORM_ID     e.g. "1a2b3c4d-...."
 *   VITE_HUBSPOT_EMBED_MODE  "v2" (hbspt.forms.create) or "frame" (hs-form-frame div)
 *
 * The HubSpot script is only requested when portal ID and form ID are set.
 * Otherwise a demonstration form is shown, which sends nothing.
 */
const env = import.meta.env
const REGION = (env.VITE_HUBSPOT_REGION || 'na1').trim()
const PORTAL_ID = (env.VITE_HUBSPOT_PORTAL_ID || '').trim()
const FORM_ID = (env.VITE_HUBSPOT_FORM_ID || '').trim()
const MODE = (env.VITE_HUBSPOT_EMBED_MODE || 'v2').trim().toLowerCase()

export const isHubSpotConfigured = Boolean(PORTAL_ID && FORM_ID)

// na1 uses js.hsforms.net, other regions use js-<region>.hsforms.net
const scriptHost = REGION === 'na1' ? 'js.hsforms.net' : `js-${REGION}.hsforms.net`

const scriptPromises = new Map()
function loadScript(src) {
  if (!scriptPromises.has(src)) {
    scriptPromises.set(
      src,
      new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.charset = 'utf-8'
        script.onload = resolve
        script.onerror = () => {
          scriptPromises.delete(src)
          script.remove()
          reject(new Error(`Impossible de charger ${src}`))
        }
        document.body.appendChild(script)
      }),
    )
  }
  return scriptPromises.get(src)
}

function HubSpotEmbed() {
  const containerRef = useRef(null)
  const targetId = `hs-form-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const [state, setState] = useState('loading')

  useEffect(() => {
    let cancelled = false
    const container = containerRef.current

    if (MODE === 'frame') {
      // New HubSpot embed: the script scans the page for .hs-form-frame elements.
      loadScript(`https://${scriptHost}/forms/embed/${PORTAL_ID}.js`)
        .then(() => !cancelled && setState('ready'))
        .catch(() => !cancelled && setState('error'))
      return () => {
        cancelled = true
      }
    }

    // Legacy v2 embed: hbspt.forms.create renders the form into our container.
    loadScript(`https://${scriptHost}/forms/embed/v2.js`)
      .then(() => {
        if (cancelled || !window.hbspt?.forms) return
        container.innerHTML = ''
        window.hbspt.forms.create({
          region: REGION,
          portalId: PORTAL_ID,
          formId: FORM_ID,
          target: `#${targetId}`,
          css: '', // drop HubSpot's default theme so the site styles apply
          onFormReady: () => !cancelled && setState('ready'),
        })
      })
      .catch(() => !cancelled && setState('error'))

    return () => {
      cancelled = true
      if (container) container.innerHTML = ''
    }
  }, [targetId])

  return (
    <div className="hubspot-embed" aria-busy={state === 'loading'}>
      {state === 'loading' && <p className="hubspot-embed__status">Chargement du formulaire…</p>}
      {state === 'error' && (
        <p className="hubspot-embed__status" role="alert">
          Le formulaire n’a pas pu être chargé. Vérifiez votre connexion ou désactivez le bloqueur de contenu, puis
          rechargez la page.
        </p>
      )}
      {MODE === 'frame' ? (
        <div
          ref={containerRef}
          className="hs-form-frame"
          data-region={REGION}
          data-form-id={FORM_ID}
          data-portal-id={PORTAL_ID}
        />
      ) : (
        <div ref={containerRef} id={targetId} />
      )}
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

/** Demonstration form: validates locally, never sends data anywhere. */
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

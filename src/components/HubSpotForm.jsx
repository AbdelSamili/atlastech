import { useEffect, useId, useRef, useState } from 'react'
import { AlertCircle, CircleCheck, Info, LoaderCircle } from 'lucide-react'
import './HubSpotForm.css'

/*
 * "Demander une démo" form, styled like the site and submitted directly to
 * HubSpot with the Forms API (unauthenticated v3 integration endpoint):
 *   POST https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formGuid}
 * Documented host for all data centers (HubSpot routes by portal ID); CORS is supported.
 *
 * Values come from Vite environment variables, injected at build time:
 *   VITE_HUBSPOT_REGION, VITE_HUBSPOT_PORTAL_ID, VITE_HUBSPOT_FORM_ID
 */
// Read each variable explicitly: Vite then inlines only these values, not the whole env object.
const REGION = (import.meta.env.VITE_HUBSPOT_REGION || '').trim()
const PORTAL_ID = (import.meta.env.VITE_HUBSPOT_PORTAL_ID || '').trim()
const FORM_ID = (import.meta.env.VITE_HUBSPOT_FORM_ID || '').trim()

export const isHubSpotConfigured = Boolean(REGION && PORTAL_ID && FORM_ID)

const SUBMIT_URL = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`

const CONSENT_TEXT =
  'J’accepte qu’AtlasTech Solutions utilise mes données pour me recontacter au sujet de ma demande, conformément à la loi 09-08 relative à la protection des données personnelles.'

const FIELDS = [
  { name: 'firstname', label: 'Prénom', type: 'text', autoComplete: 'given-name', half: true },
  { name: 'lastname', label: 'Nom', type: 'text', autoComplete: 'family-name', half: true },
  { name: 'email', label: 'E-mail professionnel', type: 'email', autoComplete: 'email' },
  { name: 'company', label: 'Entreprise', type: 'text', autoComplete: 'organization' },
]

const EMPTY = { firstname: '', lastname: '', email: '', company: '', message: '', consent: false }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(v) {
  const errors = {}
  if (!v.firstname.trim()) errors.firstname = 'Indiquez votre prénom.'
  if (!v.lastname.trim()) errors.lastname = 'Indiquez votre nom.'
  if (!v.email.trim()) errors.email = 'Indiquez votre e-mail professionnel.'
  else if (!EMAIL_RE.test(v.email.trim())) errors.email = 'Saisissez une adresse e-mail valide, par exemple nom@entreprise.ma.'
  if (!v.company.trim()) errors.company = 'Indiquez le nom de votre entreprise.'
  if (!v.consent) errors.consent = 'Cochez cette case pour que nous puissions traiter votre demande.'
  return errors
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
  return match ? decodeURIComponent(match[1]) : null
}

/** Builds the HubSpot Forms API payload. Property names match the HubSpot form definition. */
function buildPayload(v) {
  const company = v.company.trim()
  const fields = [
    { objectTypeId: '0-1', name: 'firstname', value: v.firstname.trim() },
    { objectTypeId: '0-1', name: 'lastname', value: v.lastname.trim() },
    { objectTypeId: '0-1', name: 'email', value: v.email.trim() },
    { objectTypeId: '0-2', name: 'name', value: company }, // "Entreprise" field of the HubSpot form (company record)
    { objectTypeId: '0-1', name: 'company', value: company }, // company name on the contact record
  ]
  if (v.message.trim()) fields.push({ objectTypeId: '0-1', name: 'message', value: v.message.trim() })

  const context = { pageUri: window.location.href, pageName: document.title }
  const hutk = getCookie('hubspotutk')
  if (hutk) context.hutk = hutk

  return {
    submittedAt: Date.now(),
    fields,
    context,
    legalConsentOptions: {
      consent: { consentToProcess: v.consent, text: CONSENT_TEXT },
    },
  }
}

export default function HubSpotForm() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const formRef = useRef(null)
  const successRef = useRef(null)
  const errorRef = useRef(null)
  const uid = useId()

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
    if (status === 'error') errorRef.current?.focus()
  }, [status])

  const onChange = (e) => {
    const { name, type, value, checked } = e.target
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending' || !isHubSpotConfigured) return

    const found = validate(values)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      formRef.current?.querySelector(`[name="${first}"]`)?.focus()
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(SUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(values)),
      })
      if (!res.ok) {
        const details = await res.json().catch(() => null)
        console.error('[HubSpot] Échec de l’envoi du formulaire', res.status, details)
        if (details?.errors?.some((err) => err.errorType === 'INVALID_EMAIL')) {
          setErrors({ email: 'Cette adresse e-mail a été refusée. Utilisez votre adresse professionnelle.' })
        }
        setStatus('error')
        return
      }
      setStatus('success')
    } catch (err) {
      console.error('[HubSpot] Erreur réseau lors de l’envoi du formulaire', err)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="form-success" ref={successRef} tabIndex={-1} role="status">
        <CircleCheck size={32} strokeWidth={1.75} aria-hidden="true" className="form-success__icon" />
        <p className="form-success__title">Merci, votre demande est bien reçue&nbsp;!</p>
        <p className="form-success__text">
          Un conseiller AtlasTech vous recontacte sous 24&nbsp;h pour organiser votre démonstration.
        </p>
      </div>
    )
  }

  const sending = status === 'sending'
  const fieldError = (name) => errors[name]
  const describedBy = (name) => (errors[name] ? `${uid}-${name}-err` : undefined)

  return (
    <form ref={formRef} className="demo-form" onSubmit={onSubmit} noValidate aria-busy={sending}>
      <div className="demo-form__grid">
        {FIELDS.map((f) => {
          const id = `${uid}-${f.name}`
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
                disabled={sending}
                aria-invalid={fieldError(f.name) ? 'true' : undefined}
                aria-describedby={describedBy(f.name)}
              />
              {fieldError(f.name) && (
                <p id={`${id}-err`} className="field__error">
                  {fieldError(f.name)}
                </p>
              )}
            </div>
          )
        })}

        <div className="field">
          <label htmlFor={`${uid}-message`}>
            Votre besoin <span className="field__opt">(facultatif)</span>
          </label>
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={4}
            value={values.message}
            onChange={onChange}
            disabled={sending}
            placeholder="Votre projet en quelques lignes"
          />
        </div>

        <div className="field consent">
          <div className="consent__row">
            <input
              id={`${uid}-consent`}
              name="consent"
              type="checkbox"
              checked={values.consent}
              onChange={onChange}
              required
              disabled={sending}
              aria-invalid={fieldError('consent') ? 'true' : undefined}
              aria-describedby={describedBy('consent')}
            />
            <label htmlFor={`${uid}-consent`}>
              {CONSENT_TEXT} <span aria-hidden="true" className="field__req">*</span>
            </label>
          </div>
          {fieldError('consent') && (
            <p id={`${uid}-consent-err`} className="field__error">
              {fieldError('consent')}
            </p>
          )}
        </div>
      </div>

      {status === 'error' && (
        <p className="form-alert" role="alert" tabIndex={-1} ref={errorRef}>
          <AlertCircle size={18} strokeWidth={1.75} aria-hidden="true" />
          Une erreur est survenue, veuillez réessayer.
        </p>
      )}

      <button type="submit" className="btn btn-cta demo-form__submit" disabled={sending || !isHubSpotConfigured}>
        {sending ? (
          <>
            <LoaderCircle size={18} strokeWidth={2} aria-hidden="true" className="spin" />
            Envoi en cours…
          </>
        ) : (
          'Demander une démo'
        )}
      </button>

      {!isHubSpotConfigured && (
        <p className="demo-form__note">
          <Info size={16} strokeWidth={1.75} aria-hidden="true" />
          Formulaire non configuré : renseignez les variables VITE_HUBSPOT_* pour activer l’envoi.
        </p>
      )}
    </form>
  )
}

import { useState, type FormEvent } from 'react'
import { Btn, Section, field } from '../components/ui'
import { MAIL, saveRegistration } from '../services/api'

const msgs = {
  bad: 'Escribe un correo válido.',
  ok: MAIL ? 'Listo. Revisa tu correo: te enviamos una confirmación.' : 'Listo. Guardamos tu correo.',
  err: 'No se pudo enviar. Intenta de nuevo en un momento.',
}

export default function Launch() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<keyof typeof msgs>()
  const [busy, setBusy] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setStatus('bad')
    setBusy(true)
    saveRegistration({ name: '', email, role: 'Suscriptor' })
      .then(() => { setStatus('ok'); setEmail('') })
      .catch(() => setStatus('err'))
      .finally(() => setBusy(false))
  }

  return (
    <Section id="lanzamiento" title="Entérate del lanzamiento" intro="Déjanos tu correo y te avisamos cuando After Light esté disponible.">
      <form onSubmit={submit} className="max-w-xl">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" aria-label="Correo electrónico" autoComplete="email" className={field} />
          <Btn type="submit" disabled={busy} className="shrink-0">{busy ? 'Enviando…' : 'Avísame'}</Btn>
        </div>
        {status && <p role="status" className={`mt-3 text-sm ${status === 'ok' ? 'text-muted' : 'text-accent'}`}>{msgs[status]}</p>}
        <p className="mt-4 text-xs text-muted">Solo usaremos tu correo para avisarte del lanzamiento. Sin spam.</p>
      </form>
    </Section>
  )
}
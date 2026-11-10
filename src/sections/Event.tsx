import { useState, type FormEvent } from 'react'
import { Btn, Section, btn, field } from '../components/ui'
import { getEvent, saveRegistration } from '../services/api'
import { useAsync } from '../hooks/useAsync'
import EventMap from '../components/EventMap'

const msgs = { bad: 'Escribe tu nombre y un correo válido.', ok: 'Listo. Te avisaremos cuando se confirme la fecha.', err: 'No se pudo enviar. Tu registro quedó guardado en este dispositivo.' }
const label = 'mb-1 block text-sm text-muted'

export default function Event() {
  const { data: ev, error } = useAsync(getEvent)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<keyof typeof msgs>()

  const valid = !!ev && /^\d{4}-\d{2}-\d{2}$/.test(ev.date)
  const day = new Date((ev?.date ?? '') + 'T00:00:00')
  const left = Math.ceil((day.getTime() - Date.now()) / 864e5)
  const when = ev ? (valid ? day.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ev.date) : ''
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email)) return setStatus('bad')
    saveRegistration({ name: name.trim(), email }).then(() => { setStatus('ok'); setName(''); setEmail('') }).catch(() => setStatus('err'))
  }
  const intro = !ev ? undefined : valid ? (left > 0 ? `Faltan ${left} días.` : left === 0 ? 'Es hoy.' : 'El evento ya finalizó.') : 'Fecha por definir. Regístrate y te avisamos.'

  return (
    <Section id="evento" title={ev?.name ?? 'El evento'} intro={intro}>
      {error && <p className="text-accent">No se pudo cargar el evento. Revisa tu conexión.</p>}
      {!ev && !error && <p className="text-muted">Cargando…</p>}
      {ev && (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <dl className="divide-y divide-line rounded-3xl border border-line bg-panel/60 px-8">
              {[['Fecha', when, ''], ['Hora', ev.time, ''], ['Lugar', ev.place, ev.address]].map(([k, v, sub]) => (
                <div key={k} className="py-5">
                  <dt className="text-sm text-muted">{k}</dt>
                  <dd className="mt-1 font-display text-3xl font-bold uppercase">{v}</dd>
                  {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
                </div>
              ))}
            </dl>
            {ev.lat && ev.lon && (
              <div className="space-y-3">
                <EventMap lat={ev.lat} lon={ev.lon} title={ev.place} />
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${ev.lat},${ev.lon}`} target="_blank" rel="noopener noreferrer" className={btn(true)}>Cómo llegar ↗</a>
              </div>
            )}
          </div>
          <form id="registro" onSubmit={submit} className="scroll-mt-24 space-y-4 self-start rounded-3xl border border-accent/60 bg-panel/60 p-8">
            <h3 className="font-display text-4xl font-bold uppercase">Regístrate</h3>
            <label className="block"><span className={label}>Nombre</span><input value={name} onChange={e => setName(e.target.value)} autoComplete="name" className={field} /></label>
            <label className="block"><span className={label}>Correo</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className={field} /></label>
            {status && <p className={`text-sm ${status === 'ok' ? 'text-muted' : 'text-accent'}`} role="status">{msgs[status]}</p>}
            <Btn type="submit" className="w-full">Registrarme</Btn>
          </form>
        </div>
      )}
    </Section>
  )
}
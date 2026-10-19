import { useEffect, useState, type FormEvent } from 'react'
import { Btn, Section, field } from '../components/ui'
import { getEvent, getWeather, saveRegistration, type Weather } from '../services/api'
import { useAsync } from '../hooks/useAsync'

const msgs = { bad: 'Escribe tu nombre y un correo válido.', ok: 'Listo. Te avisaremos cuando se confirme la fecha.', err: 'No se pudo enviar. Tu registro quedó guardado en este dispositivo.' }
const label = 'mb-1 block text-sm text-muted'

export default function Event() {
  const { data: ev, error } = useAsync(getEvent)
  const [w, setW] = useState<Weather>()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Jugador')
  const [status, setStatus] = useState<keyof typeof msgs>()

  const valid = !!ev && /^\d{4}-\d{2}-\d{2}$/.test(ev.date)
  useEffect(() => { if (ev) getWeather(ev.lat ?? 21.1619, ev.lon ?? -86.8515, valid ? ev.date : undefined).then(setW).catch(() => {}) }, [ev])

  const day = new Date((ev?.date ?? '') + 'T00:00:00')
  const left = Math.ceil((day.getTime() - Date.now()) / 864e5)
  const when = ev ? (valid ? day.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ev.date) : ''
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email)) return setStatus('bad')
    saveRegistration({ name: name.trim(), email, role }).then(() => { setStatus('ok'); setName(''); setEmail('') }).catch(() => setStatus('err'))
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
              {[['Fecha', when], ['Hora', ev.time], ['Lugar', ev.place + (ev.address ? `. ${ev.address}` : '')]].map(([k, v]) => (
                <div key={k} className="py-5"><dt className="text-sm text-muted">{k}</dt><dd className="mt-1 font-display text-3xl font-bold uppercase">{v}</dd></div>
              ))}
            </dl>
            {w && (
              <div className="rounded-3xl border border-line p-6">
                <p className="text-sm text-muted">{ev.lat ? w.label : 'Clima actual en Cancún'}</p>
                <p className="mt-1 font-display text-4xl font-bold">{Math.round(w.temp)} °C{w.rain !== null && <span className="ml-4 text-base font-normal text-muted">Lluvia: {w.rain}%</span>}</p>
              </div>
            )}
            {ev.lat && ev.lon && <iframe title={`Mapa de ${ev.place}`} loading="lazy" className="h-64 w-full rounded-3xl border border-line" style={{ filter: 'invert(.92) hue-rotate(180deg)' }}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${ev.lon - 0.01},${ev.lat - 0.006},${ev.lon + 0.01},${ev.lat + 0.006}&layer=mapnik&marker=${ev.lat},${ev.lon}`} />}
          </div>
          <form id="registro" onSubmit={submit} className="scroll-mt-24 space-y-4 self-start rounded-3xl border border-accent/60 bg-panel/60 p-8">
            <h3 className="font-display text-4xl font-bold uppercase">Regístrate</h3>
            <label className="block"><span className={label}>Nombre</span><input value={name} onChange={e => setName(e.target.value)} autoComplete="name" className={field} /></label>
            <label className="block"><span className={label}>Correo</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className={field} /></label>
            <label className="block"><span className={label}>Asistirás como</span><select value={role} onChange={e => setRole(e.target.value)} className={field}><option>Jugador</option><option>Visitante</option></select></label>
            {status && <p className={`text-sm ${status === 'ok' ? 'text-muted' : 'text-accent'}`} role="status">{msgs[status]}</p>}
            <Btn type="submit" className="w-full">Registrarme</Btn>
          </form>
        </div>
      )}
    </Section>
  )
}

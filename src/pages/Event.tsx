import { useEffect, useState, type FormEvent } from 'react'
import { Btn, Tag, Title } from '../components/ui'
import { getEvent, getWeather, saveRegistration, type Weather } from '../services/api'
import { useAsync } from '../hooks/useAsync'

const field = 'h-12 w-full rounded-[10px] border border-line bg-ink px-4 text-sm outline-none focus:border-accent'
const msgs = { bad: 'Escribe tu nombre y un correo válido.', ok: 'Listo. Te avisaremos cuando se confirme la fecha.', err: 'No se pudo enviar. Tu registro quedó guardado en este dispositivo.' }

export default function Event() {
  const { data: ev, error } = useAsync(getEvent)
  const [w, setW] = useState<Weather>()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Jugador')
  const [status, setStatus] = useState<keyof typeof msgs>()

  const valid = !!ev && /^\d{4}-\d{2}-\d{2}$/.test(ev.date)
  useEffect(() => { if (ev) getWeather(ev.lat ?? 21.1619, ev.lon ?? -86.8515, valid ? ev.date : undefined).then(setW).catch(() => {}) }, [ev])

  if (!ev) return <p className="p-5 text-sm text-muted">{error ? 'No se pudo cargar el evento. Revisa tu conexión.' : 'Cargando…'}</p>

  const day = new Date(ev.date + 'T00:00:00')
  const left = Math.ceil((day.getTime() - Date.now()) / 864e5)
  const when = valid ? day.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ev.date
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email)) return setStatus('bad')
    saveRegistration({ name: name.trim(), email, role }).then(() => { setStatus('ok'); setName(''); setEmail('') }).catch(() => setStatus('err'))
  }

  return (
    <div className="space-y-4 p-5">
      <Tag>{valid ? (left > 0 ? `Faltan ${left} días` : left === 0 ? 'Es hoy' : 'Evento finalizado') : 'Fecha por definir'}</Tag>
      <Title>{ev.name}</Title>
      <dl className="divide-y divide-line rounded-xl border border-accent/60 bg-panel/60 px-4">
        {[['Fecha', when], ['Hora', ev.time], ['Lugar', ev.place + (ev.address ? `. ${ev.address}` : '')]].map(([k, v]) => (
          <div key={k} className="py-3"><dt><Tag>{k}</Tag></dt><dd className="mt-1 text-sm first-letter:uppercase">{v}</dd></div>
        ))}
      </dl>
      {w && (
        <div className="rounded-xl border border-line p-4">
          <Tag>{ev.lat ? w.label : 'Clima actual en Cancún'}</Tag>
          <p className="mt-1 font-display text-2xl font-bold">{Math.round(w.temp)} °C{w.rain !== null && <span className="ml-3 text-sm font-normal text-muted">Lluvia: {w.rain}%</span>}</p>
        </div>
      )}
      {ev.lat && ev.lon && <iframe title={`Mapa de ${ev.place}`} loading="lazy" className="h-52 w-full rounded-xl border border-line" style={{ filter: 'invert(.92) hue-rotate(180deg)' }}
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${ev.lon - 0.01},${ev.lat - 0.006},${ev.lon + 0.01},${ev.lat + 0.006}&layer=mapnik&marker=${ev.lat},${ev.lon}`} />}
      <form onSubmit={submit} className="space-y-3 border-t border-line pt-4">
        <Title>Regístrate</Title>
        <label className="block"><Tag className="mb-1">Nombre</Tag><input value={name} onChange={e => setName(e.target.value)} autoComplete="name" className={field} /></label>
        <label className="block"><Tag className="mb-1">Correo</Tag><input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className={field} /></label>
        <label className="block"><Tag className="mb-1">Asistirás como</Tag>
          <select value={role} onChange={e => setRole(e.target.value)} className={field}><option>Jugador</option><option>Visitante</option></select>
        </label>
        {status && <p className={`text-xs ${status === 'ok' ? 'text-muted' : 'text-accent'}`} role="status">{msgs[status]}</p>}
        <Btn type="submit">Registrarme <span>→</span></Btn>
      </form>
    </div>
  )
}

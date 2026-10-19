import { useState } from 'react'
import { Btn, Section, chip } from '../components/ui'
import { getCharacters } from '../services/api'
import { useAsync } from '../hooks/useAsync'
import { useList } from '../hooks/useList'

export default function Characters() {
  const { data, error } = useAsync(getCharacters)
  const favs = useList('dot:chars')
  const [role, setRole] = useState('Todos')
  const [sel, setSel] = useState('')
  const roles = ['Todos', ...new Set(data?.map(c => c.role))]
  const list = data?.filter(c => role === 'Todos' || c.role === role)
  const cur = list?.find(c => c.id === sel) ?? list?.[0]

  return (
    <Section id="personajes" title="Personajes" intro="Conoce a quienes sobreviven y a quienes acechan en la oscuridad.">
      {error && <p className="text-accent">No se pudieron cargar los personajes. Revisa tu conexión.</p>}
      {!data && !error && <p className="text-muted">Cargando…</p>}
      {data && cur && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">{roles.map(r => <button key={r} onClick={() => setRole(r)} className={chip(role === r)}>{r}</button>)}</div>
            <ul className="space-y-2">
              {list!.map(c => (
                <li key={c.id}>
                  <button onClick={() => setSel(c.id)} aria-pressed={cur.id === c.id}
                    className={`w-full rounded-xl border px-5 py-4 text-left transition ${cur.id === c.id ? 'border-accent bg-dim/60' : 'border-line hover:border-muted'}`}>
                    <span className="font-display text-2xl font-bold uppercase">{c.name}</span>
                    <span className="block text-sm text-muted">{c.role}{favs.has(c.id) ? ' · ♥' : ''}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-3xl border border-line bg-panel p-8"
            style={{ backgroundImage: `linear-gradient(to top,#070F1D 25%,transparent),radial-gradient(circle at 70% 15%,rgba(255,70,89,.35),transparent 55%)${cur.image ? `,url(${cur.image})` : ''}`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <p className="text-sm font-medium text-accent">{cur.role}</p>
            <h3 className="font-display text-6xl font-extrabold uppercase leading-none md:text-8xl">{cur.name}</h3>
            <p className="mt-4 max-w-md text-muted">{cur.desc}</p>
            <Btn ghost className="mt-6 self-start" onClick={() => favs.toggle(cur.id)} aria-pressed={favs.has(cur.id)}>{favs.has(cur.id) ? '♥ En favoritos' : '♡ Guardar en favoritos'}</Btn>
          </div>
        </div>
      )}
    </Section>
  )
}

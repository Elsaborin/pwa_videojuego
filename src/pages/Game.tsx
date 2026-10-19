import { useState } from 'react'
import { Tag, Title } from '../components/ui'
import { getCharacters, getGame } from '../services/api'
import { useAsync } from '../hooks/useAsync'
import { useList } from '../hooks/useList'

const sections = ['Historia', 'Dinámicas', 'Personajes']
const chip = (on: boolean) => `shrink-0 rounded-lg border px-3 py-1.5 text-xs ${on ? 'border-accent bg-dim text-accent' : 'border-line text-muted'}`

export default function Game() {
  const { data: g, error } = useAsync(getGame)
  const { data: chars } = useAsync(getCharacters)
  const favs = useList('dot:chars')
  const [tab, setTab] = useState('Historia')
  const [role, setRole] = useState('Todos')
  const [sel, setSel] = useState<string>()
  const roles = ['Todos', ...new Set(chars?.map(c => c.role))]

  return (
    <div className="space-y-4 p-5">
      <Tag>El juego</Tag>
      <Title>{g?.title ?? 'After Light'}</Title>
      <div className="flex gap-2" role="tablist">
        {sections.map(s => <button key={s} role="tab" aria-selected={tab === s} onClick={() => setTab(s)} className={chip(tab === s)}>{s}</button>)}
      </div>
      {error && <p className="text-sm text-accent">No se pudo cargar el contenido. Revisa tu conexión.</p>}
      {!g && !error && <p className="text-sm text-muted">Cargando…</p>}

      {g && tab === 'Historia' && <>
        <p className="font-display text-xl font-semibold text-accent">{g.tagline}</p>
        {g.story.map((p, i) => <p key={i} className="text-sm leading-relaxed text-muted">{p}</p>)}
      </>}

      {g && tab === 'Dinámicas' && g.mechanics.map(m => (
        <section key={m.title} className="border-l-2 border-accent pl-4">
          <h2 className="font-display text-lg font-bold uppercase">{m.title}</h2>
          <p className="text-sm text-muted">{m.text}</p>
        </section>
      ))}

      {tab === 'Personajes' && <>
        <div className="flex gap-2 overflow-x-auto">{roles.map(r => <button key={r} onClick={() => setRole(r)} className={chip(role === r)}>{r}</button>)}</div>
        {chars?.filter(c => role === 'Todos' || c.role === role).map(c => (
          <div key={c.id} className={`rounded-xl border p-4 ${sel === c.id ? 'border-accent bg-dim/60' : 'border-line bg-panel/60'}`}>
            <button onClick={() => setSel(sel === c.id ? undefined : c.id)} aria-expanded={sel === c.id} className="w-full text-left">
              <Tag>{c.role}</Tag><h2 className="font-display text-xl font-bold uppercase">{c.name}</h2>
            </button>
            {sel === c.id && (
              <div className="mt-2 space-y-3">
                <p className="text-sm text-muted">{c.desc}</p>
                <button onClick={() => favs.toggle(c.id)} aria-pressed={favs.has(c.id)} className="w-full rounded-[10px] border border-line py-2.5 font-mono text-xs uppercase tracking-wider">
                  {favs.has(c.id) ? '♥ En favoritos' : '♡ Guardar en favoritos'}
                </button>
              </div>
            )}
          </div>
        ))}
      </>}
    </div>
  )
}

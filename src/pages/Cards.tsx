import { useState } from 'react'
import { Tag, Title, Muted } from '../components/ui'
import { getCards } from '../services/api'
import { useAsync } from '../hooks/useAsync'
import { useList } from '../hooks/useList'

const chip = (on: boolean) => `shrink-0 rounded-lg border px-3 py-1.5 text-xs ${on ? 'border-accent bg-dim text-accent' : 'border-line text-muted'}`

export default function Cards() {
  const { data, error } = useAsync(getCards)
  const favs = useList('dot:cards')
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Todas')
  const [onlyFav, setOnlyFav] = useState(false)
  const cats = ['Todas', ...new Set(data?.map(c => c.category))]
  const list = data?.filter(c => (cat === 'Todas' || c.category === cat) && c.name.toLowerCase().includes(q.toLowerCase()) && (!onlyFav || favs.has(c.id)))

  return (
    <div className="space-y-4 p-5">
      <Tag>Sistema de potenciadores</Tag>
      <div><Title>Cartas potenciadoras</Title><Muted>Al cumplir rondas eliges una mejora y adaptas tu estrategia a la partida.</Muted></div>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar carta" aria-label="Buscar carta" className="h-12 w-full rounded-[10px] border border-line bg-ink px-4 text-sm outline-none focus:border-accent" />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {cats.map(c => <button key={c} onClick={() => setCat(c)} className={chip(cat === c)}>{c}</button>)}
        <button onClick={() => setOnlyFav(v => !v)} aria-pressed={onlyFav} className={chip(onlyFav)}>♥ Favoritas</button>
      </div>
      {error && <p className="text-sm text-accent">No se pudieron cargar las cartas. Revisa tu conexión.</p>}
      {!data && !error && <p className="text-sm text-muted">Cargando…</p>}
      {list?.length === 0 && <p className="text-sm text-muted">Sin resultados. Cambia el filtro o la búsqueda.</p>}
      {list?.map(c => (
        <div key={c.id} className="flex items-start justify-between gap-3 rounded-xl border border-line bg-panel/60 p-4">
          <div><Tag>{c.category}</Tag><h2 className="font-display text-xl font-bold uppercase">{c.name}</h2><p className="mt-1 text-sm text-accent">⚡ {c.effect}</p></div>
          <button onClick={() => favs.toggle(c.id)} aria-pressed={favs.has(c.id)} aria-label={`Favorita: ${c.name}`} className="grid size-9 shrink-0 place-items-center rounded-lg border border-line text-lg text-accent">{favs.has(c.id) ? '♥' : '♡'}</button>
        </div>
      ))}
    </div>
  )
}

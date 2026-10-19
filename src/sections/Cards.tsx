import { useState } from 'react'
import { Section, chip, field } from '../components/ui'
import { getCards } from '../services/api'
import { useAsync } from '../hooks/useAsync'
import { useList } from '../hooks/useList'

export default function Cards() {
  const { data, error } = useAsync(getCards)
  const favs = useList('dot:cards')
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Todas')
  const [onlyFav, setOnlyFav] = useState(false)
  const cats = ['Todas', ...new Set(data?.map(c => c.category))]
  const list = data?.filter(c => (cat === 'Todas' || c.category === cat) && c.name.toLowerCase().includes(q.toLowerCase()) && (!onlyFav || favs.has(c.id)))

  return (
    <Section id="cartas" title="Cartas potenciadoras" intro="Al cumplir rondas eliges una mejora para tu personaje, la linterna, los generadores o el arma." className="bg-panel/30">
      <div className="relative mb-10 flex min-h-60 items-end overflow-hidden rounded-3xl border border-line p-8 md:min-h-80"
        style={{ backgroundImage: 'linear-gradient(to right,#070F1D 5%,transparent 75%),url(/img/arma.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <p className="max-w-sm font-display text-4xl font-bold uppercase leading-none md:text-5xl">Adapta tu estrategia a cada ronda</p>
      </div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar carta" aria-label="Buscar carta" className={`${field} md:max-w-xs`} />
        <div className="flex flex-wrap gap-2">
          {cats.map(c => <button key={c} onClick={() => setCat(c)} className={chip(cat === c)}>{c}</button>)}
          <button onClick={() => setOnlyFav(v => !v)} aria-pressed={onlyFav} className={chip(onlyFav)}>♥ Favoritas</button>
        </div>
      </div>
      {error && <p className="text-accent">No se pudieron cargar las cartas. Revisa tu conexión.</p>}
      {!data && !error && <p className="text-muted">Cargando…</p>}
      {list?.length === 0 && <p className="text-muted">Sin resultados. Cambia el filtro o la búsqueda.</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {list?.map(c => (
          <article key={c.id} className="flex min-h-56 flex-col justify-between rounded-2xl border border-line bg-gradient-to-b from-panel to-ink p-5 transition hover:-translate-y-1 hover:border-accent">
            <div className="flex items-start justify-between">
              <span className="text-sm font-medium text-accent">{c.category}</span>
              <button onClick={() => favs.toggle(c.id)} aria-pressed={favs.has(c.id)} aria-label={`Favorita: ${c.name}`} className="text-xl text-accent">{favs.has(c.id) ? '♥' : '♡'}</button>
            </div>
            <div>
              <h3 className="font-display text-3xl font-bold uppercase leading-none">{c.name}</h3>
              <p className="mt-2 text-sm text-muted">{c.effect}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}

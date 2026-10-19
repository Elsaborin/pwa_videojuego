import { Link } from 'react-router-dom'
import { Tag, Title, Muted } from '../components/ui'
import { useInstall } from '../hooks/useInstall'

const stats = [['10 min', 'por partida'], ['4', 'tipos de cartas'], ['3', 'recursos a vigilar']]
const items = [
  ['/juego', 'El juego', 'Historia, dinámicas y personajes.'],
  ['/cartas', 'Cartas potenciadoras', 'Mejoras para personaje, linterna, generadores y arma.'],
  ['/evento', 'Evento', 'Fecha, hora, lugar y registro.'],
]

export default function Home() {
  const { can, install } = useInstall()
  return (
    <div className="space-y-4 p-5">
      <Tag>Rogue-lite · Survival horror 3D</Tag>
      <div><Title>After Light</Title><Muted>Sobrevive a las oleadas que acechan en la oscuridad. La luz y la energía son tus recursos.</Muted></div>
      <div className="grid grid-cols-3 gap-2">
        {stats.map(([n, l]) => <div key={l} className="rounded-xl border border-line bg-panel/60 p-3"><p className="font-display text-2xl font-bold text-accent">{n}</p><p className="text-[11px] text-muted">{l}</p></div>)}
      </div>
      {items.map(([to, t, d]) => (
        <Link key={to} to={to} className="block rounded-xl border border-accent/60 bg-panel/60 p-4 transition active:scale-[.99]">
          <h2 className="font-display text-lg font-bold uppercase">{t}</h2>
          <p className="text-xs text-muted">{d}</p>
        </Link>
      ))}
      {can && <button onClick={install} className="w-full rounded-[10px] border border-line py-3 font-mono text-xs uppercase tracking-wider text-muted">Instalar app</button>}
    </div>
  )
}

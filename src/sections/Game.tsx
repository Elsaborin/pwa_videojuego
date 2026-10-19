import { Section } from '../components/ui'
import { getGame } from '../services/api'
import { useAsync } from '../hooks/useAsync'

export default function Game() {
  const { data: g, error } = useAsync(getGame)
  const msg = error ? 'No se pudo cargar el contenido. Revisa tu conexión.' : 'Cargando…'
  return (
    <>
      <Section id="juego" title="El juego">
        {g ? (
          <div className="grid gap-10 md:grid-cols-2">
            <p className="font-display text-5xl font-bold uppercase leading-none text-accent md:text-7xl">{g.tagline}</p>
            <div className="space-y-5 text-lg leading-relaxed text-muted">{g.story.map((p, i) => <p key={i}>{p}</p>)}</div>
          </div>
        ) : <p className="text-muted">{msg}</p>}
      </Section>
      <Section id="dinamicas" title="Cómo se juega" intro="Cinco ideas para sobrevivir 10 minutos." className="bg-panel/30">
        {g ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.mechanics.map(m => (
              <article key={m.title} className="rounded-2xl border border-line bg-panel/60 p-6 transition hover:-translate-y-1 hover:border-accent">
                <div className="mb-5 h-1 w-10 rounded bg-accent" />
                <h3 className="font-display text-2xl font-bold uppercase leading-tight">{m.title}</h3>
                <p className="mt-2 text-muted">{m.text}</p>
              </article>
            ))}
          </div>
        ) : <p className="text-muted">{msg}</p>}
      </Section>
    </>
  )
}

import type { CSSProperties, PointerEvent } from 'react'
import { btn } from '../components/ui'

const stats = [['10 min', 'por partida'], ['4', 'tipos de cartas'], ['3', 'recursos a vigilar']]

// Arte de la portada: public/img/hero.jpg
export default function Hero() {
  const move = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  return (
    <section id="inicio" onPointerMove={move} style={{ '--x': '70%', '--y': '35%' } as CSSProperties}
      className="relative flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden px-5">
      <div aria-hidden className="absolute inset-y-0 right-0 w-full opacity-40 md:w-1/2 md:opacity-100"
        style={{ backgroundImage: 'url(/img/hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center top', WebkitMaskImage: 'linear-gradient(to left,#000 45%,transparent)', maskImage: 'linear-gradient(to left,#000 45%,transparent)' }} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      <div className="beam absolute inset-0" />
      <div className="relative mx-auto w-full max-w-6xl py-16">
        <p className="text-sm text-muted">Rogue-lite · Survival horror 3D</p>
        <h1 className="mt-4 font-display text-[clamp(4.5rem,17vw,13rem)] font-extrabold uppercase leading-[.85]">After<br /><span className="text-accent">Light</span></h1>
        <p className="mt-6 max-w-xl text-lg text-muted md:text-xl">La luz es tu única arma. Repara generadores, debilita a los enemigos y sobrevive 10 minutos en la oscuridad.</p>
        <div className="mt-8 flex flex-wrap gap-3"><a href="#juego" className={btn()}>Conocer el juego</a><a href="#evento" className={btn(true)}>Ver el evento</a></div>
        <dl className="mt-16 flex flex-wrap gap-x-14 gap-y-4 border-t border-line pt-6">
          {stats.map(([n, l]) => <div key={l}><dt className="font-display text-5xl font-bold">{n}</dt><dd className="text-sm text-muted">{l}</dd></div>)}
        </dl>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { btn } from './ui'
import { useInstall } from '../hooks/useInstall'

const links = [['#juego', 'El juego'], ['#dinamicas', 'Dinámicas'], ['#personajes', 'Personajes'], ['#cartas', 'Cartas'], ['#evento', 'Evento']]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { can, install } = useInstall()
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-ink/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#inicio" className="font-display text-2xl font-extrabold uppercase tracking-wide">After <span className="text-accent">Light</span></a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
          {links.map(([h, l]) => <a key={h} href={h} className="text-sm text-muted transition hover:text-snow">{l}</a>)}
          {can && <button onClick={install} className="text-sm text-muted hover:text-snow">Instalar app</button>}
          <a href="#registro" className={btn()}>Registrarme</a>
        </nav>
        <button className="grid size-10 place-items-center rounded-lg border border-line md:hidden" aria-label="Menú" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button>
      </div>
      {open && (
        <nav className="flex flex-col border-t border-line/60 px-5 py-2 md:hidden" aria-label="Móvil">
          {[...links, ['#registro', 'Registrarme']].map(([h, l]) => <a key={h} href={h} onClick={() => setOpen(false)} className="py-3 text-base text-muted hover:text-snow">{l}</a>)}
          {can && <button onClick={() => { install(); setOpen(false) }} className="py-3 text-left text-base text-muted">Instalar app</button>}
        </nav>
      )}
    </header>
  )
}

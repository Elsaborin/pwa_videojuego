import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import Hero from './sections/Hero'
import Game from './sections/Game'
import Characters from './sections/Characters'
import Cards from './sections/Cards'
import Event from './sections/Event'

export default function App() {
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false)
    window.addEventListener('online', on); window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])
  return (
    <>
      {!online && <p className="bg-dim px-4 py-1.5 text-center text-sm text-accent">Sin conexión. Mostrando datos guardados.</p>}
      <Nav />
      <main>
        <Hero />
        <Game />
        <Characters />
        <Cards />
        <Event />
      </main>
      <footer className="border-t border-line px-5 py-10 text-sm text-muted">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4">
          <p>After Light · Proyecto integrador · Ingeniería en Desarrollo y Gestión de Software, UT Cancún</p>
          <a href="#inicio" className="hover:text-snow">Volver arriba ↑</a>
        </div>
      </footer>
    </>
  )
}

import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Nav } from './components/ui'
import Welcome from './pages/Welcome'
import Home from './pages/Home'
import Game from './pages/Game'
import Cards from './pages/Cards'
import Event from './pages/Event'

function Layout() {
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false)
    window.addEventListener('online', on); window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])
  return (
    <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col border-x border-line/40 bg-ink">
      {!online && <p className="bg-dim px-4 py-1.5 text-center text-xs text-accent">Sin conexión. Mostrando datos guardados.</p>}
      <main className="flex-1"><Outlet /></main>
      <Nav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route element={<Layout />}>
          <Route path="/inicio" element={<Home />} />
          <Route path="/juego" element={<Game />} />
          <Route path="/cartas" element={<Cards />} />
          <Route path="/evento" element={<Event />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

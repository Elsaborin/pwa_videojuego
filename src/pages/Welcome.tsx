import { useNavigate } from 'react-router-dom'
import { Btn, Tag } from '../components/ui'

// Para usar tu arte: guarda la imagen en public/img/hero.jpg
export default function Welcome() {
  const nav = useNavigate()
  return (
    <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col justify-end gap-3 p-6"
      style={{ backgroundImage: 'linear-gradient(to top,#070F1D 35%,transparent),radial-gradient(circle at 50% 22%,#5b1b36,transparent 50%),url(/img/hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Tag>Rogue-lite · Survival horror 3D</Tag>
      <h1 className="font-display text-6xl font-bold uppercase leading-none">After<br /><span className="text-accent">Light</span></h1>
      <p className="mb-3 text-sm text-muted">La luz es tu única arma. Repara generadores, debilita a los enemigos y sobrevive 10 minutos en la oscuridad.</p>
      <Btn onClick={() => nav('/inicio')}>Conocer el juego <span>→</span></Btn>
    </div>
  )
}

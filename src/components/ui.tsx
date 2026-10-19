import { NavLink, useNavigate } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

export const Tag = ({ children, className = '' }: { children: ReactNode; className?: string }) =>
  <p className={`font-mono text-[10px] uppercase tracking-widest text-accent ${className}`}>{children}</p>

export const Title = ({ children }: { children: ReactNode }) =>
  <h1 className="font-display text-[28px] font-bold uppercase leading-tight">{children}</h1>

export const Btn = ({ className = '', ...p }: ButtonHTMLAttributes<HTMLButtonElement>) =>
  <button {...p} className={`flex w-full items-center justify-between rounded-[10px] bg-accent px-4 py-3.5 font-mono text-xs font-medium uppercase tracking-wider text-white transition active:scale-[.98] disabled:opacity-40 ${className}`} />

export const Muted = ({ children }: { children: ReactNode }) => <p className="mt-1 text-sm text-muted">{children}</p>

export function Top({ title }: { title: string }) {
  const nav = useNavigate()
  return (
    <header className="flex items-center gap-3 px-5 pb-3 pt-5">
      <button aria-label="Volver" onClick={() => nav(-1)} className="grid size-9 place-items-center rounded-lg border border-accent/60 text-accent">‹</button>
      <span className="font-mono text-[11px] uppercase tracking-widest">{title}</span>
    </header>
  )
}

export const Hero = ({ image, children }: { image?: string; children?: ReactNode }) =>
  <div className="relative flex h-44 items-end overflow-hidden rounded-xl border border-line bg-panel p-4"
    style={{ backgroundImage: `linear-gradient(to top,#070F1D,transparent 70%),radial-gradient(circle at 70% 20%,#351B2A,transparent 60%)${image ? `,url(${image})` : ''}`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
    {children}
  </div>

const tabs = [['/inicio', 'Inicio', '⌂'], ['/juego', 'Juego', '◈'], ['/cartas', 'Cartas', '▤'], ['/evento', 'Evento', '◷']]
export const Nav = () => (
  <nav className="sticky bottom-0 z-10 flex border-t border-accent/60 bg-ink/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
    {tabs.map(([to, label, icon]) => (
      <NavLink key={to} to={to} className={({ isActive }) => `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] ${isActive ? 'text-accent' : 'text-muted'}`}>
        <span className="text-lg leading-none">{icon}</span>{label}
      </NavLink>
    ))}
  </nav>
)

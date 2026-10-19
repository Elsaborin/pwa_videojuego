import type { ButtonHTMLAttributes, ReactNode } from 'react'

export const btn = (ghost = false) =>
  `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition disabled:opacity-40 ${ghost ? 'border border-line text-snow hover:border-accent' : 'bg-accent text-white hover:brightness-110'}`

export const Btn = ({ ghost, className = '', ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { ghost?: boolean }) =>
  <button {...p} className={`${btn(ghost)} ${className}`} />

export const chip = (on: boolean) =>
  `rounded-full border px-4 py-1.5 text-sm transition ${on ? 'border-accent bg-accent text-white' : 'border-line text-muted hover:text-snow'}`

export const field = 'h-12 w-full rounded-xl border border-line bg-ink px-4 text-sm outline-none transition focus:border-accent'

export const Section = ({ id, title, intro, children, className = '' }: { id: string; title: string; intro?: string; children: ReactNode; className?: string }) => (
  <section id={id} className={`scroll-mt-16 px-5 py-20 md:py-28 ${className}`}>
    <div className="mx-auto max-w-6xl">
      <h2 className="font-display text-5xl font-extrabold uppercase leading-none md:text-7xl">{title}</h2>
      {intro && <p className="mt-4 max-w-2xl text-base text-muted md:text-lg">{intro}</p>}
      <div className="mt-10">{children}</div>
    </div>
  </section>
)

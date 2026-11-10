export type Card = { id: string; name: string; category: string; effect: string }
export type Character = { id: string; name: string; role: string; desc: string; image?: string }
export type Game = { title: string; tagline: string; story: string[]; mechanics: { title: string; text: string }[] }
export type EventInfo = { name: string; date: string; time: string; place: string; address: string; lat: number | null; lon: number | null }


const SB = import.meta.env.VITE_SUPABASE_URL as string | undefined
const KEY = import.meta.env.VITE_SUPABASE_KEY as string | undefined
const auth = { apikey: KEY ?? '', Authorization: `Bearer ${KEY}` }

// Google Apps Script: guarda a los suscriptores en Google Sheets y envía el correo de confirmación
const GS = import.meta.env.VITE_GOOGLE_SCRIPT_URL as string | undefined
export const MAIL = !!GS

// Lee de Supabase si hay credenciales; si no, de /public/data. Guarda copia para uso sin conexión.
async function load<T>(table: string, file: string): Promise<T[]> {
  const cache = 'dot:' + table
  try {
    const r = SB ? await fetch(`${SB}/rest/v1/${table}?select=*`, { headers: auth }) : await fetch(`/data/${file}`)
    if (!r.ok) throw new Error(String(r.status))
    const d = (await r.json()) as T[]
    localStorage.setItem(cache, JSON.stringify(d))
    return d
  } catch {
    const c = localStorage.getItem(cache)
    if (c) return JSON.parse(c) as T[]
    throw new Error('sin datos')
  }
}

export const getCards = () => load<Card>('cards', 'cards.json')
export const getCharacters = () => load<Character>('characters', 'characters.json')
export const getGame = async () => (await load<Game>('game', 'game.json'))[0]
export const getEvent = async () => (await load<EventInfo>('events', 'event.json'))[0]

// Registro y suscripción: se guarda en el dispositivo, en Google (correo de confirmación) y, si hay Supabase, también ahí
export async function saveRegistration(r: { name: string; email: string }) {
  const list = JSON.parse(localStorage.getItem('dot:reg') || '[]')
  localStorage.setItem('dot:reg', JSON.stringify([...list, { ...r, at: new Date().toISOString() }]))
  if (GS) {
    // Sin cabecera Content-Type para evitar la verificación previa (CORS) de Apps Script
    const res = await fetch(GS, { method: 'POST', body: JSON.stringify({ ...r, source: 'web' }) })
    const d = await res.json()
    if (!d.ok) throw new Error(d.error || 'no enviado')
  }
  if (SB) {
    const res = await fetch(`${SB}/rest/v1/registrations`, { method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify(r) })
    if (!res.ok) throw new Error('no enviado')
  }
}

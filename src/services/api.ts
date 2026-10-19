export type Card = { id: string; name: string; category: string; effect: string }
export type Character = { id: string; name: string; role: string; desc: string; image?: string }
export type Game = { title: string; tagline: string; story: string[]; mechanics: { title: string; text: string }[] }
export type EventInfo = { name: string; date: string; time: string; place: string; address: string; lat: number | null; lon: number | null }
export type Weather = { label: string; temp: number; rain: number | null }

const SB = import.meta.env.VITE_SUPABASE_URL as string | undefined
const KEY = import.meta.env.VITE_SUPABASE_KEY as string | undefined
const auth = { apikey: KEY ?? '', Authorization: `Bearer ${KEY}` }

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

// Registro al evento: se guarda en el dispositivo y, si hay Supabase, también en la nube
export async function saveRegistration(r: { name: string; email: string; role: string }) {
  const list = JSON.parse(localStorage.getItem('dot:reg') || '[]')
  localStorage.setItem('dot:reg', JSON.stringify([...list, { ...r, at: new Date().toISOString() }]))
  if (SB) {
    const res = await fetch(`${SB}/rest/v1/registrations`, { method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify(r) })
    if (!res.ok) throw new Error('no enviado')
  }
}

// Servicio externo: Open-Meteo (clima, sin API key)
export async function getWeather(lat: number, lon: number, date?: string): Promise<Weather> {
  const u = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=auto`
  if (date) {
    const r = await fetch(`${u}&daily=temperature_2m_max,precipitation_probability_max&start_date=${date}&end_date=${date}`)
    if (r.ok) {
      const d = (await r.json()).daily
      return { label: 'Pronóstico del evento', temp: d.temperature_2m_max[0], rain: d.precipitation_probability_max[0] }
    }
  }
  const d = await (await fetch(`${u}&current=temperature_2m`)).json()
  return { label: 'Clima actual en la sede', temp: d.current.temperature_2m, rain: null }
}

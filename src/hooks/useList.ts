import { useState } from 'react'

// Lista guardada en el dispositivo (favoritos y búsquedas recientes)
export function useList(key: string) {
  const [list, set] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] } })
  const save = (n: string[]) => { localStorage.setItem(key, JSON.stringify(n)); set(n) }
  return {
    list,
    has: (id: string) => list.includes(id),
    toggle: (id: string) => save(list.includes(id) ? list.filter(x => x !== id) : [id, ...list]),
    push: (id: string) => save([id, ...list.filter(x => x !== id)].slice(0, 5)),
  }
}

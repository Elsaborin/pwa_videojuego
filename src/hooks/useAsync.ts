import { useEffect, useState } from 'react'

export function useAsync<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T>()
  const [error, setError] = useState(false)
  useEffect(() => { fn().then(setData).catch(() => setError(true)) }, [])
  return { data, error }
}

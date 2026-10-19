import { useEffect, useState } from 'react'

let deferred: any = null
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e })

export function useInstall() {
  const [can, setCan] = useState(!!deferred)
  useEffect(() => {
    const h = () => setCan(true)
    window.addEventListener('beforeinstallprompt', h)
    return () => window.removeEventListener('beforeinstallprompt', h)
  }, [])
  return { can, install: async () => { await deferred?.prompt(); deferred = null; setCan(false) } }
}

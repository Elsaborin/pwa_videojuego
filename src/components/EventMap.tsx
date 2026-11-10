import { useEffect, useRef, useState } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

type Props = { lat: number; lon: number; title: string }

// Token público de Mapbox (empieza con "pk."). Se define en .env y en las variables de Railway.
const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined

// Mapa de Mapbox (estilo oscuro) con la sede en el centro.
// La librería se descarga solo cuando se muestra el mapa, para que la página cargue rápido.
export default function EventMap({ lat, lon, title }: Props) {
  const box = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(TOKEN ? 'loading' : 'error')

  useEffect(() => {
    if (!TOKEN) {
      console.warn('Falta la variable VITE_MAPBOX_TOKEN: el mapa no se puede mostrar.')
      return
    }
    let map: MapboxMap | undefined
    let cancelled = false

    import('mapbox-gl')
      .then(({ default: mapboxgl }) => {
        if (cancelled || !box.current) return
        map = new mapboxgl.Map({
          accessToken: TOKEN,
          container: box.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [lon, lat], // Mapbox usa [longitud, latitud]
          zoom: 16,
          cooperativeGestures: true, // la rueda y el dedo siguen moviendo la página
          locale: {
            'ScrollZoomBlocker.CtrlMessage': 'Usa Ctrl + rueda para hacer zoom en el mapa',
            'ScrollZoomBlocker.CmdMessage': 'Usa ⌘ + rueda para hacer zoom en el mapa',
            'TouchPanBlocker.Message': 'Usa dos dedos para mover el mapa',
          },
        })
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-left')

        const pin = document.createElement('div')
        pin.className = 'map-pin'
        pin.title = title
        new mapboxgl.Marker({ element: pin }).setLngLat([lon, lat]).addTo(map)

        map.on('load', () => setStatus('ready'))
        map.on('error', () => setStatus(s => (s === 'ready' ? s : 'error')))
      })
      .catch(() => setStatus('error'))

    return () => {
      cancelled = true
      map?.remove()
    }
  }, [lat, lon, title])

  return (
    <div role="group" aria-label={`Mapa: ${title}`} className="relative h-72 w-full overflow-hidden rounded-3xl border border-line bg-panel md:h-80">
      <div ref={box} className="h-full w-full" />
      {status !== 'ready' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-panel px-6 text-center text-sm text-muted" role="status">
          {status === 'loading' ? 'Cargando mapa…' : 'El mapa no está disponible en este momento. Usa el botón «Cómo llegar».'}
        </div>
      )}
    </div>
  )
}
import { CircleMarker, LayersControl, MapContainer, Popup, TileLayer, Tooltip as LeafletTooltip } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { formatFcfaCourt } from '../../utils/format'

export interface MapPoint {
  id: string
  latitude: number
  longitude: number
  libelle: string
  sousTitre?: string
  montant?: number
  couche: 'PROJETS' | 'INFRASTRUCTURES' | 'REQUETES'
  tone?: 'ok' | 'alerte' | 'critique'
  href?: string
}

const couleurs = { ok: '#0f766e', alerte: '#b45309', critique: '#be123c' }

/** Carte SIG réutilisée par le module SIG, les fiches projet et les territoires. */
export function SigMap({
  points,
  center = [9.87, -6.47],
  zoom = 8,
  height = 460,
}: {
  points: MapPoint[]
  center?: [number, number]
  zoom?: number
  height?: number
}) {
  const couches: MapPoint['couche'][] = ['PROJETS', 'INFRASTRUCTURES', 'REQUETES']
  return (
    <div className="overflow-hidden rounded-lg border border-ink-200" style={{ height }}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LayersControl position="topright">
          {couches.map((couche) => {
            const subset = points.filter((p) => p.couche === couche)
            if (subset.length === 0) return null
            return (
              <LayersControl.Overlay key={couche} checked name={`${couche.charAt(0)}${couche.slice(1).toLowerCase()} (${subset.length})`}>
                <div>
                  {subset.map((p) => (
                    <CircleMarker
                      key={p.id}
                      center={[p.latitude, p.longitude]}
                      radius={couche === 'INFRASTRUCTURES' ? 5 : 7}
                      pathOptions={{
                        color: couleurs[p.tone ?? 'ok'],
                        fillColor: couleurs[p.tone ?? 'ok'],
                        fillOpacity: 0.55,
                        weight: 1.5,
                      }}
                    >
                      <LeafletTooltip>{p.libelle}</LeafletTooltip>
                      <Popup>
                        <p className="text-sm font-semibold">{p.libelle}</p>
                        {p.sousTitre && <p className="text-xs text-ink-600">{p.sousTitre}</p>}
                        {p.montant !== undefined && <p className="mt-1 text-xs">Investissement : {formatFcfaCourt(p.montant)}</p>}
                        {p.href && (
                          <Link to={p.href} className="mt-2 inline-block text-xs font-medium text-brand-700 underline">
                            Ouvrir la fiche
                          </Link>
                        )}
                      </Popup>
                    </CircleMarker>
                  ))}
                </div>
              </LayersControl.Overlay>
            )
          })}
        </LayersControl>
      </MapContainer>
    </div>
  )
}

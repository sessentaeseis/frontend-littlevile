import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import './leafletIcons.js'
import 'leaflet/dist/leaflet.css'
import './AvistamentosMap.css'

const CENTRO_PADRAO = [-27.5954, -48.548] // Florianópolis, só como fallback

function formatarData(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('pt-BR')
}

function AvistamentosMap({ avistamentos = [], altura = 420, zoom = 12 }) {
  const comCoordenadas = avistamentos.filter(
    (a) =>
      typeof a.latitude === 'number' &&
      typeof a.longitude === 'number' &&
      !Number.isNaN(a.latitude) &&
      !Number.isNaN(a.longitude)
  )

  const centro =
    comCoordenadas.length > 0
      ? [comCoordenadas[0].latitude, comCoordenadas[0].longitude]
      : CENTRO_PADRAO

  return (
    <div className="map-shell" style={{ height: altura }}>
      <MapContainer
        center={centro}
        zoom={zoom}
        scrollWheelZoom
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {comCoordenadas.map((a) => (
          <Marker key={a.id} position={[a.latitude, a.longitude]}>
            <Popup>
              <strong>{a.titulo}</strong>
              <br />
              {a.criatura} · {a.localizacao}
              <br />
              {formatarData(a.data)} · Confiança {a.confianca}%
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {comCoordenadas.length === 0 && (
        <div className="map-empty-overlay">
          Nenhum avistamento com localização real cadastrada ainda.
        </div>
      )}
    </div>
  )
}

export default AvistamentosMap

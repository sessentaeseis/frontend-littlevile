import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import './leafletIcons.js'
import 'leaflet/dist/leaflet.css'
import './AvistamentosMap.css'

const CENTRO_PADRAO = [-27.5954, -48.548]

function ClickHandler({ onSelecionar }) {
  useMapEvents({
    click(e) {
      onSelecionar(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function LocationPicker({ latitude, longitude, onChange }) {
  const [erroGeo, setErroGeo] = useState('')
  const [buscandoGeo, setBuscandoGeo] = useState(false)

  const posicaoAtual =
    typeof latitude === 'number' && typeof longitude === 'number'
      ? [latitude, longitude]
      : null

  const usarLocalizacaoAtual = () => {
    if (!navigator.geolocation) {
      setErroGeo('Geolocalização não é suportada neste navegador.')
      return
    }
    setErroGeo('')
    setBuscandoGeo(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange(pos.coords.latitude, pos.coords.longitude)
        setBuscandoGeo(false)
      },
      () => {
        setErroGeo('Não foi possível obter sua localização atual.')
        setBuscandoGeo(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const limpar = () => onChange(null, null)

  return (
    <div>
      <div className="map-picker">
        <MapContainer
          center={posicaoAtual || CENTRO_PADRAO}
          zoom={posicaoAtual ? 14 : 11}
          scrollWheelZoom
          style={{ width: '100%', height: 220 }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onSelecionar={onChange} />
          {posicaoAtual && <Marker position={posicaoAtual} />}
        </MapContainer>
      </div>

      <div className="map-picker-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={usarLocalizacaoAtual}
          disabled={buscandoGeo}
        >
          {buscandoGeo ? 'Localizando...' : '📍 Usar minha localização atual'}
        </button>
        {posicaoAtual && (
          <button type="button" className="btn-link" onClick={limpar}>
            Remover ponto no mapa
          </button>
        )}
        {posicaoAtual && (
          <span className="map-picker-coords">
            {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </span>
        )}
      </div>
      <p className="map-picker-hint">
        Clique no mapa para marcar o local exato do avistamento (opcional, mas
        recomendado para aparecer no Mapa).
      </p>
      {erroGeo && <div className="form-error">{erroGeo}</div>}
    </div>
  )
}

export default LocationPicker

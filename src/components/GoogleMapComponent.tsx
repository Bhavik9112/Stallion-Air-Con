import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { useState } from 'react'

const mapContainerStyle = {
  width: '100%',
  height: '450px'
}

// Stallion Air Con business location coordinates
const defaultCenter = {
  lat: 20.3603109, 
  lng: 72.93100989999999
}

interface GoogleMapComponentProps {
  center?: {
    lat: number
    lng: number
  }
  zoom?: number
  markerTitle?: string
}

export default function GoogleMapComponent({ 
  center = defaultCenter, 
  zoom = 15,
  markerTitle = 'Stallion Air Con'
}: GoogleMapComponentProps) {
  const [showInfoWindow, setShowInfoWindow] = useState(true)
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCO0kKndUNlmQi3B5mxy4dblg_8WYcuKuk'

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        <Marker
          position={center}
          onClick={() => setShowInfoWindow(!showInfoWindow)}
          title={markerTitle}
        />
        {showInfoWindow && (
          <InfoWindow
            position={center}
            onCloseClick={() => setShowInfoWindow(false)}
          >
            <div className="p-2">
              <h3 className="font-bold text-primary mb-1">{markerTitle}</h3>
              <p className="text-sm text-gray-600">C-5/37 Commercial Zone</p>
              <p className="text-sm text-gray-600">Ritesh Shopping Center, G.I.D.C Char Rasta</p>
              <p className="text-sm text-gray-600">Vapi, Gujarat</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  )
}

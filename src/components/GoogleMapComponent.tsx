import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { useState, useEffect } from 'react'

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
  address?: string
}

export default function GoogleMapComponent({ 
  center = defaultCenter, 
  zoom = 15,
  markerTitle = 'Stallion Air Con',
  address
}: GoogleMapComponentProps) {
  const [showInfoWindow, setShowInfoWindow] = useState(true)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(center)
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCO0kKndUNlmQi3B5mxy4dblg_8WYcuKuk'

  useEffect(() => {
    // If an address is provided, try to geocode it to coordinates using the Maps JS Geocoder.
    if (!address) {
      setMapCenter(center)
      return
    }

    // Ensure google maps script has loaded
    const tryGeocode = () => {
      // @ts-ignore
      if (typeof window === 'undefined' || !(window as any).google || !(window as any).google.maps || !(window as any).google.maps.Geocoder) {
        // If google is not available yet, skip (LoadScript will load it and effect may re-run)
        return
      }

      // @ts-ignore
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ address }, (results: any, status: string) => {
        if (status === 'OK' && results && results[0]) {
          const loc = results[0].geometry.location
          setMapCenter({ lat: loc.lat(), lng: loc.lng() })
        } else {
          console.warn('Google Maps geocode failed:', status)
        }
      })
    }

    tryGeocode()
  }, [address, center])

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={zoom}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        <Marker
          position={mapCenter}
          onClick={() => setShowInfoWindow(!showInfoWindow)}
          title={markerTitle}
        />
        {showInfoWindow && (
          <InfoWindow
            position={mapCenter}
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

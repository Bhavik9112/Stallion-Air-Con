// Global type declarations to fix library compatibility issues

declare module '@react-google-maps/api' {
  import { ComponentType } from 'react'
  
  export const LoadScript: ComponentType<{
    googleMapsApiKey: string
    children?: React.ReactNode
  }>
  
  export const GoogleMap: ComponentType<{
    mapContainerStyle: React.CSSProperties
    center: { lat: number; lng: number }
    zoom: number
    options?: any
    children?: React.ReactNode
  }>
  
  export const Marker: ComponentType<{
    position: { lat: number; lng: number }
    onClick?: () => void
    title?: string
    children?: React.ReactNode
  }>
  
  export const InfoWindow: ComponentType<{
    position: { lat: number; lng: number }
    onCloseClick?: () => void
    children?: React.ReactNode
  }>
}

declare module 'react-helmet-async' {
  import { ComponentType } from 'react'
  
  export const HelmetProvider: ComponentType<{
    children?: React.ReactNode
  }>
  
  export const Helmet: ComponentType<{
    children?: React.ReactNode
  }>
}
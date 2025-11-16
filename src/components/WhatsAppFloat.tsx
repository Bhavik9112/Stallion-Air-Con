import { MessageCircle } from 'lucide-react'

export default function WhatsAppFloat() {
  const whatsappNumber = "918866004475" // Phone number without +91 prefix
  const whatsappMessage = encodeURIComponent("Hi! I'm interested in your HVAC products and services. Can you help me with more information?")
  
  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={32} className="group-hover:animate-pulse" />
        
        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat on WhatsApp
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
        </div>
      </button>
    </div>
  )
}
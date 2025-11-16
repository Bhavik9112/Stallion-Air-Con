import { Mail, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Stallion Air Con</h3>
            <p className="text-gray-300 mb-4">
              Your trusted partner for HVAC solutions and spare parts. Quality products, reliable service, and expert support.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-secondary transition">Home</Link></li>
              <li><Link to="/categories" className="text-gray-300 hover:text-secondary transition">Products</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-secondary transition">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-secondary transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail size={20} className="mt-1 flex-shrink-0 text-secondary" />
                <span className="text-gray-300">stallionaircon@gmail.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone size={20} className="mt-1 flex-shrink-0 text-secondary" />
                <span className="text-gray-300">+91 8866004475</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="mt-1 flex-shrink-0 text-secondary" />
                <span className="text-gray-300">HVAC Industrial Area, Business District</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-light mt-8 pt-6 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Stallion Air Con. All rights reserved. | Developed by Bhavik Nahar </p>
        </div>
      </div>
    </footer>
  )
}

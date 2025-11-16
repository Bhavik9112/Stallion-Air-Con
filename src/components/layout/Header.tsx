import { Link } from 'react-router-dom'
import { Search, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/assets/Modern_Blue_Business_Crad_Industries-removebg-preview.png" alt="Stallion Air Con" className="h-12" />
            <div>
              <h1 className="text-2xl font-bold text-primary">Stallion Air Con</h1>
              <p className="text-xs text-gray-text">HVAC Solutions & Spare Parts</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-primary hover:text-secondary font-medium transition">Home</Link>
            <Link to="/categories" className="text-primary hover:text-secondary font-medium transition">Products</Link>
            <Link to="/about" className="text-primary hover:text-secondary font-medium transition">About</Link>
            <Link to="/contact" className="text-primary hover:text-secondary font-medium transition">Contact</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary w-64"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-text hover:text-primary">
                <Search size={20} />
              </button>
            </form>
          </div>

          <button 
            className="md:hidden text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-primary hover:text-secondary font-medium transition">Home</Link>
              <Link to="/categories" className="text-primary hover:text-secondary font-medium transition">Products</Link>
              <Link to="/about" className="text-primary hover:text-secondary font-medium transition">About</Link>
              <Link to="/contact" className="text-primary hover:text-secondary font-medium transition">Contact</Link>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary w-full"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-text">
                  <Search size={20} />
                </button>
              </form>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

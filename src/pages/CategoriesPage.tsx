import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { supabase } from '../lib/supabase'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  display_order: number
  image_url: string | null
}

  const getCategoryBackground = (category: Category): string => {
    // First check if category has a custom image_url set in admin
    if (category.image_url) {
      return category.image_url
    }
    
    // Fall back to default mapping
    return categoryBackgrounds[category.slug] || categoryBackgrounds.default
  }
const categoryBackgrounds: { [key: string]: string } = {
  'air-conditioning-spare-parts': '/assets/air-conditioning-spare-parts.jpg',
  'alfa-laval-brazed-heat-exchangers': '/assets/cooling-systems.jpg',
  'axial-fans-motors': '/assets/axial-fans.jpg',
  'compressors-accessories': '/assets/compressors.jpg',
  'cold-chain-solutions': '/assets/cooling-systems.jpg',
  'flow-controls': '/assets/components.jpg',
  'refrigerants': '/assets/refrigerants.jpg',
  'oils-cleaning-chemicals': '/assets/components.jpg',
  'split-air-conditioning-parts': '/assets/air-conditioning-spare-parts.jpg',
  'copper-tubes-fittings': '/assets/components.jpg',
  'vacuum-pumps': '/assets/compressors.jpg',
  'tools-recovery-units': '/assets/components.jpg',
  // Additional category variations
  'refrigerator-spare-parts': '/assets/components.jpg',
  'washing-machine-spare-parts': '/assets/components.jpg',
  'deep-freezer-spare-parts': '/assets/cooling-systems.jpg',
  'expansion-valves-controls': '/assets/components.jpg',
  'filter-drier-system-protectors': '/assets/components.jpg',
  'solenoid-valves-coils': '/assets/components.jpg',
  'oil-controls': '/assets/components.jpg',
  'pressure-temperature-controls': '/assets/components.jpg',
  'accumulators': '/assets/components.jpg',
  'moisture-indicators': '/assets/components.jpg',
  'pressure-transmitters': '/assets/components.jpg',
  'reciprocating-compressor': '/assets/compressors.jpg',
  'scroll-compressors': '/assets/compressors.jpg',
  'hermetic-compressors': '/assets/compressors.jpg',
  'rotary-compressors': '/assets/compressors.jpg',
  // Default fallback image
  'default': '/assets/air-conditioning-spare-parts.jpg'
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    setLoading(true)
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })

    if (data) setCategories(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div 
        className="relative text-white py-16"
        style={{
          backgroundImage: `linear-gradient(rgba(27, 68, 109, 0.9), rgba(27, 68, 109, 0.8)), url(/assets/612-9H2YglL._AC_UF1000,1000_QL80_.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-primary-medium/80"></div>
        <div className="relative container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Product Categories</h1>
          <p className="text-xl md:text-2xl text-gray-100 max-w-3xl">
            Explore our comprehensive range of HVAC spare parts, components, and solutions
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
              style={{
                backgroundImage: `linear-gradient(rgba(27, 68, 109, 0.85), rgba(27, 68, 109, 0.85)), url(${getCategoryBackground(category)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Background image with overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary-medium/90 group-hover:from-primary/95 group-hover:via-primary/90 group-hover:to-primary-medium/95 transition-all duration-300"></div>
              
              {/* Content */}
              <div className="relative p-8 h-48 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-secondary transition-colors duration-300">
                    {category.name}
                  </h2>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {category.description || 'Explore our comprehensive range of products and solutions in this category'}
                  </p>
                </div>
                
                <div className="mt-4 flex items-center text-white group-hover:text-secondary transition-colors duration-300">
                  <span className="text-sm font-semibold">View Products</span>
                  <svg 
                    className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white rounded-full"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}

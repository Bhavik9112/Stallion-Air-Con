import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { PackageSearch, Search } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { supabase } from '../lib/supabase'

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
}

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(query)

  useEffect(() => {
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    }
  }, [query])

  async function performSearch(searchTerm: string) {
    if (!searchTerm.trim()) return

    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })

    if (data) setProducts(data)
    setLoading(false)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <Layout>
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Search Products</h1>
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search for HVAC parts, compressors, fans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-6 pr-14 py-4 text-lg text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-secondary text-white p-2 rounded-lg hover:bg-primary-medium transition">
              <Search size={24} />
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <PackageSearch size={64} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              {query ? 'No products found' : 'Start searching'}
            </h2>
            <p className="text-gray-text">
              {query ? 'Try different keywords or browse our categories' : 'Enter a search term to find products'}
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-primary mb-6">
              Found {products.length} product{products.length !== 1 ? 's' : ''} for "{query}"
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <PackageSearch size={64} className="text-gray-400" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-text text-sm mb-4 line-clamp-2">{product.description}</p>
                    <span className="text-secondary font-semibold">View Details →</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

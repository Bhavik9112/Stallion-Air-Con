import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PackageSearch } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { supabase } from '../lib/supabase'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

interface Subcategory {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  subcategory_id: string | null
}

export default function CategoryDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [category, setCategory] = useState<Category | null>(null)
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) loadData()
  }, [slug])

  useEffect(() => {
    if (category) loadProducts()
  }, [category, selectedSubcategory])

  async function loadData() {
    setLoading(true)
    
    const { data: catData } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (catData) {
      setCategory(catData)
      
      const { data: subData } = await supabase
        .from('subcategories')
        .select('*')
        .eq('category_id', catData.id)
        .order('display_order', { ascending: true })
      
      if (subData) setSubcategories(subData)
    }
    
    setLoading(false)
  }

  async function loadProducts() {
    if (!category) return

    let query = supabase
      .from('products')
      .select('*')
      .eq('category_id', category.id)
      .eq('status', 'active')

    if (selectedSubcategory) {
      query = query.eq('subcategory_id', selectedSubcategory)
    }

    const { data } = await query.order('created_at', { ascending: false })
    if (data) setProducts(data)
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

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Category Not Found</h1>
          <Link to="/categories" className="text-secondary hover:underline">Back to Categories</Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold">{category.name}</h1>
          {category.description && (
            <p className="text-xl mt-4 text-gray-200">{category.description}</p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Filter by Subcategory</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSubcategory(null)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedSubcategory === null
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Products
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubcategory(sub.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedSubcategory === sub.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-20">
            <PackageSearch size={64} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Products Found</h3>
            <p className="text-gray-text">Check back soon for new products in this category.</p>
          </div>
        ) : (
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
        )}
      </div>
    </Layout>
  )
}

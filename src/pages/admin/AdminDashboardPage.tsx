import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Package, FolderTree, Building2, MessageSquare, LogOut } from 'lucide-react'
import ProtectedRoute from '../../components/ProtectedRoute'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

interface Stats {
  totalProducts: number
  totalCategories: number
  totalBrands: number
  pendingPriceQueries: number
  pendingGeneralQueries: number
}

export default function AdminDashboardPage() {
  const { user, signOut } = useAuth()
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCategories: 0,
    totalBrands: 0,
    pendingPriceQueries: 0,
    pendingGeneralQueries: 0
  })

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    const [products, categories, brands, generalQueries, priceQueries] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('categories').select('id', { count: 'exact', head: true }),
      supabase.from('brands').select('id', { count: 'exact', head: true }),
      supabase.from('queries').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('price_queries').select('id', { count: 'exact', head: true }).eq('status', 'pending')
    ])

    setStats({
      totalProducts: products.count || 0,
      totalCategories: categories.count || 0,
      totalBrands: brands.count || 0,
      pendingPriceQueries: priceQueries.count || 0,
      pendingGeneralQueries: generalQueries.count || 0
    })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-primary text-white p-4">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm">{user?.email}</span>
              <button onClick={signOut} className="flex items-center space-x-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <Package className="text-primary" size={32} />
                <span className="text-3xl font-bold text-primary">{stats.totalProducts}</span>
              </div>
              <h3 className="text-gray-700 font-semibold">Total Products</h3>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <FolderTree className="text-secondary" size={32} />
                <span className="text-3xl font-bold text-secondary">{stats.totalCategories}</span>
              </div>
              <h3 className="text-gray-700 font-semibold">Categories</h3>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <Building2 className="text-accent" size={32} />
                <span className="text-3xl font-bold text-accent">{stats.totalBrands}</span>
              </div>
              <h3 className="text-gray-700 font-semibold">Brands</h3>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <MessageSquare className="text-red-600" size={32} />
                <span className="text-3xl font-bold text-red-600">{stats.pendingPriceQueries}</span>
              </div>
              <h3 className="text-gray-700 font-semibold">Pending Price Queries</h3>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <LayoutDashboard className="text-primary" size={32} />
                <span className="text-3xl font-bold text-primary">{stats.pendingGeneralQueries}</span>
              </div>
              <h3 className="text-gray-700 font-semibold">Pending General Queries</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/admin/products" className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
              <Package className="text-primary mb-4" size={48} />
              <h2 className="text-2xl font-bold text-primary mb-2">Manage Products</h2>
              <p className="text-gray-text">Add, edit, or delete products from the catalog</p>
            </Link>

            <Link to="/admin/categories" className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
              <FolderTree className="text-secondary mb-4" size={48} />
              <h2 className="text-2xl font-bold text-primary mb-2">Manage Categories</h2>
              <p className="text-gray-text">Add, edit, or delete product categories</p>
            </Link>

            <Link to="/admin/subcategories" className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
              <FolderTree className="text-blue-600 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-primary mb-2">Manage Subcategories</h2>
              <p className="text-gray-text">Organize subcategories within categories</p>
            </Link>

            <Link to="/admin/brands" className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
              <Building2 className="text-accent mb-4" size={48} />
              <h2 className="text-2xl font-bold text-primary mb-2">Manage Brands</h2>
              <p className="text-gray-text">Add and manage product brands</p>
            </Link>

            <Link to="/admin/queries" className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
              <MessageSquare className="text-red-600 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-primary mb-2">Price Queries</h2>
              <p className="text-gray-text">View and respond to customer price requests</p>
            </Link>

            <Link to="/admin/general-queries" className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
              <MessageSquare className="text-yellow-600 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-primary mb-2">General Queries</h2>
              <p className="text-gray-text">View contact form messages and general inquiries</p>
            </Link>

            <Link to="/" className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
              <LayoutDashboard className="text-green-600 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-primary mb-2">View Website</h2>
              <p className="text-gray-text">Preview the customer-facing website</p>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ProtectedRoute from '../../components/ProtectedRoute'
import { supabase } from '../../lib/supabase'

interface Brand {
  id: string
  name: string
  description: string | null
  created_at: string
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    loadBrands()
  }, [])

  async function loadBrands() {
    setLoading(true)
    const { data } = await supabase
      .from('brands')
      .select('*')
      .order('name', { ascending: true })

    if (data) setBrands(data)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      if (editingBrand) {
        const { error } = await supabase
          .from('brands')
          .update(formData)
          .eq('id', editingBrand.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('brands')
          .insert(formData)
        
        if (error) throw error
      }

      setShowAddForm(false)
      setEditingBrand(null)
      resetForm()
      loadBrands()
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Failed to save brand'))
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this brand?')) return

    try {
      const { error } = await supabase.from('brands').delete().eq('id', id)
      if (error) throw error
      loadBrands()
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Failed to delete brand'))
    }
  }

  function resetForm() {
    setFormData({
      name: '',
      description: ''
    })
  }

  function startEdit(brand: Brand) {
    setEditingBrand(brand)
    setFormData({
      name: brand.name,
      description: brand.description || ''
    })
    setShowAddForm(true)
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-primary text-white p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="flex items-center space-x-2 hover:text-secondary transition">
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </Link>
              <h1 className="text-2xl font-bold">Manage Brands</h1>
            </div>
            <button
              onClick={() => {
                resetForm()
                setEditingBrand(null)
                setShowAddForm(true)
              }}
              className="bg-secondary px-4 py-2 rounded-lg hover:bg-secondary/90 transition"
            >
              Add Brand
            </button>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <div key={brand.id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-primary mb-2">{brand.name}</h3>
                <p className="text-gray-text mb-4">{brand.description}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(brand)}
                    className="flex-1 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-primary transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddForm(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-3xl font-bold text-primary mb-6">{editingBrand ? 'Edit Brand' : 'Add New Brand'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary transition"
                >
                  {editingBrand ? 'Update Brand' : 'Add Brand'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingBrand(null)
                    resetForm()
                  }}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  )
}

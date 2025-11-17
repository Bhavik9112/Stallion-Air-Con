import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react'
import ProtectedRoute from '../../components/ProtectedRoute'
import { supabase } from '../../lib/supabase'
import { supabaseAdmin } from '../../lib/supabaseAdmin'

export default function AdminSubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSubcategory, setEditingSubcategory] = useState<any | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category_id: '',
    display_order: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    
    const [subcategoriesRes, categoriesRes] = await Promise.all([
      supabaseAdmin
        .from('subcategories')
        .select('*')
        .order('display_order', { ascending: true }),
      supabaseAdmin.from('categories').select('*')
    ])

    if (subcategoriesRes.data) setSubcategories(subcategoriesRes.data)
    if (categoriesRes.data) setCategories(categoriesRes.data)
    
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      if (!formData.category_id) {
        alert('Please select a category')
        return
      }

      const subcategoryData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        category_id: formData.category_id || null,
        display_order: formData.display_order || 0
      }

      if (editingSubcategory) {
        const { error } = await supabaseAdmin
          .from('subcategories')
          .update(subcategoryData)
          .eq('id', editingSubcategory.id)
        
        if (error) throw error
      } else {
        const { error } = await supabaseAdmin
          .from('subcategories')
          .insert([subcategoryData])
        
        if (error) throw error
      }

      setShowAddForm(false)
      setEditingSubcategory(null)
      resetForm()
      loadData()
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Failed to save subcategory'))
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this subcategory?')) return

    try {
      const { error } = await supabaseAdmin.from('subcategories').delete().eq('id', id)
      if (error) throw error
      loadData()
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Failed to delete subcategory'))
    }
  }

  function resetForm() {
    setFormData({
      name: '',
      slug: '',
      description: '',
      category_id: '',
      display_order: 0
    })
  }

  function startEdit(subcategory: any) {
    setEditingSubcategory(subcategory)
    setFormData({
      name: subcategory.name,
      slug: subcategory.slug,
      description: subcategory.description || '',
      category_id: subcategory.category_id || '',
      display_order: subcategory.display_order || 0
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
              <h1 className="text-2xl font-bold">Manage Subcategories</h1>
            </div>
            <button
              onClick={() => {
                resetForm()
                setEditingSubcategory(null)
                setShowAddForm(true)
              }}
              className="bg-secondary px-4 py-2 rounded-lg hover:bg-secondary/90 transition flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Subcategory</span>
            </button>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategory</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Display Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subcategories.map((subcategory) => (
                  <tr key={subcategory.id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{subcategory.name}</div>
                        <div className="text-sm text-gray-500">{subcategory.slug}</div>
                        {subcategory.description && (
                          <div className="text-xs text-gray-400 mt-1">{subcategory.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {subcategory.categories?.name || 'No Category'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {subcategory.display_order || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(subcategory.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => startEdit(subcategory)}
                        className="text-secondary hover:text-primary mr-4"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(subcategory.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowAddForm(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full p-8 my-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-3xl font-bold text-primary mb-6">{editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Subcategory Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Category *</label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary transition"
                >
                  {editingSubcategory ? 'Update Subcategory' : 'Add Subcategory'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingSubcategory(null)
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
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react'
import ProtectedRoute from '../../components/ProtectedRoute'
import { supabase } from '../../lib/supabase'
import { supabaseAdmin } from '../../lib/supabaseAdmin'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    display_order: 0,
    image_url: ''
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    setLoading(true)
    const { data } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })

    if (data) setCategories(data)
    setLoading(false)
  }

  async function handleImageUpload() {
    if (!imageFile) return null

    setUploading(true)
    try {
      // Generate a unique file name
      const timestamp = Date.now()
      const fileName = `category-${timestamp}-${imageFile.name}`
      const bucketName = 'images'
      const folderPath = `categories/${fileName}`

      // Upload directly to Supabase Storage bucket
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(folderPath, imageFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Construct the public URL from the uploaded file path
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(folderPath)

      if (!publicUrl) throw new Error('Failed to generate public URL for uploaded image')
      return publicUrl
    } catch (error: any) {
      console.error('Image upload error:', error)
      const msg = (error && (error.message || error.error || error.msg)) || String(error)
      // If the bucket doesn't exist, provide an automatic fallback by
      // storing the image as a base64 data URL in the database.
      if (String(msg).toLowerCase().includes('bucket not found')) {
        alert(
          'Warning: Storage bucket "images" not found. Falling back to storing image as a base64 data URL in the database.\n\n' +
            'Recommended: Create a public bucket named "images" in Supabase Storage to store files properly.'
        )

        // Create a data URL from the File and return it so caller will save it into the DB
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = (e) => reject(e)
          reader.readAsDataURL(imageFile)
        })

        return dataUrl
      }
      throw new Error(msg || 'Failed to upload image to storage')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      let imageUrl = editingCategory?.image_url || null
      
      if (imageFile) {
        imageUrl = await handleImageUpload()
      }

      const categoryData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description?.trim() || null,
        display_order: formData.display_order || 0,
        image_url: imageUrl || null
      }

      if (editingCategory) {
        const { error } = await supabaseAdmin
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id)
        
        if (error) throw error
      } else {
        const { error } = await supabaseAdmin
          .from('categories')
          .insert([categoryData])
        
        if (error) throw error
      }

      setShowAddForm(false)
      setEditingCategory(null)
      resetForm()
      loadCategories()
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Failed to save category'))
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this category? This will also delete all associated subcategories and products.')) return

    try {
      const { error } = await supabaseAdmin.from('categories').delete().eq('id', id)
      if (error) throw error
      loadCategories()
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Failed to delete category'))
    }
  }

  function resetForm() {
    setFormData({
      name: '',
      slug: '',
      description: '',
      display_order: 0,
      image_url: ''
    })
    setImageFile(null)
  }

  function startEdit(category: any) {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      display_order: category.display_order || 0,
      image_url: category.image_url || ''
    })
    setImageFile(null) // Reset file selection for new upload
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
              <h1 className="text-2xl font-bold">Manage Categories</h1>
            </div>
            <button
              onClick={() => {
                resetForm()
                setEditingCategory(null)
                setShowAddForm(true)
              }}
              className="bg-secondary px-4 py-2 rounded-lg hover:bg-secondary/90 transition flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Category</span>
            </button>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Display Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4">
                      {category.image_url ? (
                        <img 
                          src={category.image_url} 
                          alt={category.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.slug}</div>
                        {category.description && (
                          <div className="text-xs text-gray-400 mt-1">{category.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {category.display_order || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(category.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => startEdit(category)}
                        className="text-secondary hover:text-primary mr-4"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
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
            <h2 className="text-3xl font-bold text-primary mb-6">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Category Name *</label>
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
                <label className="block text-gray-700 font-semibold mb-2">Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                {formData.image_url && !imageFile && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">Current image:</p>
                    <img 
                      src={formData.image_url} 
                      alt="Current category image" 
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
                {imageFile && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">New image preview:</p>
                    <img 
                      src={URL.createObjectURL(imageFile)} 
                      alt="New category image" 
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
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
                  disabled={uploading}
                  className="flex-1 bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary transition disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : (editingCategory ? 'Update Category' : 'Add Category')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingCategory(null)
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

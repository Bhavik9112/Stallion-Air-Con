import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Edit, Trash2, Upload } from 'lucide-react'
import ProtectedRoute from '../../components/ProtectedRoute'
import { supabase } from '../../lib/supabase'
import { supabaseAdmin } from '../../lib/supabaseAdmin'

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  status: string
  created_at: string
}

// 💡 NEW: Define interface for Subcategories
interface Subcategory {
  id: string
  name: string
  category_id: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  // 💡 NEW: State to hold subcategories
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category_id: '',
    subcategory_id: '',
    brand_id: '',
    specifications: '{}',
    features: '',
    status: 'active',
    is_featured: false
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    
    // 💡 UPDATE: Added subcategoriesRes to the Promise.all
    const [productsRes, categoriesRes, brandsRes, subcategoriesRes] = await Promise.all([
      supabaseAdmin.from('products').select('*').order('created_at', { ascending: false }),
      supabaseAdmin.from('categories').select('*').order('display_order', { ascending: true }),
      supabaseAdmin.from('brands').select('*').order('name', { ascending: true }),
      // 💡 NEW: Fetch all subcategories
      supabaseAdmin.from('subcategories').select('id, name, category_id').order('name', { ascending: true }) 
    ])

    if (productsRes.data) setProducts(productsRes.data)
    if (categoriesRes.data) setCategories(categoriesRes.data)
    if (brandsRes.data) setBrands(brandsRes.data)
    // 💡 NEW: Update subcategories state
    if (subcategoriesRes.data) setSubcategories(subcategoriesRes.data as Subcategory[])
    
    setLoading(false)
  }

  // --- Image Upload and Submission Functions (No functional changes here) ---

  async function handleImageUpload() {
    if (!imageFile) return null

    setUploading(true)
    try {
      // Generate a unique file name
      const timestamp = Date.now()
      const fileName = `product-${timestamp}-${imageFile.name}`
      const bucketName = 'images'
      const folderPath = `products/${fileName}`

      // Upload directly to Supabase Storage bucket using admin client
      // NOTE: This uses the service role client and should only be used in trusted/dev environments.
      const { data, error } = await supabaseAdmin.storage
        .from(bucketName)
        .upload(folderPath, imageFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Construct the public URL from the uploaded file path
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from(bucketName)
        .getPublicUrl(folderPath)

      if (!publicUrl) throw new Error('Failed to generate public URL for uploaded image')
      return publicUrl
    } catch (error: any) {
      console.error('Image upload error:', error)
      const msg = (error && (error.message || error.error || error.msg)) || String(error)
      // Fallback: when bucket missing, store image as base64 data URL in DB
      if (String(msg).toLowerCase().includes('bucket not found')) {
        alert(
          'Warning: Storage bucket "images" not found. Falling back to storing image as a base64 data URL in the database.\n\n' +
            'Recommended: Create a public bucket named "images" in Supabase Storage to store files properly.'
        )

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
      let imageUrl = editingProduct?.image_url || null
      
      if (imageFile) {
        imageUrl = await handleImageUpload()
      }

      // Fix UUID fields: convert empty strings to null for PostgreSQL UUID type
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        category_id: formData.category_id || null,
        subcategory_id: formData.subcategory_id || null, // Ensure this is sent!
        brand_id: formData.brand_id || null,
        image_url: imageUrl,
        specifications: JSON.parse(formData.specifications || '{}'),
        features: formData.features ? formData.features.split('\n').filter(f => f.trim()) : null,
        status: formData.status,
        is_featured: formData.is_featured
      }

      if (editingProduct) {
        const { error } = await supabaseAdmin
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
        
        if (error) throw error
      } else {
        const { error } = await supabaseAdmin
          .from('products')
          .insert(productData)
        
        if (error) throw error
      }

      setShowAddForm(false)
      setEditingProduct(null)
      resetForm()
      loadData()
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Failed to save product'))
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabaseAdmin.from('products').delete().eq('id', id)
      if (error) throw error
      loadData()
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Failed to delete product'))
    }
  }

  function resetForm() {
    setFormData({
      name: '',
      slug: '',
      description: '',
      category_id: '',
      subcategory_id: '',
      brand_id: '',
      specifications: '{}',
      features: '',
      status: 'active',
      is_featured: false
    })
    setImageFile(null)
  }

  function startEdit(product: Product) {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      category_id: (product as any).category_id || '',
      subcategory_id: (product as any).subcategory_id || '',
      brand_id: (product as any).brand_id || '',
      specifications: JSON.stringify((product as any).specifications || {}, null, 2),
      features: ((product as any).features || []).join('\n'),
      status: product.status,
      is_featured: (product as any).is_featured || false
    })
    setShowAddForm(true)
  }
  
  // 💡 NEW: Filter subcategories based on the currently selected main category
  const filteredSubcategories = subcategories.filter(
    subcat => subcat.category_id === formData.category_id
  );

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
      {/* ... (Admin Navigation Bar - Omitted for brevity) ... */}
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-primary text-white p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="flex items-center space-x-2 hover:text-secondary transition">
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </Link>
              <h1 className="text-2xl font-bold">Manage Products</h1>
            </div>
            <button
              onClick={() => {
                resetForm()
                setEditingProduct(null)
                setShowAddForm(true)
              }}
              className="bg-secondary px-4 py-2 rounded-lg hover:bg-secondary/90 transition flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Product</span>
            </button>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          {/* ... (Products Table - Omitted for brevity) ... */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {product.image_url && (
                          <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded mr-3" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(product.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => startEdit(product)}
                        className="text-secondary hover:text-primary mr-4"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddForm(false)}>
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-primary">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* ... (Product Name and Slug Fields - Omitted) ... */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Slug *</label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Field */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Category *</label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value, subcategory_id: '' })} // Reset subcategory when category changes
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* 💡 NEW: Subcategory Field (Dynamically shows/hides) */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Subcategory</label>
                    <select
                      value={formData.subcategory_id}
                      onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value })}
                      disabled={!formData.category_id || filteredSubcategories.length === 0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-sm disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      <option value="">
                        {formData.category_id ? (filteredSubcategories.length > 0 ? 'Select Subcategory' : 'No Subcategories') : 'Select Category First'}
                      </option>
                      {filteredSubcategories.map(subcat => (
                        <option key={subcat.id} value={subcat.id}>{subcat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Brand Field */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Brand</label>
                    <select
                      value={formData.brand_id}
                      onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                    >
                      <option value="">Select Brand</option>
                      {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Status Field */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Status *</label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>


                {/* ... (Image, Features, Specifications, Featured Checkbox - Omitted for brevity) ... */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Features (one per line)</label>
                    <textarea
                      rows={4}
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Specifications (JSON)</label>
                    <textarea
                      rows={4}
                      value={formData.specifications}
                      onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                      placeholder='{"Voltage": "220V", "Power": "1.5 HP"}'
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="is_featured" className="text-gray-700 font-semibold text-sm">Featured Product</label>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex space-x-4">
                <button
                  type="submit"
                  form="product-form"
                  disabled={uploading}
                  className="flex-1 bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary transition disabled:opacity-50"
                  onClick={(e) => {
                    e.preventDefault()
                    const form = document.querySelector('form') as HTMLFormElement
                    if (form) form.requestSubmit()
                  }}
                >
                  {uploading ? 'Uploading...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingProduct(null)
                    resetForm()
                  }}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  )
}
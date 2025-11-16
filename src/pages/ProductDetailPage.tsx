import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PackageSearch, FileText, Download, ArrowLeft } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { supabase } from '../lib/supabase'

interface Product {
  id: string
  name: string
  description: string | null
  specifications: any
  features: string[] | null
  image_url: string | null
  gallery_urls: string[] | null
  category_id: string
}

interface ProductFile {
  id: string
  file_type: string
  file_name: string
  file_url: string
  description: string | null
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [files, setFiles] = useState<ProductFile[]>([])
  const [loading, setLoading] = useState(true)
  const [showQueryForm, setShowQueryForm] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_company: '',
    message: '',
    quantity: 1
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  useEffect(() => {
    if (slug) loadProduct()
  }, [slug])

  async function loadProduct() {
    setLoading(true)
    
    const { data: prodData } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle()

    if (prodData) {
      setProduct(prodData)
      
      const { data: filesData } = await supabase
        .from('product_files')
        .select('*')
        .eq('product_id', prodData.id)
      
      if (filesData) setFiles(filesData)
    }
    
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!product) return

    setSubmitting(true)
    setSubmitMessage('')

    try {
      // Prepare the data with proper types
      const queryData = {
        product_id: product.id,
        customer_name: formData.customer_name.trim(),
        customer_email: formData.customer_email.trim(),
        customer_phone: formData.customer_phone.trim() || null,
        customer_company: formData.customer_company.trim() || null,
        message: formData.message.trim() || null,
        quantity: formData.quantity || 1,
        status: 'pending'
      }

      console.log('Submitting query data:', queryData)

      const { data, error } = await supabase
        .from('price_queries')
        .insert(queryData)
        .select()

      console.log('Insert result:', { data, error })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      setSubmitMessage('Your price request has been submitted successfully! We will contact you soon.')
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_company: '',
        message: '',
        quantity: 1
      })
      setTimeout(() => setShowQueryForm(false), 3000)
    } catch (error: any) {
      console.error('Form submission error:', error)
      setSubmitMessage(`Failed to submit request: ${error.message || 'Please try again.'}`)
    } finally {
      setSubmitting(false)
    }
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

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Product Not Found</h1>
          <Link to="/categories" className="text-secondary hover:underline">Back to Categories</Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/categories" className="inline-flex items-center text-secondary hover:text-primary mb-6 font-semibold">
          <ArrowLeft size={20} className="mr-2" />
          Back to Categories
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="bg-gray-200 rounded-lg overflow-hidden mb-4">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-96 object-cover" />
              ) : (
                <div className="w-full h-96 flex items-center justify-center">
                  <PackageSearch size={96} className="text-gray-400" />
                </div>
              )}
            </div>
            {product.gallery_urls && product.gallery_urls.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {product.gallery_urls.map((url, index) => (
                  <img key={index} src={url} alt={`${product.name} ${index + 1}`} className="w-full h-20 object-cover rounded" />
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-bold text-primary mb-4">{product.name}</h1>
            {product.description && (
              <p className="text-gray-text text-lg mb-6">{product.description}</p>
            )}

            <button
              onClick={() => setShowQueryForm(true)}
              className="bg-secondary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary transition text-lg mb-6 w-full md:w-auto"
            >
              Request Price Quote
            </button>

            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-primary mb-3">Features</h2>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-secondary mr-2">•</span>
                      <span className="text-gray-text">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.specifications && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-primary mb-3">Specifications</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex border-b border-gray-200 py-2 last:border-b-0">
                      <span className="font-semibold text-gray-700 w-1/3">{key}:</span>
                      <span className="text-gray-text w-2/3">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {files.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-primary mb-3">Downloads</h2>
                <div className="space-y-2">
                  {files.map((file) => (
                    <a
                      key={file.id}
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition"
                    >
                      <FileText className="text-secondary" size={24} />
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-700">{file.file_name}</p>
                        {file.description && <p className="text-sm text-gray-text">{file.description}</p>}
                      </div>
                      <Download className="text-gray-400" size={20} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showQueryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowQueryForm(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-3xl font-bold text-primary mb-6">Request Price Quote</h2>
            
            {submitMessage && (
              <div className={`mb-4 p-4 rounded-lg ${submitMessage.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {submitMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Product</label>
                <input
                  type="text"
                  value={product.name}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.customer_company}
                    onChange={(e) => setFormData({ ...formData, customer_company: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Message</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Additional details or requirements..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowQueryForm(false)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}

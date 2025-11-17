import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PackageSearch, FileText, Download, ArrowLeft, X } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { supabase } from '../lib/supabase'
import { submitMultiProductQuote } from '../services/quoteService' 

// --- INTERFACES ---
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

interface QuoteItem {
  productId: string
  name: string
  quantity: number
}

// --- INITIAL DATA ---
const initialCustomerData = {
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  customer_company: '',
  message: '',
}
const initialItem: QuoteItem = { productId: '', name: '', quantity: 1 }

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [files, setFiles] = useState<ProductFile[]>([])
  const [loading, setLoading] = useState(true)
  const [showQueryForm, setShowQueryForm] = useState(false)
  
  // --- STATE FOR QUOTE CART ---
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([])
  const [customerData, setCustomerData] = useState(initialCustomerData) 

  // --- STATE FOR SEARCH/AUTOCOMPLETE ---
  const [searchResults, setSearchResults] = useState<Array<{ id: string; name: string }>>([]) // Stores suggestions
  const [searchTerm, setSearchTerm] = useState('')
  const [searchIndex, setSearchIndex] = useState<number | null>(null) // Tracks which row is currently being searched

  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  // Prevent submission when any item lacks a selected product id or invalid quantity
  const hasInvalidItems = quoteItems.some(item => !item.productId || item.quantity <= 0)

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

      // Set the initial product into the quoteItems state
      setQuoteItems([{ productId: prodData.id, name: prodData.name, quantity: 1 }])
    }
    
    setLoading(false)
  }
  
  // --- NEW FUNCTION: PRODUCT SEARCH ---
  async function searchProducts(term: string) {
    if (term.length < 2) { 
      setSearchResults([]);
      return;
    }

    const { data, error } = await supabase
      .from('products')
      .select('id, name') 
      .ilike('name', `${term}%`) // Search products starting with the term
      .limit(10); 

    if (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
      return;
    }

    setSearchResults(data || []);
  }
  // --- END PRODUCT SEARCH FUNCTION ---

  // --- CART MANAGEMENT FUNCTIONS ---

  const addProductField = (e: React.MouseEvent) => {
    e.preventDefault() 
    setQuoteItems(prev => [...prev, initialItem])
    // Ensure the new row is initially ready for search
    setSearchIndex(quoteItems.length) 
  }

  const handleItemChange = (index: number, field: keyof QuoteItem, value: any) => {
    const newItems = [...quoteItems]
    newItems[index] = { ...newItems[index], [field]: value }
    
    // Convert quantity to number
    if (field === 'quantity') {
      newItems[index].quantity = parseInt(value) || 1
    }
    
    setQuoteItems(newItems)
  }

  const selectSuggestedProduct = (index: number, productResult: { id: string, name: string }) => {
    // 1. Update the specific item in the quote cart
    handleItemChange(index, 'productId', productResult.id)
    handleItemChange(index, 'name', productResult.name)
    
    // 2. Clear search states
    setSearchTerm('')
    setSearchResults([])
    setSearchIndex(null)
  }

  const removeItem = (index: number) => {
    setQuoteItems(quoteItems.filter((_, i) => i !== index))
  }

  // --- UPDATED SUBMISSION FUNCTION ---
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!product) return

    setSubmitting(true)
    setSubmitMessage('')

    const validItems = quoteItems.filter(item => item.productId && item.quantity > 0)
    
    if (validItems.length === 0) {
      setSubmitMessage('Please add at least one product with a valid quantity.')
      setSubmitting(false)
      return
    }

    try {
      const submissionData = {
        ...customerData,
        quoteItems: validItems
      }

      await submitMultiProductQuote(submissionData) 

      setSubmitMessage('Your price request has been submitted successfully! We will contact you soon.')
      setCustomerData(initialCustomerData)
      setQuoteItems([{ productId: product.id, name: product.name, quantity: 1 }]) 
      
      setTimeout(() => setShowQueryForm(false), 3000)
    } catch (error: any) {
      console.error('Form submission error:', error)
      setSubmitMessage(`Failed to submit request: ${error.message || 'Please try again.'}`)
    } finally {
      setSubmitting(false)
    }
  }

  // --- RENDER LOGIC (rest of component JSX remains mostly unchanged) ---

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
        {/* ... (Product details, images, features, etc. JSX) ... */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
           {/* ... Image/Gallery ... */}
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
          {/* ... */}
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

            {/* ... (Features, Specifications, Downloads JSX) ... */}
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

      {/* --- UPDATED QUOTE FORM MODAL --- */}
      {showQueryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowQueryForm(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full p-8 overflow-y-auto max-h-screen" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-3xl font-bold text-primary mb-6">Request Price Quote (Multi-Product)</h2>
            
            {submitMessage && (
              <div className={`mb-4 p-4 rounded-lg ${submitMessage.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {submitMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <h3 className="text-xl font-bold text-gray-800 pt-4">Products Requested</h3>
              
              {/* === DYNAMIC PRODUCT LIST (THE CART) === */}
              {quoteItems.map((item, index) => (
                <div key={index} className="border border-gray-200 p-4 rounded-lg space-y-3 relative">
                  <p className="font-semibold text-sm text-secondary">Item {index + 1}</p>
                  
                  {/* Product Field (Handles both static first item and searchable others) */}
                  <div className="relative">
                    <label className="block text-gray-700 font-semibold mb-1">Product</label>
                    
                    {index === 0 && product ? (
                        // Display the read-only name of the product from the current page
                        <input
                            type="text"
                            value={product.name}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        />
                    ) : (
                        // **SEARCH INPUT FOR ADDED ITEMS**
                        <>
                            <input
                                type="text"
                                placeholder="Type product name to search..."
                                value={item.name} 
                                onChange={(e) => {
                                    const term = e.target.value;
                                    handleItemChange(index, 'name', term);
                                    setSearchTerm(term);
                                    setSearchIndex(index);
                                    searchProducts(term); // Trigger search on change
                                }}
                                onFocus={() => setSearchIndex(index)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                required
                                disabled={submitting}
                            />

                            {/* --- DISPLAY SEARCH RESULTS --- */}
                            {searchIndex === index && searchTerm.length > 1 && searchResults.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 border border-gray-300 bg-white shadow-lg max-h-48 overflow-y-auto rounded-lg">
                                    {searchResults.map((result) => (
                                        <div
                                            key={result.id}
                                            className="p-3 cursor-pointer hover:bg-secondary/10"
                                            onClick={() => selectSuggestedProduct(index, result)}
                                        >
                                            {result.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* --- END SEARCH RESULTS --- */}
                        </>
                    )}
                  </div>
                  
                  {/* Quantity Field */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                      disabled={submitting}
                      required
                    />
                  </div>

                  {/* Inline validation hint when user typed a name but didn't select suggestion */}
                  {item.name && !item.productId && (
                    <p className="text-sm text-red-600">Please select a product from the suggestions list.</p>
                  )}

                  {/* Remove Button (Allow removal only for added products, not the initial product) */}
                  {index > 0 && (
                    <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                        disabled={submitting}
                    >
                        <X size={20} />
                    </button>
                  )}
                </div>
              ))}

              {/* Button to add more products */}
              <button
                type="button"
                onClick={addProductField}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition w-full disabled:opacity-50"
                disabled={submitting}
              >
                + Add Another Product
              </button>
              
              <h3 className="text-xl font-bold text-gray-800 pt-4">Your Contact Details</h3>
              {/* --- CUSTOMER DETAILS (JSX remains unchanged) --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={customerData.customer_name}
                    onChange={(e) => setCustomerData({ ...customerData, customer_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    disabled={submitting}
                  />
                </div>
                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={customerData.customer_email}
                    onChange={(e) => setCustomerData({ ...customerData, customer_email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Phone & Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    value={customerData.customer_phone}
                    onChange={(e) => setCustomerData({ ...customerData, customer_phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Company</label>
                  <input
                    type="text"
                    value={customerData.customer_company}
                    onChange={(e) => setCustomerData({ ...customerData, customer_company: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Message</label>
                <textarea
                  rows={4}
                  value={customerData.message}
                  onChange={(e) => setCustomerData({ ...customerData, message: e.target.value })}
                  placeholder="Additional details or requirements..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  disabled={submitting}
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={submitting || quoteItems.length === 0 || hasInvalidItems}
                  className="flex-1 bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Quote Request'}
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
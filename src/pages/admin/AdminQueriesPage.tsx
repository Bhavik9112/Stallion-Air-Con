import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Building2, Calendar, CheckCircle, Clock } from 'lucide-react'
import ProtectedRoute from '../../components/ProtectedRoute'
import { supabase } from '../../lib/supabase'

// --- INTERFACES ---
interface QuoteItemData {
  query_id: string; 
  quantity: number | null; 
  name: string | null;     
  product_id: string | null;
}

interface QuoteHeader {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  customer_company: string | null
  message: string | null
  status: string
  created_at: string
}

interface PriceQuery extends QuoteHeader {
  quote_items: QuoteItemData[]; 
}

export default function AdminQueriesPage() {
  const [queries, setQueries] = useState<PriceQuery[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'responded'>('all')

  useEffect(() => {
    loadQueries()
  }, [filter])

  // --- FINAL FIX: TWO-STEP DATA LOADING AND MANUAL JOIN ---
  async function loadQueries() {
    setLoading(true)
    
    // STEP 1: Fetch ALL price queries (simple SELECT, guaranteed to work)
    let headerQuery = supabase
      .from('price_queries')
      .select(`id, customer_name, customer_email, customer_phone, customer_company, message, status, created_at`)
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      headerQuery = headerQuery.eq('status', filter === 'pending' ? 'pending' : 'responded');
    }

    const { data: quotesData, error: quotesError } = await headerQuery;

    if (quotesError) {
      console.error('Error loading quotes (Step 1 Failed):', quotesError);
      alert(`Error loading quotes: ${quotesError.message}.`);
      setQueries([]);
      setLoading(false);
      return;
    }
    
    if (quotesData.length === 0) {
      setQueries([]);
      setLoading(false);
      return;
    }

    const quoteIds = quotesData.map(q => q.id);

    // STEP 2: Fetch ALL related quote items in a single batch request
    const { data: itemsData, error: itemsError } = await supabase
      .from('quote_items')
      .select(`query_id, quantity, name, product_id`) 
      .in('query_id', quoteIds); // Filter by the IDs fetched in Step 1

    if (itemsError) {
      console.warn('Warning: Could not load quote items (Step 2 Failed). Displaying customer headers only.', itemsError);
      // Fallback: Use only the customer data
      setQueries(quotesData.map(q => ({ ...q, quote_items: [] })) as PriceQuery[]);
      setLoading(false);
      return;
    }

    // STEP 3: Combine the data (Manual client-side JOIN)
    const combinedQueries = quotesData.map(quote => ({
      ...quote,
      // Attach the array of items related to this specific quote
      quote_items: itemsData.filter(item => item.query_id === quote.id)
    }));
    
    setQueries(combinedQueries as PriceQuery[]);
    setLoading(false);
  }

  // --- updateStatus and handleDelete functions remain the same ---
  async function updateStatus(id: string, status: string) {
    try {
      const { error } = await supabase
        .from('price_queries')
        .update({ 
          status,
          responded_at: status === 'responded' ? new Date().toISOString() : null
        })
        .eq('id', id)

      if (error) throw error
      loadQueries()
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Failed to update status'))
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this query?')) return

    try {
      const { error } = await supabase.from('price_queries').delete().eq('id', id)
      if (error) throw error
      loadQueries()
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Failed to delete query'))
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
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
              <h1 className="text-2xl font-bold">Price Queries</h1>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'all' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
            >
              All ({queries.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'pending' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('responded')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'responded' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
            >
              Responded
            </button>
          </div>

          <div className="space-y-4">
            {queries.map((query) => {
              const itemCount = query.quote_items.length;
              const firstItemName = itemCount > 0 
                ? (query.quote_items[0].name || 'Item')
                : 'No Items';
              const title = itemCount > 0 
                ? `Quote for ${firstItemName}${itemCount > 1 ? ` +${itemCount - 1} more` : ''}`
                : 'Single-Product/Old Query';

              return (
                <div key={query.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
                      <div className="flex items-center text-gray-text text-sm space-x-4">
                        <span className="flex items-center">
                          <Calendar size={16} className="mr-1" />
                          {new Date(query.created_at).toLocaleString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${query.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {query.status === 'pending' ? (
                            <span className="flex items-center"><Clock size={12} className="mr-1" />Pending</span>
                          ) : (
                            <span className="flex items-center"><CheckCircle size={12} className="mr-1" />Responded</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Customer Information (Unchanged) */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Customer Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <span className="font-medium w-24">Name:</span>
                          <span className="text-gray-text">{query.customer_name}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail size={14} className="mr-2 text-secondary" />
                          <a href={`mailto:${query.customer_email}`} className="text-secondary hover:underline">
                            {query.customer_email}
                          </a>
                        </div>
                        {query.customer_phone && (
                          <div className="flex items-center">
                            <Phone size={14} className="mr-2 text-secondary" />
                            <a href={`tel:${query.customer_phone}`} className="text-secondary hover:underline">
                              {query.customer_phone}
                            </a>
                          </div>
                        )}
                        {query.customer_company && (
                          <div className="flex items-center">
                            <Building2 size={14} className="mr-2 text-secondary" />
                            <span className="text-gray-text">{query.customer_company}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Request Details (Displaying multi-product list) */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Requested Items</h4>
                      <div className="space-y-2 text-sm bg-gray-50 p-3 rounded-lg">
                        
                        {itemCount > 0 ? (
                          query.quote_items.map((item, index) => (
                            <div key={index} className="flex justify-between border-b border-gray-200 pb-1 last:border-b-0">
                              <span className="font-medium text-gray-800">
                                {item.name || 'Product Missing Name'}
                              </span>
                              <span className="text-gray-text font-semibold">Qty: {item.quantity || 1}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No specific items found (Old single-product format).</p>
                        )}

                        {query.message && (
                          <div className="pt-3 border-t border-gray-200">
                            <span className="font-medium">Message:</span>
                            <p className="text-gray-text mt-1">{query.message}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 border-t pt-4">
                    {/* Action buttons (Unchanged) */}
                    {query.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(query.id, 'responded')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                      >
                        Mark as Responded
                      </button>
                    )}
                    {query.status === 'responded' && (
                      <button
                        onClick={() => updateStatus(query.id, 'pending')}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition text-sm font-semibold"
                      >
                        Mark as Pending
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(query.id)}
                      className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}

            {queries.length === 0 && !loading && (
              <div className="text-center py-20">
                <p className="text-gray-text text-lg">No queries found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
// src/services/quoteService.ts
import { supabase } from '../lib/supabase'

// Define the required data interfaces
interface QuoteItem {
  productId: string
  name: string
  quantity: number
}

interface SubmissionData {
  customer_name: string
  customer_email: string
  customer_phone: string | null
  customer_company: string | null
  message: string | null
  quoteItems: QuoteItem[]
}

/**
 * Submits the main quote and all associated product items in a two-step transaction.
 */
export async function submitMultiProductQuote(data: SubmissionData) {
  const { 
    customer_name, 
    customer_email, 
    customer_phone, 
    customer_company, 
    message, 
    quoteItems 
  } = data

  if (quoteItems.length === 0) {
    throw new Error("Cannot submit an empty quote request.")
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(customer_email)) {
    throw new Error("Please provide a valid email address.")
  }

  try {
    // --- STEP 1: Insert the main quote into 'price_queries' ---
    const { data: quote, error: quoteError } = await supabase
      .from('price_queries')
      .insert([{
        customer_name,
        customer_email,
        customer_phone,
        customer_company,
        message,
        status: 'pending'
      }])
      .select('id')
      .single()

    if (quoteError) {
      console.error('Quote insertion error:', quoteError)
      throw new Error('Failed to create quote. Please try again.')
    }

    const newQueryId = quote.id

    // --- STEP 2: Prepare and insert all items into 'quote_items' ---
    const itemsToInsert = quoteItems.map(item => ({
      query_id: newQueryId,
      product_id: item.productId,
      quantity: item.quantity,
      name: item.name
    }))

    const { error: itemsError } = await supabase
      .from('quote_items')
      .insert(itemsToInsert)

    if (itemsError) {
      console.error('Quote items insertion error:', itemsError)
      throw new Error('Failed to add products to quote. Please try again.')
    }

    return { success: true, queryId: newQueryId }
  } catch (error) {
    console.error('Quote submission error:', error)
    throw error
  }
}

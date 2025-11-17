// src/services/quoteService.ts

import { supabase } from '../lib/supabase'; // Adjust this path if your supabase client is elsewhere

// Define the required data interfaces
interface QuoteItem {
  productId: string;
  name: string;
  quantity: number;
}

interface SubmissionData {
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_company: string | null;
  message: string | null;
  quoteItems: QuoteItem[];
}

/**
 * Submits the main quote and all associated product items in a two-step transaction.
 */
export async function submitMultiProductQuote(data: SubmissionData) {
  const { customer_name, customer_email, customer_phone, customer_company, message, quoteItems } = data;

  if (quoteItems.length === 0) {
    throw new Error("Cannot submit an empty quote request.");
  }

  // Prefer server-side RPC for atomic insertion if available
  try {
    // Attempt to call an RPC that inserts header + items transactionally
    // Ensure RPC receives field names that match DB columns (snake_case).
    const rpcItems = quoteItems.map(item => ({
      product_id: item.productId,
      name: item.name,
      quantity: item.quantity
    }))

    const rpcParams = {
      p_customer_name: customer_name,
      p_customer_email: customer_email,
      p_customer_phone: customer_phone,
      p_customer_company: customer_company,
      p_message: message,
      p_items: JSON.stringify(rpcItems)
    }

    const { data: rpcData, error: rpcError } = await supabase.rpc('insert_price_query_with_items', rpcParams as any)

    if (rpcError) {
      console.warn('RPC insert failed, falling back to client-side inserts:', rpcError)
      throw rpcError
    }

    // rpcData may contain the new id (depending on the function return). Return success.
    return { success: true, id: rpcData }
  } catch (rpcErr) {
    // Fallback to two-step insert if RPC is not available or failed
    // --- STEP 1: Insert the main quote into 'price_queries' ---
    // Use first item's productId to populate legacy `product_id` column if required by DB schema
    const headerPayload: any = {
      customer_name: customer_name,
      customer_email: customer_email,
      customer_phone: customer_phone,
      customer_company: customer_company,
      message: message,
      status: 'pending'
    }

    if (quoteItems && quoteItems.length > 0 && quoteItems[0].productId) {
      headerPayload.product_id = quoteItems[0].productId
    }

    const { data: quote, error: quoteError } = await supabase
      .from('price_queries')
      .insert([headerPayload])
      .select('id') 
      .single();

    if (quoteError) {
      throw quoteError;
    }

    const newQueryId = quote.id;

    // --- STEP 2: Prepare and insert all items into 'quote_items' ---
    const itemsToInsert = quoteItems.map(item => ({
      query_id: newQueryId, // Link to the header quote
      product_id: item.productId,
      quantity: item.quantity,
      name: item.name 
    }));

    const { error: itemsError } = await supabase
      .from('quote_items')
      .insert(itemsToInsert);

    if (itemsError) {
      throw itemsError;
    }

    return { success: true, id: newQueryId };
  }
}
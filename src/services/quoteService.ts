// src/services/quoteService.ts

import { supabase } from '../lib/supabase'; // **CHECK THIS PATH**

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

  // --- STEP 1: Insert the main quote into 'price_queries' ---
  const { data: quote, error: quoteError } = await supabase
    .from('price_queries')
    .insert([{ 
      customer_name: customer_name, 
      customer_email: customer_email, 
      customer_phone: customer_phone,
      customer_company: customer_company,
      message: message,
      status: 'pending'
    }])
    .select('id') 
    .single();

  if (quoteError) {
    throw quoteError;
  }

  const newQueryId = quote.id;

  // --- STEP 2: Prepare and insert all items into 'quote_items' ---
  const itemsToInsert = quoteItems.map(item => ({
    query_id: newQueryId, 
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

  return { success: true };
}
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  brands: {
    id: string
    name: string
    description: string | null
    logo_url: string | null
    created_at: string
    updated_at: string
  }
  categories: {
    id: string
    name: string
    slug: string
    description: string | null
    display_order: number
    created_at: string
    updated_at: string
  }
  subcategories: {
    id: string
    category_id: string
    name: string
    slug: string
    description: string | null
    display_order: number
    created_at: string
    updated_at: string
  }
  products: {
    id: string
    category_id: string
    subcategory_id: string | null
    brand_id: string | null
    name: string
    slug: string
    description: string | null
    specifications: any
    features: string[] | null
    image_url: string | null
    gallery_urls: string[] | null
    is_featured: boolean
    status: string
    created_at: string
    updated_at: string
  }
  product_files: {
    id: string
    product_id: string
    file_type: string
    file_name: string
    file_url: string
    file_size: number | null
    description: string | null
    created_at: string
  }
  price_queries: {
    id: string
    customer_name: string
    customer_email: string
    customer_phone: string | null
    customer_company: string | null
    message: string | null
    status: string
    admin_response: string | null
    responded_at: string | null
    created_at: string
  }
  quote_items: {
    id: string
    query_id: string
    product_id: string
    name: string
    quantity: number
    created_at: string
  }
}

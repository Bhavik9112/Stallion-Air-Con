import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://rallutblkfunglmfodqk.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhbGx1dGJsa2Z1bmdsbWZvZHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzOTc4NTYsImV4cCI6MjA3Nzk3Mzg1Nn0.bTJ7K3LEUBNaucDH5lGscXPxefn5rwVXJVxjNV4rW48"

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
    product_id: string
    customer_name: string
    customer_email: string
    customer_phone: string | null
    customer_company: string | null
    message: string | null
    quantity: number | null
    status: string
    admin_response: string | null
    responded_at: string | null
    created_at: string
  }
}

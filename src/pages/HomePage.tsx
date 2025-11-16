import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer' 
import { ArrowRight, PackageSearch, Wrench, Award, Search } from 'lucide-react' 
import Layout from '../components/layout/Layout'
import { supabase } from '../lib/supabase'

// --- Interface Definitions ---
interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url?: string | null // Still needed for display component, but fetching is now safer
}

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  is_featured: boolean
}

// --- AnimatedSection Component ---
const AnimatedSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const animationClasses = inView
    ? 'opacity-100 translate-y-0 rotate-x-0' 
    : 'opacity-0 translate-y-6 rotate-x-6' 

  return (
    <div 
      ref={ref}
      className={`transform-style-preserve-3d perspective-1000 transition-all duration-1000 ease-out transform-origin-bottom ${animationClasses}`}
    >
      {children}
    </div>
  )
}

// --- HomePage Component ---
export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const HERO_IMAGE_URL = "https://static.vecteezy.com/system/resources/thumbnails/072/437/309/small/mechanical-blueprint-seamless-pattern-with-industrial-cutter-line-drawings-technical-background-for-manufacturing-and-design-projects-vector.jpg";

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    // 💥 FIX APPLIED HERE: Reverted to select('*') for maximum compatibility
    const { data: cats } = await supabase
      .from('categories')
      .select('*') 
      .order('display_order', { ascending: true })
      .limit(6)

    const { data: prods } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('status', 'active')
      .limit(4)

    // Ensure type casting for safe state update
    if (cats) setCategories(cats as Category[])
    if (prods) setFeaturedProducts(prods as Product[])
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <Layout>
      {/* 1. HERO SECTION */}
      <section 
        className="relative h-[65vh] md:h-[80vh] bg-cover bg-center overflow-hidden" 
        style={{ backgroundImage: `url('${HERO_IMAGE_URL}')` }} 
      >
        
        <div className="absolute inset-0 bg-gray-900 opacity-70"></div> 

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 container mx-auto">
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-center tracking-tighter mb-4 max-w-4xl leading-snug">
            The Nation's Leading Source for <span className="text-blue-400">HVAC Spares</span>.
          </h1>

          <p className="text-lg sm:text-xl text-center mb-12 max-w-2xl font-light opacity-90">
            Trusted parts for residential, commercial, and industrial cooling systems.
          </p>

          <form onSubmit={handleSearch} className="w-full max-w-4xl bg-white rounded-full shadow-2xl p-2 flex items-center">
            <Search className="text-gray-400 ml-4 flex-shrink-0" size={24} />
            <input 
              type="search" 
              placeholder="Search 10,000+ spare parts by name or part number..."
              className="flex-grow py-3 px-4 text-gray-800 bg-transparent border-none focus:outline-none placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <button 
              type="submit"
              className="bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 px-8 rounded-full transition duration-300 flex-shrink-0 flex items-center space-x-2"
            >
              <Search size={20} />
              <span>Find Part</span>
            </button>
          </form>

        </div>
      </section>
      
      {/* 2. FEATURES SECTION */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection>
              <div className="p-8 rounded-xl text-center border border-gray-100 shadow-md">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-800/10 rounded-full mb-4">
                  <PackageSearch className="text-blue-800" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Wide Product Range</h3>
                <p className="text-gray-500">15+ categories covering all HVAC spare parts and components</p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="p-8 rounded-xl text-center border border-gray-100 shadow-md">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-800/10 rounded-full mb-4">
                  <Award className="text-blue-800" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Assured</h3>
                <p className="text-gray-500">Genuine products from trusted brands and manufacturers</p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="p-8 rounded-xl text-center border border-gray-100 shadow-md">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-800/10 rounded-full mb-4">
                  <Wrench className="text-blue-800" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Support</h3>
                <p className="text-gray-500">Technical assistance and consultation for all your needs</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
      
      {/* 3. FEATURED PRODUCTS SECTION */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">Trending Spare Parts</h2>
              <p className="text-lg text-gray-500 mb-12 text-center">Our customers' favorite and fastest-moving items.</p>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <AnimatedSection key={product.id}> 
                  <div
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden group cursor-pointer"
                  >
                    <Link to={`/product/${product.slug}`}>
                      <div className="h-64 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                          />
                        ) : (
                          <PackageSearch size={64} className="text-gray-400" />
                        )}
                      </div>
                    </Link>

                    <div className="p-5">
                      <p className="text-sm text-gray-400 font-medium uppercase mb-1">Brand Name</p>
                      
                      <Link to={`/product/${product.slug}`}>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-blue-800 transition">
                          {product.name}
                        </h3>
                      </Link>
                      
                      <Link
                        to={`/product/${product.slug}#quote`}
                        className="bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-900 transition inline-flex items-center space-x-2 text-sm"
                      >
                        {/* Rupee Symbol (₹) */}
                        <span className="font-sans text-lg">₹</span>
                        <span>Request Price Quote</span>
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. PRODUCT CATEGORIES SECTION (Now Guaranteed Visible) */}
      <section id="categories" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">Browse by Category</h2>
            <p className="text-lg text-gray-500 mb-12 text-center">Find the exact component you need across our diverse product lines.</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <AnimatedSection key={category.id}> 
                <div
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden group cursor-pointer border border-gray-100"
                >
                  <Link to={`/category/${category.slug}`}>
                    <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                      {category.image_url ? (
                        <img 
                          src={category.image_url} 
                          alt={category.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                        />
                      ) : (
                        <PackageSearch size={48} className="text-gray-400" />
                      )}
                    </div>
                  </Link>

                  <div className="p-5">
                    <Link to={`/category/${category.slug}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-800 transition">
                        {category.name}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {category.description || 'Explore our wide range of professional HVAC spare parts and components.'}
                    </p>
                    
                    <Link
                      to={`/category/${category.slug}`}
                      className="text-blue-800 font-semibold inline-flex items-center space-x-2 text-base hover:underline"
                    >
                      <span>View Products</span>
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/categories" 
              className="bg-blue-800 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-900 transition inline-block shadow-lg"
            >
              View All 15+ Categories
            </Link>
          </div>
        </div>
      </section>

    </Layout>
  )
}
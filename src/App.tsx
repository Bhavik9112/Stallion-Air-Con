import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './contexts/AuthContext'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import CategoriesPage from './pages/CategoriesPage'
import CategoryDetailPage from './pages/CategoryDetailPage'
import ProductDetailPage from './pages/ProductDetailPage'
import SearchPage from './pages/SearchPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AdminSubcategoriesPage from './pages/admin/AdminSubcategoriesPage'
import AdminBrandsPage from './pages/admin/AdminBrandsPage'
import AdminQueriesPage from './pages/admin/AdminQueriesPage'
import AdminGeneralQueriesPage from './pages/admin/AdminGeneralQueriesPage'
import './App.css'

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/category/:slug" element={<CategoryDetailPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/subcategories" element={<AdminSubcategoriesPage />} />
            <Route path="/admin/brands" element={<AdminBrandsPage />} />
            <Route path="/admin/queries" element={<AdminQueriesPage />} />
            <Route path="/admin/general-queries" element={<AdminGeneralQueriesPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App

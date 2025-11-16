import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { LogIn } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('') // New state for success messages
  
  // Destructure resetPasswordForEmail from your context
  const { signIn, resetPasswordForEmail } = useAuth() 
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      await signIn(email, password)
      navigate('/admin')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  // 💡 NEW: Handle password reset request
  async function handleResetPassword() {
    if (!email) {
      setError('Please enter your email address to reset your password.')
      return
    }
    
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // Assuming resetPasswordForEmail is defined in your AuthContext
      await resetPasswordForEmail(email); 
      setMessage('Password reset instructions sent to your email address.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-medium to-secondary flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <LogIn className="text-primary" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-primary">Admin Login</h1>
          <p className="text-gray-text mt-2">Stallion Air Con Management</p>
        </div>

        {/* Display Error Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {/* Display Success Messages (e.g., after password reset) */}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="admin@stallionaircon.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Enter your password"
            />
          </div>
          
          {/* 💡 NEW: Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={loading}
              className="text-sm text-gray-600 hover:text-primary transition"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-medium transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import Layout from '../components/layout/Layout'
import GoogleMapComponent from '../components/GoogleMapComponent'
import { supabase } from '../lib/supabase'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const { error } = await supabase
        .from('queries')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: `${formData.subject}\n\n${formData.message}`,
          query_type: 'general',
          status: 'pending'
        })

      if (error) throw error

      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <>
      <Helmet>
        <title>Contact Us - Stallion Air Con | HVAC Solutions Vapi Gujarat</title>
        <meta name="description" content="Get in touch with Stallion Air Con for HVAC solutions, refrigerant plants, chillers, and spare parts. Contact Sushil Nahar at 08866004475 in Vapi, Gujarat." />
        <meta name="keywords" content="contact stallion air con, HVAC Vapi, refrigerant plant supplier, chiller service, cold storage Vapi, Gujarat HVAC contact" />
        <link rel="canonical" href="https://www.stallionaircon.com/contact" />
        <meta property="og:title" content="Contact Stallion Air Con - HVAC Solutions Vapi Gujarat" />
        <meta property="og:description" content="Professional HVAC solutions in Vapi, Gujarat. Contact us for refrigerant plants, chillers, cold storage systems, and technical support." />
        <meta property="og:url" content="https://www.stallionaircon.com/contact" />
      </Helmet>
      <Layout>
      <section className="relative bg-gradient-to-br from-primary via-primary-medium to-secondary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl md:text-2xl text-gray-100">
              Get in touch with our team for inquiries, support, or partnership opportunities.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Get In Touch</h2>
              <p className="text-gray-text mb-8">
                Have questions about our products or services? Our team is here to help. Fill out the form 
                and we'll get back to you as soon as possible.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Phone className="text-secondary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-1">Phone & WhatsApp</h3>
                    <p className="text-gray-text mb-2">08866004475</p>
                    <div className="flex space-x-2">
                      <a 
                        href="tel:08866004475"
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        Call Now
                      </a>
                      <a 
                        href="https://wa.me/918866004475"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 underline text-sm"
                      >
                        WhatsApp
                      </a>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Monday to Saturday, 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Mail className="text-secondary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-1">Email</h3>
                    <p className="text-gray-text">stallionaircon@gmail.com</p>
                    <p className="text-sm text-gray-400 mt-1">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                    <MapPin className="text-secondary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-1">Location</h3>
                    <p className="text-gray-text">C-5/37 Commercial Zone</p>
                    <p className="text-gray-text">Ritesh Shopping Center, G.I.D.C Char Rasta, Vapi (G.J.)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Clock className="text-secondary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-1">Business Hours</h3>
                    <div className="text-gray-text">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 6:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-3xl font-bold text-primary mb-6">Send Us a Message</h2>
                
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-green-800 font-semibold">Message sent successfully!</p>
                      <p className="text-green-700 text-sm mt-1">We'll get back to you soon.</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">Failed to send message. Please try again or contact us directly.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-primary mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-primary mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-primary mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-primary mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-primary mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                      placeholder="Tell us about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white px-6 py-4 rounded-lg font-semibold hover:bg-primary-medium transition inline-flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-primary mb-6 text-center">Find Us</h2>
            <div className="max-w-4xl mx-auto">
              <GoogleMapComponent 
                center={{ lat: 20.3603109, lng: 72.93100989999999 }}
                zoom={16}
                markerTitle="Stallion Air Con - HVAC Solutions"
                address={`C-5/37, Retash Shopping Centre, GIDC Area Internal Rd, Commercial Zone, Char Rasta, GIDC, Vapi, Gujarat 396191, India`}
              />
            </div>
          </div>
          <div className="max-w-4xl mx-auto text-center mt-4">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('C-5/37, Retash Shopping Centre, GIDC Area Internal Rd, Commercial Zone, Char Rasta, GIDC, Vapi, Gujarat 396191, India')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline font-semibold"
            >
              View on Google Maps
            </a>
          </div>

          <div className="max-w-4xl mx-auto mt-6">
            <h3 className="text-center text-sm text-gray-600 mb-2">If the embedded map above doesn't show the marker, this embedded view should locate the exact business address:</h3>
            <div className="w-full rounded-lg overflow-hidden shadow-md">
              <iframe
                title="Stallion Air Con - Location"
                src={`https://www.google.com/maps?q=${encodeURIComponent('C-5/37, Retash Shopping Centre, GIDC Area Internal Rd, Commercial Zone, Char Rasta, GIDC, Vapi, Gujarat 396191, India')}&output=embed`}
                width="100%"
                height="450"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary mb-6">Need Product Information?</h2>
            <p className="text-gray-text text-lg mb-8">
              For specific product inquiries and price requests, please use the price query system on our 
              product pages. This helps us provide you with accurate and detailed information quickly.
            </p>
            <a 
              href="/categories" 
              className="bg-secondary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary transition inline-block"
            >
              Browse Products
            </a>
          </div>
        </div>
      </section>
    </Layout>
    </>
  )
}

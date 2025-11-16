import { Award, Target, Users, Wrench, CheckCircle, Shield } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import Layout from '../components/layout/Layout'

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us - Stallion Air Con | HVAC Industry Leader Vapi Gujarat</title>
        <meta name="description" content="Learn about Stallion Air Con's expertise in HVAC solutions including refrigerant plants, chillers, cold storage systems, and spare parts. Trusted HVAC partner in Vapi, Gujarat." />
        <meta name="keywords" content="about stallion air con, HVAC company Vapi, refrigerant plant manufacturer, chiller specialist, cold storage solutions, HVAC Gujarat, air conditioning expertise" />
        <link rel="canonical" href="https://www.stallionaircon.com/about" />
        <meta property="og:title" content="About Stallion Air Con - HVAC Industry Leader Vapi Gujarat" />
        <meta property="og:description" content="Stallion Air Con specializes in refrigerant plants, chillers, cold storage systems and HVAC solutions. Expert technical support and quality products in Gujarat." />
        <meta property="og:url" content="https://www.stallionaircon.com/about" />
      </Helmet>
      <Layout>
      <section className="relative bg-gradient-to-br from-primary via-primary-medium to-secondary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Stallion Air Con</h1>
            <p className="text-xl md:text-2xl text-gray-100">
              Your trusted partner in HVAC solutions with years of expertise and commitment to excellence.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-primary mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-text text-lg">
              <p>
                Stallion Air Con has been serving the HVAC industry with dedication and expertise for many years. 
                Based in Vapi, Gujarat, we understand that reliable climate control systems are essential for comfort, 
                productivity, and safety in both residential and commercial environments.
              </p>
              <p>
                Our journey began with a simple mission: to provide high-quality HVAC products and solutions 
                that professionals can trust. Today, we have grown to become a leading supplier in the industry, 
                specializing in refrigerant plants, chillers, cold storage systems, condensing units, 
                refrigeration spare parts, and refrigerant gases including R22, R23, R32, R134A, R404, R407, and R410.
              </p>
              <p>
                What sets us apart is our commitment to understanding our customers' needs. We work closely with 
                HVAC technicians, contractors, and facility managers to ensure they have access to the right products 
                at the right time, backed by expert technical support and competitive pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center">Our Mission & Vision</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-6">
                <Target className="text-secondary" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Our Mission</h3>
              <p className="text-gray-text">
                To provide the HVAC industry with superior quality products including refrigerant plants, chillers, 
                cold storage systems, condensing units, and refrigeration spare parts, along with exceptional customer 
                service and technical expertise that helps our partners deliver reliable climate control solutions.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-6">
                <Award className="text-secondary" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Our Vision</h3>
              <p className="text-gray-text">
                To be the most trusted and reliable partner in the HVAC industry, known for our comprehensive 
                product range covering refrigerant plants to spare parts, technical knowledge, and unwavering 
                commitment to quality and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center">Why Choose Stallion Air Con</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-4">
                <Shield className="text-secondary" size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Quality Assurance</h3>
              <p className="text-gray-text">
                All products are sourced from trusted manufacturers and undergo strict quality checks to ensure 
                reliability and performance.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-4">
                <Wrench className="text-secondary" size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Technical Expertise</h3>
              <p className="text-gray-text">
                Our team of HVAC specialists provides expert guidance to help you find the right parts and 
                solutions for your specific needs.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-4">
                <Users className="text-secondary" size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Customer Focus</h3>
              <p className="text-gray-text">
                We prioritize customer satisfaction through responsive service, competitive pricing, and 
                reliable delivery of quality products.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center">Our Capabilities</h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <CheckCircle className="text-secondary flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-lg font-bold text-primary mb-2">Comprehensive Product Portfolio</h4>
                <p className="text-gray-text">
                  Refrigerant plants, chillers, cold storage systems, condensing units, spare parts & gases (R22, R23, R32, R134A, R404, R407, R410)
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="text-secondary flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-lg font-bold text-primary mb-2">Trusted Brands</h4>
                <p className="text-gray-text">
                  Partnerships with leading manufacturers ensuring genuine, quality products
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="text-secondary flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-lg font-bold text-primary mb-2">Fast Response</h4>
                <p className="text-gray-text">
                  Quick quotations and efficient order processing to minimize downtime
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="text-secondary flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-lg font-bold text-primary mb-2">Technical Support</h4>
                <p className="text-gray-text">
                  Expert assistance to help identify the right parts and solutions
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="text-secondary flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-lg font-bold text-primary mb-2">Competitive Pricing</h4>
                <p className="text-gray-text">
                  Fair market prices with volume discounts for regular customers
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="text-secondary flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-lg font-bold text-primary mb-2">Industry Experience</h4>
                <p className="text-gray-text">
                  Deep understanding of HVAC systems and component requirements
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary mb-6">Ready to Work With Us?</h2>
          <p className="text-xl text-gray-text mb-8 max-w-2xl mx-auto">
            Whether you need a single component or comprehensive HVAC solutions, our team is ready to 
            assist you with expert guidance and quality products.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/contact" 
              className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-medium transition inline-block"
            >
              Contact Us
            </a>
            <a 
              href="https://wa.me/918866004475?text=Hi! I'm interested in your HVAC products and services. Can you help me with more information?"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-600 transition inline-block"
            >
              WhatsApp Chat
            </a>
            <a 
              href="/categories" 
              className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary hover:text-white transition inline-block"
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

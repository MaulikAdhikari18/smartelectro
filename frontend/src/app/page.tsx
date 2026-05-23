'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

const categories = [
  { id: 1, name: 'EV Chargers', icon: '⚡', desc: 'AC & DC Fast Chargers', color: 'bg-blue-50 border-blue-200' },
  { id: 2, name: 'Commercial Induction', icon: '🔥', desc: 'Industrial Cooking Systems', color: 'bg-orange-50 border-orange-200' },
  { id: 3, name: 'Industrial Equipment', icon: '⚙️', desc: 'Heavy Duty Electrical', color: 'bg-gray-50 border-gray-200' },
  { id: 4, name: 'Solar & Renewable', icon: '☀️', desc: 'Green Energy Products', color: 'bg-yellow-50 border-yellow-200' },
  { id: 5, name: 'Wiring & Components', icon: '🔌', desc: 'Cables & Components', color: 'bg-purple-50 border-purple-200' },
  { id: 6, name: 'Automation Systems', icon: '🤖', desc: 'Control & Automation', color: 'bg-green-50 border-green-200' },
];

const stats = [
  { label: 'Verified Suppliers', value: '500+' },
  { label: 'Products Listed', value: '10,000+' },
  { label: 'B2B Buyers', value: '25,000+' },
  { label: 'Cities Covered', value: '150+' },
];

const trustBadges = [
  { icon: '✅', label: 'GST Verified Suppliers' },
  { icon: '🏆', label: 'ISO Certified Products' },
  { icon: '🔒', label: 'Secure Payments' },
  { icon: '📦', label: 'Pan India Delivery' },
];

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data.slice(0, 8))).catch(() => {});
  }, []);

  return (
    <div>
      {/* ── Hero Section ── */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1d4ed8 0%, transparent 40%)' }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              🇮🇳 India's #1 B2B Electrical Marketplace
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Source Electrical &<br />
              <span className="text-blue-400">EV Products</span> at<br />
              Wholesale Prices
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Connect with 500+ verified manufacturers and suppliers. Get bulk quotes, compare prices, and place orders with GST invoicing — all in one platform.
            </p>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search EV chargers, induction systems, cables..."
                className="flex-1 px-5 py-4 rounded-xl text-gray-900 text-base outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Link
                href={`/products${searchQuery ? `?search=${searchQuery}` : ''}`}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-colors whitespace-nowrap text-center"
              >
                Search Products
              </Link>
            </div>

            <div className="flex flex-wrap gap-3 mt-5">
              {['EV Chargers', 'Induction Cooktop', 'Solar Panels', 'Industrial Cables'].map(tag => (
                <Link key={tag} href={`/products?search=${tag}`}
                  className="text-sm text-blue-300 hover:text-white border border-blue-700 hover:border-blue-400 px-3 py-1 rounded-full transition-colors">
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-blue-600 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {stats.map(s => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold">{s.value}</div>
                <div className="text-blue-200 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            {trustBadges.map(b => (
              <div key={b.label} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <span className="text-xl">{b.icon}</span> {b.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">Find exactly what your business needs</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <Link key={cat.id} href={`/products?categoryId=${cat.id}`}
                className={`card p-5 text-center border-2 ${cat.color} hover:scale-105 transition-transform cursor-pointer`}>
                <div className="text-4xl mb-3">{cat.icon}</div>
                <div className="font-semibold text-gray-800 text-sm mb-1">{cat.name}</div>
                <div className="text-xs text-gray-500">{cat.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="text-gray-500">Top picks from verified suppliers</p>
            </div>
            <Link href="/products" className="btn-outline text-sm py-2 px-5">View All →</Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p: any) => (
                <Link key={p.id} href={`/products/${p.id}`} className="card p-4 group">
                  <div className="bg-gray-100 rounded-xl h-44 flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                    <span className="text-5xl">⚡</span>
                  </div>
                  <div className="text-xs text-blue-600 font-medium mb-1 uppercase tracking-wide">
                    {p.category?.name || 'Electrical'}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">
                      ₹{p.basePrice?.toLocaleString('en-IN') || 'Get Quote'}
                    </span>
                    <span className="text-xs text-gray-400">MOQ: {p.moq || 1}</span>
                  </div>
                  <div className="mt-3 text-xs text-green-600 font-medium">✅ GST Invoice</div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty state — shown before products are added */
            <div className="text-center py-16 text-gray-400">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-lg font-medium text-gray-500">Products will appear here</p>
              <p className="text-sm mt-1">Add products through the supplier dashboard</p>
              <Link href="/register" className="btn-primary inline-block mt-6 text-sm">
                Register as Supplier →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── RFQ Banner ── */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Bulk Order?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Post your requirement and get quotes from multiple verified suppliers within 24 hours
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/rfq" className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors">
              📩 Post Your Requirement
            </Link>
            <Link href="/register" className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
              Register as Supplier
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Simple 3-step process to get what you need</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '🔍', title: 'Search & Browse', desc: 'Find products across 6+ categories with filters for price, MOQ, certifications and more.' },
              { step: '02', icon: '📩', title: 'Get Quotes or Buy', desc: 'Add to cart for fixed-price items or post an RFQ to get competitive bulk quotes from suppliers.' },
              { step: '03', icon: '📦', title: 'Order & Track', desc: 'Place your order with GST invoice, purchase order generation, and real-time tracking.' },
            ].map(s => (
              <div key={s.step} className="card p-8 text-center">
                <div className="text-blue-600 font-black text-4xl mb-3 opacity-20">{s.step}</div>
                <div className="text-5xl mb-4">{s.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{s.title}</h3>
                <p className="text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

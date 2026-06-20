'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

const categories = [
  { id: 1, name: 'EV Chargers',           icon: '⚡', desc: 'AC & DC Fast Chargers',      bg: '#0f172a', accent: '#f59e0b' },
  { id: 2, name: 'Commercial Induction',  icon: '🔥', desc: 'Industrial Cooking Systems',  bg: '#1e1b4b', accent: '#818cf8' },
  { id: 3, name: 'Industrial Equipment',  icon: '⚙️', desc: 'Heavy Duty Electrical',       bg: '#1c1917', accent: '#a8a29e' },
  { id: 4, name: 'Solar & Renewable',     icon: '☀️', desc: 'Green Energy Products',       bg: '#14532d', accent: '#86efac' },
  { id: 5, name: 'Wiring & Components',   icon: '🔌', desc: 'Cables & Components',         bg: '#1e3a5f', accent: '#7dd3fc' },
  { id: 6, name: 'Automation Systems',    icon: '🤖', desc: 'Control & Automation',        bg: '#3b0764', accent: '#e879f9' },
];

const stats = [
  { label: 'Verified Suppliers', value: '500+',    icon: '🏭' },
  { label: 'Products Listed',    value: '10,000+', icon: '📦' },
  { label: 'B2B Buyers',         value: '25,000+', icon: '🤝' },
  { label: 'Cities Covered',     value: '150+',    icon: '🗺️' },
];

const trustBadges = [
  { icon: '✅', label: 'GST Verified Suppliers' },
  { icon: '🏆', label: 'ISO Certified Products' },
  { icon: '🔒', label: 'Secure B2B Payments' },
  { icon: '📦', label: 'Pan India Delivery' },
  { icon: '📄', label: 'GST Invoice on Every Order' },
];

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data.slice(0, 8))).catch(() => {});
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: '#f59e0b' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: '#3b82f6' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', color: '#fbbf24' }}>
              ⚡ India's #1 B2B Electrical Marketplace
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-white">
              Source Electrical &<br />
              <span style={{ color: '#f59e0b' }}>EV Products</span> at<br />
              Wholesale Prices
            </h1>

            <p className="text-xl leading-relaxed mb-10" style={{ color: '#94a3b8' }}>
              Connect with 500+ verified manufacturers. Get bulk quotes, compare prices, and place orders with GST invoicing — all in one platform.
            </p>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && window.location.assign(`/products${searchQuery ? `?search=${searchQuery}` : ''}`)}
                placeholder="Search EV chargers, induction systems, cables..."
                className="flex-1 px-5 py-4 rounded-xl text-gray-900 text-base outline-none"
                style={{ background: 'rgba(255,255,255,0.95)' }}
              />
              <Link href={`/products${searchQuery ? `?search=${searchQuery}` : ''}`}
                className="btn-primary px-8 py-4 rounded-xl whitespace-nowrap text-center font-bold">
                🔍 Search
              </Link>
            </div>

            {/* Quick tags */}
            <div className="flex flex-wrap gap-2">
              {['EV Chargers', 'Induction Cooktop', 'Solar Panels', 'Industrial Cables', 'Automation'].map(tag => (
                <Link key={tag} href={`/products?search=${tag}`}
                  className="text-sm px-4 py-1.5 rounded-full transition-all"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.15)' }}
                  onMouseOver={e => (e.currentTarget.style.borderColor = '#f59e0b', e.currentTarget.style.color = '#f59e0b')}
                  onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)', e.currentTarget.style.color = '#cbd5e1')}>
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="py-5 border-b" style={{ background: '#1e293b', borderColor: '#334155' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            {trustBadges.map(b => (
              <div key={b.label} className="flex items-center gap-2 text-sm font-medium" style={{ color: '#94a3b8' }}>
                <span>{b.icon}</span> {b.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14" style={{ background: '#f59e0b' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map(s => (
              <div key={s.label}>
                <div className="text-3xl mb-1">{s.icon}</div>
                <div className="text-4xl font-extrabold text-gray-900">{s.value}</div>
                <div className="text-sm font-medium mt-1" style={{ color: '#78350f' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 px-4" style={{ background: '#f0f4f8' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">Find exactly what your business needs</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <Link key={cat.id} href={`/products?categoryId=${cat.id}`}
                className="rounded-2xl p-5 text-center cursor-pointer transition-all hover:scale-105 hover:shadow-xl"
                style={{ background: cat.bg }}>
                <div className="text-4xl mb-3">{cat.icon}</div>
                <div className="font-bold text-sm mb-1" style={{ color: cat.accent }}>{cat.name}</div>
                <div className="text-xs" style={{ color: '#94a3b8' }}>{cat.desc}</div>
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
              <p style={{ color: '#64748b' }}>Top picks from verified suppliers</p>
            </div>
            <Link href="/products" className="btn-outline text-sm py-2 px-5 rounded-lg">View All →</Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p: any) => (
                <Link key={p.id} href={`/products/${p.id}`} className="card p-4 group">
                  <div className="rounded-xl h-44 flex items-center justify-center mb-4 transition-colors"
                    style={{ background: '#f8fafc' }}>
                    <span className="text-5xl">⚡</span>
                  </div>
                  <div className="text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#f59e0b' }}>
                    {p.category?.name || 'Electrical'}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-extrabold" style={{ color: '#0f172a' }}>
                      ₹{p.basePrice?.toLocaleString('en-IN') || 'Get Quote'}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#fef3c7', color: '#b45309' }}>
                      MOQ: {p.moq || 1}
                    </span>
                  </div>
                  <div className="mt-3 text-xs font-medium" style={{ color: '#15803d' }}>✅ GST Invoice Included</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-2xl" style={{ background: '#f8fafc' }}>
              <div className="text-7xl mb-5">📦</div>
              <p className="text-xl font-bold text-gray-600 mb-2">No products yet</p>
              <p className="text-sm text-gray-400 mb-6">Add products through the supplier dashboard</p>
              <Link href="/register" className="btn-primary text-sm rounded-lg">
                Register as Supplier →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── RFQ Banner ── */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-5xl mb-5">📩</div>
          <h2 className="text-4xl font-extrabold text-white mb-4">Need a Custom Bulk Order?</h2>
          <p className="text-lg mb-10" style={{ color: '#94a3b8' }}>
            Post your requirement and get quotes from multiple verified suppliers within 24 hours
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/rfq" className="btn-primary px-10 py-4 rounded-xl font-bold text-lg">
              Post Your Requirement
            </Link>
            <Link href="/register"
              className="px-10 py-4 rounded-xl font-bold text-lg transition-all"
              style={{ border: '2px solid #334155', color: '#94a3b8' }}
              onMouseOver={e => (e.currentTarget.style.borderColor = '#f59e0b', e.currentTarget.style.color = '#f59e0b')}
              onMouseOut={e => (e.currentTarget.style.borderColor = '#334155', e.currentTarget.style.color = '#94a3b8')}>
              Register as Supplier
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 px-4" style={{ background: '#f0f4f8' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Simple 3-step process to source what you need</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '🔍', title: 'Search & Browse', desc: 'Find products across 6+ categories with filters for price, MOQ, certifications and more.' },
              { step: '02', icon: '📩', title: 'Get Quotes or Buy', desc: 'Add to cart for fixed-price items or post an RFQ to get competitive bulk quotes.' },
              { step: '03', icon: '📦', title: 'Order & Track', desc: 'Place your order with GST invoice and purchase order generation.' },
            ].map((s, i) => (
              <div key={s.step} className="card p-8 text-center relative overflow-hidden">
                <div className="absolute top-4 right-4 text-6xl font-black opacity-5" style={{ color: '#f59e0b' }}>{s.step}</div>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5"
                  style={{ background: i === 0 ? '#fef3c7' : i === 1 ? '#dbeafe' : '#dcfce7' }}>
                  {s.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/suppliers')
      .then(res => setSuppliers(res.data))
      .catch(() => setSuppliers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = suppliers.filter(s =>
    s.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    s.location?.toLowerCase().includes(search.toLowerCase())
  );

  const demoSuppliers = [
    { id: 1, companyName: 'Tata Power EV Solutions', location: 'Mumbai, Maharashtra', rating: 4.9, totalReviews: 234, gstVerified: true, isoVerified: true, description: 'Leading EV charging infrastructure provider with 500+ installations across India.', categories: ['EV Chargers', 'Automation'] },
    { id: 2, companyName: 'Havells Industrial', location: 'Noida, Uttar Pradesh', rating: 4.7, totalReviews: 189, gstVerified: true, isoVerified: true, description: 'Premium electrical equipment manufacturer with pan-India distribution network.', categories: ['Wiring & Components', 'Industrial Equipment'] },
    { id: 3, companyName: 'SolarMax Renewables', location: 'Pune, Maharashtra', rating: 4.8, totalReviews: 156, gstVerified: true, isoVerified: false, description: 'Renewable energy specialist offering solar panels and complete installation services.', categories: ['Solar & Renewable'] },
    { id: 4, companyName: 'InduCook Systems', location: 'Ahmedabad, Gujarat', rating: 4.6, totalReviews: 98, gstVerified: true, isoVerified: true, description: 'Commercial induction cooking systems for hotels, canteens, and industrial kitchens.', categories: ['Commercial Induction'] },
    { id: 5, companyName: 'PowerGrid Automation', location: 'Bengaluru, Karnataka', rating: 4.5, totalReviews: 72, gstVerified: true, isoVerified: false, description: 'Industrial automation and control systems for manufacturing and process industries.', categories: ['Automation Systems'] },
    { id: 6, companyName: 'ElectroCables India', location: 'Chennai, Tamil Nadu', rating: 4.7, totalReviews: 143, gstVerified: true, isoVerified: true, description: 'High quality electrical cables, wires and wiring accessories for industrial use.', categories: ['Wiring & Components'] },
  ];

  const displaySuppliers = suppliers.length > 0 ? filtered : demoSuppliers.filter(s =>
    s.companyName.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center gap-2 text-sm mb-4" style={{ color: '#64748b' }}>
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span>/</span>
            <span style={{ color: '#f59e0b' }}>Suppliers</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3">Verified Suppliers</h1>
          <p className="text-lg mb-8" style={{ color: '#64748b' }}>
            500+ GST verified manufacturers and distributors across India
          </p>
          {/* Search */}
          <div className="max-w-xl">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by company name or location..."
              className="w-full px-5 py-4 rounded-xl text-white text-base outline-none"
              style={{ background: '#1e293b', border: '1px solid #334155' }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Verified Suppliers', value: '500+', icon: '🏭' },
            { label: 'Product Categories', value: '6', icon: '📦' },
            { label: 'Cities Covered', value: '150+', icon: '📍' },
            { label: 'Avg Response Time', value: '4 hrs', icon: '⚡' },
          ].map(s => (
            <div key={s.label} className="card p-5 text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-2xl font-extrabold" style={{ color: '#0f172a' }}>{s.value}</div>
              <div className="text-xs font-medium mt-1" style={{ color: '#64748b' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Suppliers grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse space-y-4">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-xl" style={{ background: '#e2e8f0' }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 rounded" style={{ background: '#e2e8f0', width: '70%' }} />
                    <div className="h-3 rounded" style={{ background: '#e2e8f0', width: '50%' }} />
                  </div>
                </div>
                <div className="h-3 rounded" style={{ background: '#e2e8f0' }} />
                <div className="h-3 rounded" style={{ background: '#e2e8f0', width: '80%' }} />
              </div>
            ))}
          </div>
        ) : displaySuppliers.length === 0 ? (
          <div className="card p-20 text-center">
            <div className="text-7xl mb-5">🔍</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-3">No suppliers found</h3>
            <p className="text-gray-400">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displaySuppliers.map((s: any) => (
              <div key={s.id} className="card p-6 flex flex-col">

                {/* Top */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>
                    {s.companyName?.[0] || 'S'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-base truncate">{s.companyName}</h3>
                    <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>📍 {s.location}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span style={{ color: '#f59e0b' }}>★</span>
                      <span className="text-sm font-bold" style={{ color: '#0f172a' }}>{s.rating}</span>
                      <span className="text-xs" style={{ color: '#94a3b8' }}>({s.totalReviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {s.gstVerified && <span className="badge badge-green">✓ GST Verified</span>}
                  {s.isoVerified && <span className="badge badge-blue">✓ ISO Certified</span>}
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: '#64748b' }}>
                  {s.description}
                </p>

                {/* Categories */}
                {s.categories?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {s.categories.map((cat: string) => (
                      <span key={cat} className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: '#f1f5f9', color: '#475569' }}>
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <Link href={`/products?supplierId=${s.id}`}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-center transition-all"
                    style={{ background: '#0f172a', color: '#f59e0b' }}>
                    View Products
                  </Link>
                  <Link href="/rfq"
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-center transition-all"
                    style={{ background: '#fef3c7', color: '#b45309' }}>
                    Get Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-2xl p-10 text-center"
          style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', border: '1px solid #334155' }}>
          <h2 className="text-3xl font-extrabold text-white mb-3">Are You a Supplier?</h2>
          <p className="text-lg mb-8" style={{ color: '#64748b' }}>
            Join 500+ verified suppliers and reach 25,000+ B2B buyers across India
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary px-10 py-4 rounded-xl font-bold text-lg">
              Register as Supplier →
            </Link>
            <Link href="/rfq"
              className="px-10 py-4 rounded-xl font-bold text-lg transition-all"
              style={{ border: '2px solid #334155', color: '#94a3b8' }}>
              Post a Requirement
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
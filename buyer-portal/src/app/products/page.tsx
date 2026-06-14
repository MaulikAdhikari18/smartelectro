'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';

const categories = [
  { id: 1, name: 'EV Chargers', icon: '⚡' },
  { id: 2, name: 'Commercial Induction', icon: '🔥' },
  { id: 3, name: 'Industrial Equipment', icon: '⚙️' },
  { id: 4, name: 'Solar & Renewable', icon: '☀️' },
  { id: 5, name: 'Wiring & Components', icon: '🔌' },
  { id: 6, name: 'Automation Systems', icon: '🤖' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : null
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/products';
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      else if (selectedCategory) params.append('categoryId', String(selectedCategory));
      if (params.toString()) url += `?${params.toString()}`;
      const res = await api.get(url);
      let data = res.data;
      if (sortBy === 'price-asc') data = [...data].sort((a: any, b: any) => (a.basePrice || 0) - (b.basePrice || 0));
      if (sortBy === 'price-desc') data = [...data].sort((a: any, b: any) => (b.basePrice || 0) - (a.basePrice || 0));
      if (sortBy === 'moq') data = [...data].sort((a: any, b: any) => (a.moq || 1) - (b.moq || 1));
      setProducts(data);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [selectedCategory, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh' }}>

      {/* ── Top bar ── */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-extrabold text-white mb-4">All Products</h1>
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-5 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: '#1e293b', border: '1px solid #334155' }}
            />
            <button type="submit" className="px-6 py-3 rounded-xl font-bold text-sm"
              style={{ background: '#f59e0b', color: '#0f172a' }}>
              Search
            </button>
            {searchQuery && (
              <button type="button" onClick={() => { setSearchQuery(''); fetchProducts(); }}
                className="px-4 py-3 rounded-xl text-sm font-medium"
                style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}>
                Clear
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-64 flex-shrink-0">

            {/* Categories */}
            <div className="rounded-2xl p-5 mb-5" style={{ background: 'white', border: '1px solid #e8edf2' }}>
              <h3 className="font-bold text-gray-800 mb-4 text-base">Categories</h3>
              <button
                onClick={() => setSelectedCategory(null)}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-all"
                style={{
                  background: selectedCategory === null ? '#0f172a' : 'transparent',
                  color: selectedCategory === null ? '#f59e0b' : '#64748b'
                }}>
                🏪 All Categories
              </button>
              {categories.map(cat => (
                <button key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setSearchQuery(''); }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-all"
                  style={{
                    background: selectedCategory === cat.id ? '#0f172a' : 'transparent',
                    color: selectedCategory === cat.id ? '#f59e0b' : '#64748b'
                  }}>
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="rounded-2xl p-5 mb-5" style={{ background: 'white', border: '1px solid #e8edf2' }}>
              <h3 className="font-bold text-gray-800 mb-4 text-base">Sort By</h3>
              {[
                { value: 'default', label: '⭐ Default' },
                { value: 'price-asc', label: '💰 Price: Low to High' },
                { value: 'price-desc', label: '💰 Price: High to Low' },
                { value: 'moq', label: '📦 Minimum Order Qty' },
              ].map(opt => (
                <button key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-all"
                  style={{
                    background: sortBy === opt.value ? '#fef3c7' : 'transparent',
                    color: sortBy === opt.value ? '#b45309' : '#64748b'
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>

            {/* RFQ CTA */}
            <div className="rounded-2xl p-5 text-center"
              style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', border: '1px solid #334155' }}>
              <div className="text-3xl mb-3">📩</div>
              <h3 className="font-bold text-white mb-2">Need Bulk Order?</h3>
              <p className="text-xs mb-4" style={{ color: '#64748b' }}>Get quotes from multiple suppliers</p>
              <Link href="/rfq" className="block btn-primary text-sm py-2.5 rounded-xl">Post Requirement</Link>
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <p className="text-sm font-medium" style={{ color: '#64748b' }}>
                {loading ? 'Loading...' : `${products.length} products found`}
                {selectedCategory && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
                {searchQuery && ` for "${searchQuery}"`}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setViewMode('grid')}
                  className="p-2 rounded-lg transition-all"
                  style={{ background: viewMode === 'grid' ? '#0f172a' : '#e2e8f0', color: viewMode === 'grid' ? '#f59e0b' : '#64748b' }}>
                  ⊞
                </button>
                <button onClick={() => setViewMode('list')}
                  className="p-2 rounded-lg transition-all"
                  style={{ background: viewMode === 'list' ? '#0f172a' : '#e2e8f0', color: viewMode === 'list' ? '#f59e0b' : '#64748b' }}>
                  ☰
                </button>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: 'white' }}>
                    <div className="h-44" style={{ background: '#e2e8f0' }} />
                    <div className="p-4 space-y-3">
                      <div className="h-3 rounded" style={{ background: '#e2e8f0', width: '40%' }} />
                      <div className="h-4 rounded" style={{ background: '#e2e8f0' }} />
                      <div className="h-4 rounded" style={{ background: '#e2e8f0', width: '70%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 rounded-2xl" style={{ background: 'white' }}>
                <div className="text-7xl mb-5">🔍</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">No products found</h3>
                <p className="text-gray-400 mb-6">Try a different search or browse all categories</p>
                <button onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                  className="btn-primary rounded-xl py-3 px-8">
                  View All Products
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((p: any) => (
                  <Link key={p.id} href={`/products/${p.id}`} className="card group overflow-hidden">
                    <div className="h-44 overflow-hidden transition-colors"
                      style={{ background: '#f8fafc' }}>
                      {p.images?.length > 0 ? (
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center group-hover:bg-amber-50 transition-colors">
                          <span className="text-6xl">⚡</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#f59e0b' }}>
                          {p.category?.name || 'Electrical'}
                        </span>
                        {p.featuredProduct && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#fef3c7', color: '#b45309' }}>Featured</span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 text-base leading-snug">{p.name}</h3>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-extrabold" style={{ color: '#0f172a' }}>
                          {p.basePrice ? `₹${p.basePrice.toLocaleString('en-IN')}` : 'Get Quote'}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#f1f5f9', color: '#475569' }}>
                          MOQ: {p.moq || 1}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs" style={{ color: '#94a3b8' }}>
                        <span>🏭 {p.supplier?.companyName || 'Verified Supplier'}</span>
                        <span style={{ color: '#15803d' }}>✅ GST</span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <span className="flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all"
                          style={{ background: '#0f172a', color: '#f59e0b' }}>
                          View Details
                        </span>
                        <span className="flex-1 text-center py-2 rounded-lg text-xs font-bold"
                          style={{ background: '#fef3c7', color: '#b45309' }}>
                          Get Quote
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* List view */
              <div className="space-y-4">
                {products.map((p: any) => (
                  <Link key={p.id} href={`/products/${p.id}`} className="card flex gap-5 p-5 group">
                    <div className="w-32 h-32 flex-shrink-0 rounded-xl flex items-center justify-center"
                      style={{ background: '#f8fafc' }}>
                      <span className="text-4xl">⚡</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#f59e0b' }}>
                        {p.category?.name || 'Electrical'}
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg mb-2">{p.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{p.description || 'High quality electrical product from verified supplier.'}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-extrabold text-lg" style={{ color: '#0f172a' }}>
                          {p.basePrice ? `₹${p.basePrice.toLocaleString('en-IN')}` : 'Get Quote'}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: '#f1f5f9', color: '#475569' }}>
                          MOQ: {p.moq || 1} units
                        </span>
                        <span className="text-xs" style={{ color: '#15803d' }}>✅ GST Invoice</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0 justify-center">
                      <span className="px-5 py-2 rounded-lg text-xs font-bold text-center"
                        style={{ background: '#0f172a', color: '#f59e0b' }}>View Details</span>
                      <span className="px-5 py-2 rounded-lg text-xs font-bold text-center"
                        style={{ background: '#fef3c7', color: '#b45309' }}>Get Quote</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
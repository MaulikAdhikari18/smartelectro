'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

type Tab = 'overview' | 'products' | 'rfqs' | 'orders';

export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add product form
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '', description: '', basePrice: '', moq: '1',
    brand: '', deliveryTimeline: '5-7 days', categoryId: '', specsJson: '{}'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    const role = localStorage.getItem('userRole');
    if (!token) { router.push('/login'); return; }
    setUser({ name, role });
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, rfqRes] = await Promise.all([
        api.get('/products'),
        api.get('/rfq/open').catch(() => ({ data: [] })),
      ]);
      setProducts(productsRes.data);
      setRfqs(rfqRes.data);
    } catch { }
    finally { setLoading(false); }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/products', {
        ...productForm,
        basePrice: Number(productForm.basePrice),
        moq: Number(productForm.moq),
        category: productForm.categoryId ? { id: Number(productForm.categoryId) } : null,
        active: true,
      });
      setShowAddProduct(false);
      setProductForm({ name: '', description: '', basePrice: '', moq: '1', brand: '', deliveryTimeline: '5-7 days', categoryId: '', specsJson: '{}' });
      fetchData();
    } catch { alert('Failed to add product.'); }
    finally { setSaving(false); }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Deactivate this product?')) return;
    await api.delete(`/products/${id}`);
    fetchData();
  };

  const role = user?.role;
  const isSupplier = role === 'SUPPLIER';

  const stats = isSupplier
    ? [
        { label: 'My Products', value: products.length, icon: '📦', color: '#fef3c7', text: '#b45309' },
        { label: 'Open RFQs', value: rfqs.length, icon: '📩', color: '#dbeafe', text: '#1d4ed8' },
        { label: 'Total Orders', value: 0, icon: '🛒', color: '#dcfce7', text: '#15803d' },
        { label: 'Rating', value: '4.8★', icon: '⭐', color: '#f3e8ff', text: '#7c3aed' },
      ]
    : [
        { label: 'My Orders', value: 0, icon: '🛒', color: '#fef3c7', text: '#b45309' },
        { label: 'My RFQs', value: rfqs.length, icon: '📩', color: '#dbeafe', text: '#1d4ed8' },
        { label: 'Saved Products', value: 0, icon: '❤️', color: '#dcfce7', text: '#15803d' },
        { label: 'Quotes Received', value: 0, icon: '💬', color: '#f3e8ff', text: '#7c3aed' },
      ];

  const categories = [
    { id: 1, name: 'EV Chargers' }, { id: 2, name: 'Commercial Induction' },
    { id: 3, name: 'Industrial Equipment' }, { id: 4, name: 'Solar & Renewable' },
    { id: 5, name: 'Wiring & Components' }, { id: 6, name: 'Automation Systems' },
  ];

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white">
                Welcome back, <span style={{ color: '#f59e0b' }}>{user?.name?.split(' ')[0]}</span> 👋
              </h1>
              <p className="mt-1 text-sm" style={{ color: '#64748b' }}>
                {isSupplier ? 'Supplier Dashboard' : 'Buyer Dashboard'} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isSupplier && (
                <button onClick={() => { setTab('products'); setShowAddProduct(true); }}
                  className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold">
                  + Add Product
                </button>
              )}
              <Link href="/rfq" className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{ border: '1px solid #334155', color: '#94a3b8' }}>
                📩 Post RFQ
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{ background: s.color, color: s.text }}>{s.label}</span>
              </div>
              <div className="text-3xl font-extrabold" style={{ color: '#0f172a' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: '#e2e8f0' }}>
          {(['overview', ...(isSupplier ? ['products'] : []), 'rfqs', 'orders'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-5 py-2.5 rounded-lg text-sm font-bold capitalize transition-all"
              style={{
                background: tab === t ? '#0f172a' : 'transparent',
                color: tab === t ? '#f59e0b' : '#64748b'
              }}>
              {t === 'rfqs' ? 'RFQs' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-5">Recent Activity</h3>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: '#f1f5f9' }} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { icon: '✅', text: 'Account created successfully', time: 'Just now', color: '#dcfce7' },
                    { icon: '📩', text: `${rfqs.length} open RFQs available`, time: 'Today', color: '#dbeafe' },
                    { icon: '📦', text: `${products.length} products in catalog`, time: 'Today', color: '#fef3c7' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#f8fafc' }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
                        style={{ background: item.color }}>{item.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{item.text}</p>
                      </div>
                      <span className="text-xs" style={{ color: '#94a3b8' }}>{item.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="card p-6">
                <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {isSupplier ? [
                    { label: '+ Add New Product', href: '#', onClick: () => { setTab('products'); setShowAddProduct(true); } },
                    { label: '📩 View Open RFQs', href: '#', onClick: () => setTab('rfqs') },
                    { label: '🏪 View My Store', href: '/suppliers/me', onClick: undefined },
                  ] : [
                    { label: '🔍 Browse Products', href: '/products', onClick: undefined },
                    { label: '📩 Post a Requirement', href: '/rfq', onClick: undefined },
                    { label: '📦 Track Orders', href: '#', onClick: () => setTab('orders') },
                  ]}.map(action => (
                    action.onClick
                      ? <button key={action.label} onClick={action.onClick}
                          className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all hover:translate-x-1"
                          style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #e8edf2' }}>
                          {action.label}
                        </button>
                      : <Link key={action.label} href={action.href}
                          className="block px-4 py-3 rounded-xl text-sm font-medium transition-all hover:translate-x-1"
                          style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #e8edf2' }}>
                          {action.label}
                        </Link>
                  ))}
                </div>
              </div>

              <div className="card p-6" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
                <h3 className="font-bold text-white mb-2">Complete Your Profile</h3>
                <p className="text-xs mb-4" style={{ color: '#64748b' }}>Add GST details to unlock all features</p>
                <div className="w-full rounded-full h-2 mb-3" style={{ background: '#334155' }}>
                  <div className="h-2 rounded-full" style={{ background: '#f59e0b', width: '40%' }} />
                </div>
                <p className="text-xs font-medium" style={{ color: '#f59e0b' }}>40% complete</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Products Tab (Supplier only) ── */}
        {tab === 'products' && isSupplier && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">My Products ({products.length})</h3>
              <button onClick={() => setShowAddProduct(!showAddProduct)}
                className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold">
                {showAddProduct ? '✕ Cancel' : '+ Add Product'}
              </button>
            </div>

            {/* Add product form */}
            {showAddProduct && (
              <div className="card p-8 mb-6" style={{ border: '2px solid #f59e0b' }}>
                <h4 className="text-lg font-bold text-gray-800 mb-6">Add New Product</h4>
                <form onSubmit={handleAddProduct} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>Product Name *</label>
                      <input type="text" required value={productForm.name}
                        onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="e.g. 22kW AC EV Charger"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                        onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                        onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>Brand</label>
                      <input type="text" value={productForm.brand}
                        onChange={e => setProductForm({ ...productForm, brand: e.target.value })}
                        placeholder="e.g. Tata, Havells"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                        onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                        onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>Base Price (₹) *</label>
                      <input type="number" required min="0" value={productForm.basePrice}
                        onChange={e => setProductForm({ ...productForm, basePrice: e.target.value })}
                        placeholder="e.g. 45000"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                        onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                        onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>MOQ (Min Order Qty)</label>
                      <input type="number" min="1" value={productForm.moq}
                        onChange={e => setProductForm({ ...productForm, moq: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                        onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                        onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>Category</label>
                      <select value={productForm.categoryId}
                        onChange={e => setProductForm({ ...productForm, categoryId: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                        onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                        onBlur={e => (e.target.style.borderColor = '#e2e8f0')}>
                        <option value="">Select category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>Delivery Timeline</label>
                      <input type="text" value={productForm.deliveryTimeline}
                        onChange={e => setProductForm({ ...productForm, deliveryTimeline: e.target.value })}
                        placeholder="e.g. 5-7 days"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                        onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                        onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>Description</label>
                    <textarea rows={3} value={productForm.description}
                      onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Describe your product..."
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                      style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                      onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                      onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                  </div>
                  <button type="submit" disabled={saving}
                    className="w-full py-3.5 rounded-xl font-bold text-base transition-all"
                    style={{ background: saving ? '#92400e' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>
                    {saving ? 'Saving...' : '+ Add Product'}
                  </button>
                </form>
              </div>
            )}

            {/* Product list */}
            {products.length === 0 ? (
              <div className="card p-16 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h4 className="text-xl font-bold text-gray-600 mb-2">No products yet</h4>
                <p className="text-gray-400 mb-6">Add your first product to start receiving orders</p>
                <button onClick={() => setShowAddProduct(true)} className="btn-primary px-8 py-3 rounded-xl">
                  + Add First Product
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((p: any) => (
                  <div key={p.id} className="card p-5 flex items-center gap-5">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 text-3xl"
                      style={{ background: '#f8fafc' }}>⚡</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-800 truncate">{p.name}</h4>
                        {p.active
                          ? <span className="badge badge-green text-xs">Active</span>
                          : <span className="badge text-xs" style={{ background: '#fee2e2', color: '#dc2626' }}>Inactive</span>}
                      </div>
                      <div className="flex items-center gap-4 text-sm" style={{ color: '#64748b' }}>
                        <span>₹{p.basePrice?.toLocaleString('en-IN') || 'N/A'}</span>
                        <span>MOQ: {p.moq || 1}</span>
                        <span>{p.category?.name || 'Uncategorized'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Link href={`/products/${p.id}`}
                        className="px-4 py-2 rounded-lg text-xs font-bold"
                        style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #e8edf2' }}>
                        View
                      </Link>
                      <button onClick={() => handleDeleteProduct(p.id)}
                        className="px-4 py-2 rounded-lg text-xs font-bold"
                        style={{ background: '#fee2e2', color: '#dc2626' }}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── RFQs Tab ── */}
        {tab === 'rfqs' && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              {isSupplier ? 'Open RFQs from Buyers' : 'My RFQ Requests'} ({rfqs.length})
            </h3>
            {rfqs.length === 0 ? (
              <div className="card p-16 text-center">
                <div className="text-6xl mb-4">📩</div>
                <h4 className="text-xl font-bold text-gray-600 mb-2">No RFQs yet</h4>
                <p className="text-gray-400 mb-6">
                  {isSupplier ? 'Open RFQs from buyers will appear here' : 'Post your first requirement to get quotes'}
                </p>
                <Link href="/rfq" className="btn-primary px-8 py-3 rounded-xl inline-block">
                  Post a Requirement
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {rfqs.map((rfq: any) => (
                  <div key={rfq.id} className="card p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-gray-800 text-lg">{rfq.productName}</h4>
                          <span className="badge badge-blue">{rfq.status}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm mb-3" style={{ color: '#64748b' }}>
                          <span>📦 Qty: <strong>{rfq.quantity} {rfq.unit}</strong></span>
                          <span>📍 {rfq.deliveryLocation || 'Location not specified'}</span>
                          {rfq.deliveryDeadline && <span>📅 By: {new Date(rfq.deliveryDeadline).toLocaleDateString('en-IN')}</span>}
                        </div>
                        {rfq.description && (
                          <p className="text-sm line-clamp-2" style={{ color: '#94a3b8' }}>{rfq.description}</p>
                        )}
                      </div>
                      {isSupplier && (
                        <button className="px-5 py-2.5 rounded-xl text-sm font-bold flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>
                          Send Quote
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Orders Tab ── */}
        {tab === 'orders' && (
          <div className="card p-16 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h4 className="text-xl font-bold text-gray-600 mb-2">No orders yet</h4>
            <p className="text-gray-400 mb-6">Orders will appear here once placed</p>
            <Link href="/products" className="btn-primary px-8 py-3 rounded-xl inline-block">
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
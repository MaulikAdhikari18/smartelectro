'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SellerNavbar from '@/components/SellerNavbar';
import api from '@/lib/api';

const categories = [
  { id: 1, name: 'EV Chargers' }, { id: 2, name: 'Commercial Induction' },
  { id: 3, name: 'Industrial Equipment' }, { id: 4, name: 'Solar & Renewable' },
  { id: 5, name: 'Wiring & Components' }, { id: 6, name: 'Automation Systems' },
];

export default function SellerProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', basePrice: '', moq: '1',
    brand: '', deliveryTimeline: '5-7 days', categoryId: '', specsJson: '{}'
  });

  useEffect(() => {
    const token = localStorage.getItem('sellerToken');
    if (!token) { router.push('/login'); return; }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch { }
    finally { setLoading(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/products', {
        ...form,
        basePrice: Number(form.basePrice),
        moq: Number(form.moq),
        category: form.categoryId ? { id: Number(form.categoryId) } : null,
        active: true,
      });
      setShowForm(false);
      setForm({ name: '', description: '', basePrice: '', moq: '1', brand: '', deliveryTimeline: '5-7 days', categoryId: '', specsJson: '{}' });
      fetchProducts();
    } catch { alert('Failed to add product. Please try again.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this product?')) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  const inputStyle = {
    background: '#0f172a', border: '1px solid #334155',
    borderRadius: '0.75rem', color: 'white',
    padding: '0.875rem 1rem', width: '100%',
    fontSize: '0.875rem', outline: 'none'
  };

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh' }}>
      <SellerNavbar />

      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white">My Products</h1>
              <p className="text-sm mt-1" style={{ color: '#64748b' }}>{products.length} products in your catalog</p>
            </div>
            <button onClick={() => setShowForm(!showForm)}
              className="btn-primary px-6 py-3 rounded-xl font-bold text-sm">
              {showForm ? '✕ Cancel' : '+ Add Product'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Add product form */}
        {showForm && (
          <div className="rounded-2xl p-8 mb-8" style={{ background: 'white', border: '2px solid #f59e0b' }}>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Add New Product</h3>
            <form onSubmit={handleAdd} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { key: 'name', label: 'Product Name *', placeholder: '22kW AC EV Charger', type: 'text', required: true },
                  { key: 'brand', label: 'Brand', placeholder: 'Tata, Havells...', type: 'text', required: false },
                  { key: 'basePrice', label: 'Base Price (₹) *', placeholder: '45000', type: 'number', required: true },
                  { key: 'moq', label: 'MOQ (Min Order Qty)', placeholder: '1', type: 'number', required: false },
                  { key: 'deliveryTimeline', label: 'Delivery Timeline', placeholder: '5-7 days', type: 'text', required: false },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>{field.label}</label>
                    <input type={field.type} required={field.required}
                      value={(form as any)[field.key]}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3.5 rounded-xl text-sm outline-none"
                      style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                      onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                      onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>Category</label>
                  <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none"
                    style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                    onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                    onBlur={e => (e.target.style.borderColor = '#e2e8f0')}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>Description</label>
                <textarea rows={3} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your product in detail..."
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none resize-none"
                  style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                  onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                  onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
              </div>
              <button type="submit" disabled={saving}
                className="w-full py-4 rounded-xl font-bold text-base transition-all"
                style={{ background: saving ? '#92400e' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>
                {saving ? 'Adding Product...' : '+ Add Product'}
              </button>
            </form>
          </div>
        )}

        {/* Products list */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-5 animate-pulse flex gap-4">
                <div className="w-16 h-16 rounded-xl" style={{ background: '#e2e8f0' }} />
                <div className="flex-1 space-y-2">
                  <div className="h-4 rounded" style={{ background: '#e2e8f0', width: '50%' }} />
                  <div className="h-3 rounded" style={{ background: '#e2e8f0', width: '30%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 && !showForm ? (
          <div className="card p-20 text-center">
            <div className="text-7xl mb-5">📦</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-3">No products yet</h3>
            <p className="text-gray-400 mb-8">Add your first product to start receiving orders from B2B buyers</p>
            <button onClick={() => setShowForm(true)} className="btn-primary px-10 py-4 rounded-xl font-bold inline-block">
              + Add Your First Product
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map(p => (
              <div key={p.id} className="card p-5 flex items-center gap-5">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: '#fef3c7' }}>⚡</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-800 truncate">{p.name}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0"
                      style={{ background: p.active ? '#dcfce7' : '#fee2e2', color: p.active ? '#15803d' : '#dc2626' }}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm" style={{ color: '#64748b' }}>
                    <span>₹{p.basePrice?.toLocaleString('en-IN')}</span>
                    <span>MOQ: {p.moq || 1} units</span>
                    <span>{p.category?.name || 'Uncategorized'}</span>
                    <span>🚚 {p.deliveryTimeline || '5-7 days'}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleDelete(p.id)}
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
    </div>
  );
}
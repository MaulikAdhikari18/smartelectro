'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SellerNavbar from '@/components/SellerNavbar';
import api from '@/lib/api';

export default function SellerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sellerToken');
    const name = localStorage.getItem('sellerName');
    const role = localStorage.getItem('sellerRole');
    if (!token || role !== 'SUPPLIER') { router.push('/login'); return; }
    setUser({ name });
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, rfqsRes] = await Promise.all([
        api.get('/products'),
        api.get('/rfq/open').catch(() => ({ data: [] })),
      ]);
      setProducts(productsRes.data);
      setRfqs(rfqsRes.data);
    } catch { }
    finally { setLoading(false); }
  };

  const stats = [
    { label: 'My Products', value: products.length, icon: '📦', bg: '#fef3c7', color: '#b45309' },
    { label: 'Open RFQs', value: rfqs.length, icon: '📩', bg: '#dbeafe', color: '#1d4ed8' },
    { label: 'Orders Today', value: 0, icon: '🛒', bg: '#dcfce7', color: '#15803d' },
    { label: 'Revenue MTD', value: '₹0', icon: '💰', bg: '#f3e8ff', color: '#7c3aed' },
  ];

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh' }}>
      <SellerNavbar />

      {/* Header */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-1">
                Welcome back, <span style={{ color: '#f59e0b' }}>{user?.name?.split(' ')[0]}</span> 👋
              </h1>
              <p className="text-sm" style={{ color: '#64748b' }}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <Link href="/products" className="btn-primary px-6 py-3 rounded-xl font-bold text-sm">
              + Add Product
            </Link>
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
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: s.bg, color: s.color }}>{s.label}</span>
              </div>
              <div className="text-3xl font-extrabold" style={{ color: '#0f172a' }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent products */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800 text-lg">My Products</h3>
              <Link href="/products" className="text-sm font-bold" style={{ color: '#f59e0b' }}>
                View All →
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: '#f1f5f9' }} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">📦</div>
                <p className="font-bold text-gray-600 mb-2">No products yet</p>
                <p className="text-sm text-gray-400 mb-5">Add your first product to start receiving orders</p>
                <Link href="/products" className="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold inline-block">
                  + Add Product
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {products.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ background: '#f8fafc', border: '1px solid #e8edf2' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: '#fef3c7' }}>⚡</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-sm truncate">{p.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>
                        ₹{p.basePrice?.toLocaleString('en-IN')} · MOQ: {p.moq}
                      </p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold flex-shrink-0"
                      style={{ background: p.active ? '#dcfce7' : '#fee2e2', color: p.active ? '#15803d' : '#dc2626' }}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* Open RFQs */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Open RFQs</h3>
                <Link href="/rfqs" className="text-sm font-bold" style={{ color: '#f59e0b' }}>View All →</Link>
              </div>
              {rfqs.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">📩</div>
                  <p className="text-sm text-gray-400">No open RFQs yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rfqs.slice(0, 3).map(r => (
                    <div key={r.id} className="p-3 rounded-xl" style={{ background: '#f8fafc' }}>
                      <p className="text-sm font-bold text-gray-800 truncate">{r.productName}</p>
                      <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>
                        {r.quantity} {r.unit} · {r.deliveryLocation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: '+ Add New Product', href: '/products' },
                  { label: '📩 View RFQ Inbox', href: '/rfqs' },
                  { label: '🛒 View Orders', href: '/orders' },
                  { label: '👤 Edit Profile', href: '/profile' },
                ].map(a => (
                  <Link key={a.href} href={a.href}
                    className="block px-4 py-3 rounded-xl text-sm font-medium transition-all hover:translate-x-1"
                    style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #e8edf2' }}>
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Profile completion */}
            <div className="card p-6" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
              <h3 className="font-bold text-white mb-2">Profile Completion</h3>
              <p className="text-xs mb-3" style={{ color: '#64748b' }}>Complete profile to get more orders</p>
              <div className="w-full h-2 rounded-full mb-2" style={{ background: '#334155' }}>
                <div className="h-2 rounded-full" style={{ background: '#f59e0b', width: '60%' }} />
              </div>
              <p className="text-xs font-bold" style={{ color: '#f59e0b' }}>60% complete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
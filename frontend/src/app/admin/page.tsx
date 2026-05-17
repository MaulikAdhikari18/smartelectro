'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

type AdminTab = 'overview' | 'products' | 'users' | 'rfqs';

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'ADMIN') { router.push('/login'); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, productsRes, rfqsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/products'),
        api.get('/admin/rfqs'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setProducts(productsRes.data);
      setRfqs(rfqsRes.data);
    } catch { router.push('/login'); }
    finally { setLoading(false); }
  };

  const toggleUser = async (id: number) => {
    await api.put(`/admin/users/${id}/toggle`);
    fetchAll();
  };

  const deleteUser = async (id: number) => {
    if (!confirm('Delete this user permanently?')) return;
    await api.delete(`/admin/users/${id}`);
    fetchAll();
  };

  const toggleProduct = async (id: number) => {
    await api.put(`/admin/products/${id}/toggle`);
    fetchAll();
  };

  const toggleFeature = async (id: number) => {
    await api.put(`/admin/products/${id}/feature`);
    fetchAll();
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Delete this product permanently?')) return;
    await api.delete(`/admin/products/${id}`);
    fetchAll();
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#dbeafe', text: '#1d4ed8' },
    { label: 'Total Products', value: stats.totalProducts, icon: '📦', color: '#fef3c7', text: '#b45309' },
    { label: 'Active Products', value: stats.activeProducts, icon: '✅', color: '#dcfce7', text: '#15803d' },
    { label: 'Total Buyers', value: stats.totalBuyers, icon: '🛒', color: '#f3e8ff', text: '#7c3aed' },
    { label: 'Total Suppliers', value: stats.totalSuppliers, icon: '🏭', color: '#fce7f3', text: '#be185d' },
    { label: 'Open RFQs', value: stats.openRfqs, icon: '📩', color: '#e0f2fe', text: '#0369a1' },
  ] : [];

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>A</div>
                <h1 className="text-2xl font-extrabold text-white">Admin Panel</h1>
                <span className="text-xs px-2 py-1 rounded-full font-bold"
                  style={{ background: '#7f1d1d', color: '#fca5a5' }}>ADMIN ONLY</span>
              </div>
              <p className="text-sm" style={{ color: '#64748b' }}>SmartElectro B2B — Full platform control</p>
            </div>
            <button onClick={() => { localStorage.clear(); router.push('/'); }}
              className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: '#7f1d1d', color: '#fca5a5' }}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Stats grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {statCards.map(s => (
              <div key={s.label} className="card p-4 text-center">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-2xl font-extrabold" style={{ color: '#0f172a' }}>{s.value}</div>
                <div className="text-xs font-medium mt-1" style={{ color: '#64748b' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: '#e2e8f0' }}>
          {(['overview', 'products', 'users', 'rfqs'] as AdminTab[]).map(t => (
            <button key={t} onClick={() => { setTab(t); setSearch(''); }}
              className="px-5 py-2.5 rounded-lg text-sm font-bold capitalize transition-all"
              style={{
                background: tab === t ? '#0f172a' : 'transparent',
                color: tab === t ? '#f59e0b' : '#64748b'
              }}>
              {t === 'rfqs' ? 'RFQs' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Search bar for users/products */}
        {(tab === 'users' || tab === 'products') && (
          <div className="mb-6">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${tab}...`}
              className="w-full max-w-md px-5 py-3 rounded-xl text-sm outline-none"
              style={{ border: '1.5px solid #e2e8f0', background: 'white' }}
              onFocus={e => (e.target.style.borderColor = '#f59e0b')}
              onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
          </div>
        )}

        {/* ── Overview ── */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Recent users */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-5">Recent Users</h3>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: '#f1f5f9' }} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {users.slice(0, 5).map(u => (
                    <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: '#f8fafc' }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                        style={{ background: u.role === 'SUPPLIER' ? '#fef3c7' : u.role === 'ADMIN' ? '#fee2e2' : '#dbeafe', color: u.role === 'SUPPLIER' ? '#b45309' : u.role === 'ADMIN' ? '#dc2626' : '#1d4ed8' }}>
                        {u.name?.[0] || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{u.name}</p>
                        <p className="text-xs truncate" style={{ color: '#94a3b8' }}>{u.email}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full font-medium flex-shrink-0"
                        style={{
                          background: u.role === 'SUPPLIER' ? '#fef3c7' : u.role === 'ADMIN' ? '#fee2e2' : '#dbeafe',
                          color: u.role === 'SUPPLIER' ? '#b45309' : u.role === 'ADMIN' ? '#dc2626' : '#1d4ed8'
                        }}>
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent products */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-5">Recent Products</h3>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: '#f1f5f9' }} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {products.slice(0, 5).map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: '#f8fafc' }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ background: '#fef3c7' }}>⚡</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{p.name}</p>
                        <p className="text-xs" style={{ color: '#94a3b8' }}>
                          ₹{p.basePrice?.toLocaleString('en-IN')} · MOQ: {p.moq}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ background: p.active ? '#dcfce7' : '#fee2e2', color: p.active ? '#15803d' : '#dc2626' }}>
                        {p.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Products Tab ── */}
        {tab === 'products' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#0f172a', color: '#94a3b8' }}>
                    <th className="text-left px-5 py-4 font-semibold">Product</th>
                    <th className="text-left px-5 py-4 font-semibold">Category</th>
                    <th className="text-left px-5 py-4 font-semibold">Price</th>
                    <th className="text-left px-5 py-4 font-semibold">MOQ</th>
                    <th className="text-left px-5 py-4 font-semibold">Status</th>
                    <th className="text-left px-5 py-4 font-semibold">Featured</th>
                    <th className="text-left px-5 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p, i) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-800 max-w-xs truncate">{p.name}</div>
                        <div className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{p.brand || '—'}</div>
                      </td>
                      <td className="px-5 py-4" style={{ color: '#64748b' }}>{p.category?.name || '—'}</td>
                      <td className="px-5 py-4 font-bold" style={{ color: '#0f172a' }}>
                        ₹{p.basePrice?.toLocaleString('en-IN') || '—'}
                      </td>
                      <td className="px-5 py-4" style={{ color: '#64748b' }}>{p.moq || 1}</td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{ background: p.active ? '#dcfce7' : '#fee2e2', color: p.active ? '#15803d' : '#dc2626' }}>
                          {p.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{ background: p.featuredProduct ? '#fef3c7' : '#f1f5f9', color: p.featuredProduct ? '#b45309' : '#94a3b8' }}>
                          {p.featuredProduct ? '⭐ Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => toggleProduct(p.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                            style={{ background: p.active ? '#fee2e2' : '#dcfce7', color: p.active ? '#dc2626' : '#15803d' }}>
                            {p.active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button onClick={() => toggleFeature(p.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold"
                            style={{ background: '#fef3c7', color: '#b45309' }}>
                            {p.featuredProduct ? 'Unfeature' : 'Feature'}
                          </button>
                          <button onClick={() => deleteProduct(p.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold"
                            style={{ background: '#fee2e2', color: '#dc2626' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <div className="text-center py-16 text-gray-400">No products found</div>
              )}
            </div>
          </div>
        )}

        {/* ── Users Tab ── */}
        {tab === 'users' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#0f172a', color: '#94a3b8' }}>
                    <th className="text-left px-5 py-4 font-semibold">User</th>
                    <th className="text-left px-5 py-4 font-semibold">Email</th>
                    <th className="text-left px-5 py-4 font-semibold">Role</th>
                    <th className="text-left px-5 py-4 font-semibold">GST</th>
                    <th className="text-left px-5 py-4 font-semibold">Status</th>
                    <th className="text-left px-5 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, i) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                            style={{ background: u.role === 'SUPPLIER' ? '#fef3c7' : u.role === 'ADMIN' ? '#fee2e2' : '#dbeafe', color: u.role === 'SUPPLIER' ? '#b45309' : u.role === 'ADMIN' ? '#dc2626' : '#1d4ed8' }}>
                            {u.name?.[0]}
                          </div>
                          <span className="font-semibold text-gray-800">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4" style={{ color: '#64748b' }}>{u.email}</td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{ background: u.role === 'SUPPLIER' ? '#fef3c7' : u.role === 'ADMIN' ? '#fee2e2' : '#dbeafe', color: u.role === 'SUPPLIER' ? '#b45309' : u.role === 'ADMIN' ? '#dc2626' : '#1d4ed8' }}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs" style={{ color: '#64748b' }}>{u.gstNumber || '—'}</td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{ background: u.active ? '#dcfce7' : '#fee2e2', color: u.active ? '#15803d' : '#dc2626' }}>
                          {u.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          {u.role !== 'ADMIN' && (
                            <>
                              <button onClick={() => toggleUser(u.id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold"
                                style={{ background: u.active ? '#fee2e2' : '#dcfce7', color: u.active ? '#dc2626' : '#15803d' }}>
                                {u.active ? 'Deactivate' : 'Activate'}
                              </button>
                              <button onClick={() => deleteUser(u.id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold"
                                style={{ background: '#fee2e2', color: '#dc2626' }}>
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-16 text-gray-400">No users found</div>
              )}
            </div>
          </div>
        )}

        {/* ── RFQs Tab ── */}
        {tab === 'rfqs' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#0f172a', color: '#94a3b8' }}>
                    <th className="text-left px-5 py-4 font-semibold">Product</th>
                    <th className="text-left px-5 py-4 font-semibold">Buyer</th>
                    <th className="text-left px-5 py-4 font-semibold">Quantity</th>
                    <th className="text-left px-5 py-4 font-semibold">Location</th>
                    <th className="text-left px-5 py-4 font-semibold">Status</th>
                    <th className="text-left px-5 py-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rfqs.map((r, i) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td className="px-5 py-4 font-semibold text-gray-800">{r.productName}</td>
                      <td className="px-5 py-4" style={{ color: '#64748b' }}>{r.buyer?.name || '—'}</td>
                      <td className="px-5 py-4" style={{ color: '#64748b' }}>{r.quantity} {r.unit}</td>
                      <td className="px-5 py-4" style={{ color: '#64748b' }}>{r.deliveryLocation || '—'}</td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{ background: r.status === 'OPEN' ? '#dbeafe' : r.status === 'FULFILLED' ? '#dcfce7' : '#f1f5f9', color: r.status === 'OPEN' ? '#1d4ed8' : r.status === 'FULFILLED' ? '#15803d' : '#64748b' }}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs" style={{ color: '#94a3b8' }}>
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rfqs.length === 0 && (
                <div className="text-center py-16 text-gray-400">No RFQs found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

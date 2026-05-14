'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SellerNavbar from '@/components/SellerNavbar';
import api from '@/lib/api';

export default function SellerRfqsPage() {
  const router = useRouter();
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');

  useEffect(() => {
    const token = localStorage.getItem('sellerToken');
    if (!token) { router.push('/login'); return; }
    api.get('/rfq/open')
      .then(res => setRfqs(res.data))
      .catch(() => setRfqs([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? rfqs : rfqs.filter(r => r.status === filter);

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh' }}>
      <SellerNavbar />

      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-extrabold text-white mb-1">RFQ Inbox</h1>
          <p className="text-sm" style={{ color: '#64748b' }}>
            Buyer requirements matching your product categories
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['ALL', 'OPEN', 'CLOSED'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: filter === f ? '#0f172a' : 'white',
                color: filter === f ? '#f59e0b' : '#64748b',
                border: '1px solid #e8edf2'
              }}>
              {f} {f === 'ALL' ? `(${rfqs.length})` : `(${rfqs.filter(r => r.status === f).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse space-y-3">
                <div className="h-5 rounded" style={{ background: '#e2e8f0', width: '40%' }} />
                <div className="h-4 rounded" style={{ background: '#e2e8f0', width: '60%' }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-20 text-center">
            <div className="text-7xl mb-5">📩</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-3">No RFQs yet</h3>
            <p className="text-gray-400">RFQs from buyers will appear here when they match your categories</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(rfq => (
              <div key={rfq.id} className="card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-800 text-lg">{rfq.productName}</h3>
                      <span className="text-xs px-2.5 py-1 rounded-full font-bold"
                        style={{ background: rfq.status === 'OPEN' ? '#dbeafe' : '#f1f5f9', color: rfq.status === 'OPEN' ? '#1d4ed8' : '#64748b' }}>
                        {rfq.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm mb-3" style={{ color: '#64748b' }}>
                      <span>📦 <strong>{rfq.quantity} {rfq.unit}</strong></span>
                      <span>📍 {rfq.deliveryLocation || 'Location not specified'}</span>
                      {rfq.deliveryDeadline && (
                        <span>📅 By {new Date(rfq.deliveryDeadline).toLocaleDateString('en-IN')}</span>
                      )}
                      <span>🕐 {rfq.createdAt ? new Date(rfq.createdAt).toLocaleDateString('en-IN') : 'Just now'}</span>
                    </div>
                    {rfq.description && (
                      <p className="text-sm p-3 rounded-xl" style={{ background: '#f8fafc', color: '#64748b' }}>
                        {rfq.description}
                      </p>
                    )}
                  </div>
                  {rfq.status === 'OPEN' && (
                    <button className="px-6 py-3 rounded-xl text-sm font-bold flex-shrink-0 transition-all"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>
                      📩 Send Quote
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
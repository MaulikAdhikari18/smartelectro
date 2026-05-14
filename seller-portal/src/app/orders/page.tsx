'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SellerNavbar from '@/components/SellerNavbar';

export default function SellerOrdersPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('sellerToken');
    if (!token) { router.push('/login'); return; }
  }, []);

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh' }}>
      <SellerNavbar />

      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-extrabold text-white mb-1">Orders</h1>
          <p className="text-sm" style={{ color: '#64748b' }}>Manage and track orders from buyers</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="card p-20 text-center">
          <div className="text-7xl mb-5">🛒</div>
          <h3 className="text-2xl font-bold text-gray-600 mb-3">No orders yet</h3>
          <p className="text-gray-400 mb-8">
            Orders from buyers will appear here. Make sure your products are active and visible to buyers.
          </p>
          <Link href="/products" className="btn-primary px-10 py-4 rounded-xl font-bold inline-block">
            Manage Products →
          </Link>
        </div>
      </div>
    </div>
  );
}
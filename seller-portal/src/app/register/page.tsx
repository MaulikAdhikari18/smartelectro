'use client';
import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function SellerRegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', gstNumber: '', role: 'SUPPLIER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', form);
      window.location.href = '/login';
    } catch (err: any) {
      setError(err.response?.data || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0f172a' }}>

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRight: '1px solid #1e293b' }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>SE</div>
          <span className="text-2xl font-extrabold text-white">
            Smart<span style={{ color: '#f59e0b' }}>Electro</span>
            <span className="text-xs font-bold ml-2 px-2 py-0.5 rounded"
              style={{ background: '#f59e0b', color: '#0f172a' }}>SELLER</span>
          </span>
        </Link>

        <div>
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Join 500+ verified<br />suppliers on<br /><span style={{ color: '#f59e0b' }}>SmartElectro B2B</span>
          </h2>
          <p className="text-base mb-8" style={{ color: '#64748b' }}>
            Start selling to 25,000+ industrial buyers, contractors, and government institutions across India.
          </p>
          <div className="space-y-3">
            {['Free to register', 'GST invoice automation', 'Pan India buyer network', 'RFQ notifications instantly', 'Dedicated seller dashboard'].map(item => (
              <div key={item} className="flex items-center gap-3">
                <span style={{ color: '#f59e0b' }}>✓</span>
                <span className="text-sm font-medium" style={{ color: '#94a3b8' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm" style={{ color: '#475569' }}>© 2024 SmartElectro B2B · Seller Portal</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2">Create Seller Account</h1>
            <p style={{ color: '#64748b' }}>Start selling to B2B buyers across India</p>
          </div>

          <div className="rounded-2xl p-8" style={{ background: '#1e293b', border: '1px solid #334155' }}>
            {error && (
              <div className="mb-5 px-4 py-3 rounded-lg text-sm font-medium"
                style={{ background: '#450a0a', border: '1px solid #7f1d1d', color: '#fca5a5' }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8' }}>
                  Full Name / Business Name *
                </label>
                <input type="text" required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Rajesh Kumar / Kumar Electricals"
                  className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: '#0f172a', border: '1px solid #334155' }}
                  onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                  onBlur={e => (e.target.style.borderColor = '#334155')} />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8' }}>
                  Business Email *
                </label>
                <input type="email" required value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: '#0f172a', border: '1px solid #334155' }}
                  onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                  onBlur={e => (e.target.style.borderColor = '#334155')} />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8' }}>
                  Phone Number *
                </label>
                <input type="tel" required value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: '#0f172a', border: '1px solid #334155' }}
                  onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                  onBlur={e => (e.target.style.borderColor = '#334155')} />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8' }}>
                  GST Number *
                </label>
                <input type="text" required value={form.gstNumber}
                  onChange={e => setForm({ ...form, gstNumber: e.target.value })}
                  placeholder="22AAAAA0000A1Z5"
                  className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: '#0f172a', border: '1px solid #334155' }}
                  onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                  onBlur={e => (e.target.style.borderColor = '#334155')} />
                <p className="text-xs mt-1.5" style={{ color: '#475569' }}>
                  Required for GST invoicing and supplier verification
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8' }}>
                  Password *
                </label>
                <input type="password" required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: '#0f172a', border: '1px solid #334155' }}
                  onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                  onBlur={e => (e.target.style.borderColor = '#334155')} />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-base transition-all mt-2"
                style={{ background: loading ? '#92400e' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>
                {loading ? 'Creating account...' : 'Create Seller Account →'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm" style={{ color: '#64748b' }}>
              Already have an account?{' '}
              <Link href="/login" className="font-bold hover:underline" style={{ color: '#f59e0b' }}>
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
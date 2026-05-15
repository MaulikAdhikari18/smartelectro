'use client';
import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function SellerLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      const { token, role, name, userId } = res.data;

      if (role !== 'SUPPLIER') {
        setError('This account is not a seller account. Please register as a seller.');
        setLoading(false);
        return;
      }

      localStorage.setItem('sellerToken', token);
      localStorage.setItem('sellerRole', role);
      localStorage.setItem('sellerName', name);
      localStorage.setItem('sellerId', String(userId));

      // Also set for api.ts interceptor
      localStorage.setItem('token', token);

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data || 'Invalid email or password');
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
          <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
            Grow your business<br />with <span style={{ color: '#f59e0b' }}>25,000+</span><br />B2B buyers
          </h2>
          <div className="space-y-4">
            {[
              ['📦', 'List unlimited products'],
              ['📩', 'Receive bulk RFQs from buyers'],
              ['💰', 'Get paid with GST invoicing'],
              ['📊', 'Track orders and analytics'],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <span className="text-base font-medium" style={{ color: '#94a3b8' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm" style={{ color: '#475569' }}>
          © 2024 SmartElectro B2B · Seller Portal
        </p>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-white mb-2">Seller Login</h1>
            <p style={{ color: '#64748b' }}>Sign in to your seller account</p>
          </div>

          <div className="rounded-2xl p-8" style={{ background: '#1e293b', border: '1px solid #334155' }}>
            {error && (
              <div className="mb-5 px-4 py-3 rounded-lg text-sm font-medium"
                style={{ background: '#450a0a', border: '1px solid #7f1d1d', color: '#fca5a5' }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8' }}>
                  Business Email
                </label>
                <input type="email" required value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all"
                  style={{ background: '#0f172a', border: '1px solid #334155' }}
                  onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                  onBlur={e => (e.target.style.borderColor = '#334155')} />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8' }}>
                  Password
                </label>
                <input type="password" required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all"
                  style={{ background: '#0f172a', border: '1px solid #334155' }}
                  onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                  onBlur={e => (e.target.style.borderColor = '#334155')} />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-base transition-all"
                style={{ background: loading ? '#92400e' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>
                {loading ? 'Signing in...' : 'Sign in to Seller Portal →'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm" style={{ color: '#64748b' }}>
              New seller?{' '}
              <Link href="/register" className="font-bold hover:underline" style={{ color: '#f59e0b' }}>
                Register your business
              </Link>
            </div>
          </div>

          <p className="text-center text-xs mt-6" style={{ color: '#475569' }}>
            🔒 Secure login · GST Verified Platform
          </p>
        </div>
      </div>
    </div>
  );
}
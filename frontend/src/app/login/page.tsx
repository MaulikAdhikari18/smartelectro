'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'BUYER' | 'SUPPLIER'>('BUYER');
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

      // Check if logged-in role matches selected role
      if (role !== selectedRole) {
        setError(`This account is registered as a ${role}. Please select "${role === 'BUYER' ? 'I want to Buy' : 'I want to Sell'}" to continue.`);
        setLoading(false);
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userName', name);
      localStorage.setItem('userId', String(userId));

      window.dispatchEvent(new Event('storage'));
      if (role === 'ADMIN') router.push('/admin');
      else if (role === 'SUPPLIER') router.push('/dashboard');
      else router.push('/');
    } catch (err: any) {
      setError(err.response?.data || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>

      <div className="w-full max-w-2xl">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-base"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>SE</div>
            <span className="text-3xl font-extrabold text-white">Smart<span style={{ color: '#f59e0b' }}>Electro</span></span>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-3">Welcome back</h1>
          <p className="text-lg" style={{ color: '#64748b' }}>Sign in to your B2B account</p>
        </div>

        <div className="rounded-2xl p-10" style={{ background: '#1e293b', border: '1px solid #334155' }}>

          {/* Role toggle */}
          <div className="flex rounded-xl p-1.5 mb-8" style={{ background: '#0f172a' }}>
            {(['BUYER', 'SUPPLIER'] as const).map(r => (
              <button key={r} type="button"
                onClick={() => { setSelectedRole(r); setError(''); }}
                className="flex-1 py-3.5 rounded-lg text-base font-bold transition-all"
                style={{
                  background: selectedRole === r ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                  color: selectedRole === r ? '#0f172a' : '#64748b'
                }}>
                {r === 'BUYER' ? '🛒 Login as Buyer' : '🏭 Login as Supplier'}
              </button>
            ))}
          </div>

          {/* Role description */}
          <div className="mb-6 px-4 py-3 rounded-xl text-sm"
            style={{ background: '#0f172a', border: '1px solid #334155' }}>
            {selectedRole === 'BUYER'
              ? <p style={{ color: '#94a3b8' }}>🛒 <strong style={{ color: '#f59e0b' }}>Buyer account</strong> — Browse products, post RFQs, place bulk orders</p>
              : <p style={{ color: '#94a3b8' }}>🏭 <strong style={{ color: '#f59e0b' }}>Supplier account</strong> — Manage products, respond to RFQs, receive orders</p>
            }
          </div>

          {error && (
            <div className="mb-6 px-5 py-4 rounded-lg text-sm font-medium"
              style={{ background: '#450a0a', border: '1px solid #7f1d1d', color: '#fca5a5' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-base font-medium mb-2.5" style={{ color: '#94a3b8' }}>Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                className="w-full px-5 py-4 rounded-xl text-white text-base outline-none transition-all"
                style={{ background: '#0f172a', border: '1px solid #334155', color: 'white' }}
                onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                onBlur={e => (e.target.style.borderColor = '#334155')}
              />
            </div>

            <div>
              <label className="block text-base font-medium mb-2.5" style={{ color: '#94a3b8' }}>Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-xl text-white text-base outline-none transition-all"
                style={{ background: '#0f172a', border: '1px solid #334155' }}
                onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                onBlur={e => (e.target.style.borderColor = '#334155')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-lg transition-all"
              style={{ background: loading ? '#92400e' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>
              {loading ? 'Signing in...' : `Sign in as ${selectedRole === 'BUYER' ? 'Buyer' : 'Supplier'} →`}
            </button>
          </form>

          <div className="mt-8 text-center text-base" style={{ color: '#64748b' }}>
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold hover:underline" style={{ color: '#f59e0b' }}>
              Register free
            </Link>
          </div>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: '#475569' }}>
          🔒 Secure login · GST Verified Platform · 25,000+ B2B Buyers
        </p>
      </div>
    </div>
  );
}
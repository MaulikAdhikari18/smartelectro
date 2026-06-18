'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', gstNumber: '', role: 'BUYER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      const { token, role, name, userId } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userName', name);
      localStorage.setItem('userId', userId);
      if (role === 'SUPPLIER') router.push('/dashboard');
      else router.push('/');
    } catch (err: any) {
      setError(err.response?.data || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>SE</div>
            <span className="text-2xl font-extrabold text-white">Smart<span style={{ color: '#f59e0b' }}>Electro</span></span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p style={{ color: '#64748b' }}>Join 25,000+ B2B buyers and suppliers</p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: '#1e293b', border: '1px solid #334155' }}>

          {/* Role toggle */}
          <div className="flex rounded-xl p-1 mb-6" style={{ background: '#0f172a' }}>
            {(['BUYER', 'SUPPLIER'] as const).map(r => (
              <button key={r} type="button"
                onClick={() => setForm({ ...form, role: r })}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
                style={{
                  background: form.role === r ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                  color: form.role === r ? '#0f172a' : '#64748b'
                }}>
                {r === 'BUYER' ? '🛒 I want to Buy' : '🏭 I want to Sell'}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg text-sm font-medium"
              style={{ background: '#450a0a', border: '1px solid #7f1d1d', color: '#fca5a5' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Full Name *</label>
                <input type="text" required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Rajesh Kumar"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none text-white"
                  style={{ background: '#0f172a', border: '1px solid #334155' }}
                  onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                  onBlur={e => (e.target.style.borderColor = '#334155')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Phone Number</label>
                <input type="tel" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none text-white"
                  style={{ background: '#0f172a', border: '1px solid #334155' }}
                  onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                  onBlur={e => (e.target.style.borderColor = '#334155')} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Email Address *</label>
              <input type="email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none text-white"
                style={{ background: '#0f172a', border: '1px solid #334155' }}
                onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                onBlur={e => (e.target.style.borderColor = '#334155')} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Password *</label>
              <input type="password" required value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Min 6 characters"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none text-white"
                style={{ background: '#0f172a', border: '1px solid #334155' }}
                onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                onBlur={e => (e.target.style.borderColor = '#334155')} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>
                GST Number {form.role === 'SUPPLIER' ? '*' : '(optional)'}
              </label>
              <input type="text" value={form.gstNumber}
                onChange={e => setForm({ ...form, gstNumber: e.target.value })}
                placeholder="22AAAAA0000A1Z5"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none text-white"
                style={{ background: '#0f172a', border: '1px solid #334155' }}
                onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                onBlur={e => (e.target.style.borderColor = '#334155')} />
              <p className="text-xs mt-1" style={{ color: '#475569' }}>Required for GST invoicing and verification</p>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-base transition-all mt-2"
              style={{ background: loading ? '#92400e' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>
              {loading ? 'Creating account...' : `Create ${form.role === 'BUYER' ? 'Buyer' : 'Supplier'} Account →`}
            </button>
          </form>

          <div className="mt-6 text-center text-sm" style={{ color: '#64748b' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: '#f59e0b' }}>Sign in</Link>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#475569' }}>
          🔒 Your data is secure · No spam · Cancel anytime
        </p>
      </div>
    </div>
  );
}
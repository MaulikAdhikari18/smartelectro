'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const categories = [
  { id: 1, name: 'EV Chargers' },
  { id: 2, name: 'Commercial Induction' },
  { id: 3, name: 'Industrial Equipment' },
  { id: 4, name: 'Solar & Renewable' },
  { id: 5, name: 'Wiring & Components' },
  { id: 6, name: 'Automation Systems' },
];

const units = ['Pieces', 'Units', 'Kg', 'Metres', 'Litres', 'Sets', 'Boxes'];

const steps = ['Product Details', 'Quantity & Delivery', 'Review & Submit'];

export default function RfqPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [form, setForm] = useState({
    productName: '',
    categoryId: '',
    description: '',
    quantity: '',
    unit: 'Pieces',
    deliveryLocation: '',
    deliveryDeadline: '',
  });

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!isLoggedIn) { router.push('/login'); return; }
    setLoading(true);
    try {
      await api.post('/rfq', {
        ...form,
        quantity: Number(form.quantity),
        category: form.categoryId ? { id: Number(form.categoryId) } : null,
      });
      setSubmitted(true);
    } catch {
      alert('Failed to submit RFQ. Please login and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
      <div className="text-center max-w-lg">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>✓</div>
        <h2 className="text-4xl font-extrabold text-white mb-4">RFQ Submitted!</h2>
        <p className="text-lg mb-3" style={{ color: '#94a3b8' }}>
          Your requirement for <strong style={{ color: '#f59e0b' }}>{form.productName}</strong> has been sent to matching suppliers.
        </p>
        <p className="text-sm mb-10" style={{ color: '#64748b' }}>
          You'll receive quotes within 24 hours via email and your dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard" className="btn-primary px-8 py-4 rounded-xl font-bold">
            View My RFQs →
          </Link>
          <button onClick={() => { setSubmitted(false); setStep(0); setForm({ productName: '', categoryId: '', description: '', quantity: '', unit: 'Pieces', deliveryLocation: '', deliveryDeadline: '' }); }}
            className="px-8 py-4 rounded-xl font-bold transition-all"
            style={{ border: '2px solid #334155', color: '#94a3b8' }}>
            Post Another RFQ
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm mb-4" style={{ color: '#64748b' }}>
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span>/</span>
            <span style={{ color: '#f59e0b' }}>Post Requirement</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Post Your Requirement</h1>
          <p style={{ color: '#64748b' }}>Get competitive quotes from verified suppliers within 24 hours</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main form ── */}
          <div className="lg:col-span-2">

            {/* Step indicator */}
            <div className="flex items-center mb-8">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                      style={{
                        background: i <= step ? 'linear-gradient(135deg, #f59e0b, #d97706)' : '#e2e8f0',
                        color: i <= step ? '#0f172a' : '#94a3b8'
                      }}>
                      {i < step ? '✓' : i + 1}
                    </div>
                    <span className="text-xs mt-1.5 font-medium whitespace-nowrap"
                      style={{ color: i <= step ? '#f59e0b' : '#94a3b8' }}>{s}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-3 mb-4 rounded transition-all"
                      style={{ background: i < step ? '#f59e0b' : '#e2e8f0' }} />
                  )}
                </div>
              ))}
            </div>

            {/* Card */}
            <div className="rounded-2xl p-8" style={{ background: 'white', border: '1px solid #e8edf2' }}>

              {/* Step 0 — Product Details */}
              {step === 0 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">What do you need?</h2>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>Product Name *</label>
                    <input type="text" value={form.productName}
                      onChange={e => update('productName', e.target.value)}
                      placeholder="e.g. 22kW AC EV Charger, Commercial Induction Cooktop..."
                      className="w-full px-5 py-4 rounded-xl text-base outline-none transition-all"
                      style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                      onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                      onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>Category</label>
                    <select value={form.categoryId} onChange={e => update('categoryId', e.target.value)}
                      className="w-full px-5 py-4 rounded-xl text-base outline-none transition-all appearance-none"
                      style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc', color: form.categoryId ? '#0f172a' : '#94a3b8' }}
                      onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                      onBlur={e => (e.target.style.borderColor = '#e2e8f0')}>
                      <option value="">Select a category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>
                      Describe Your Requirement
                    </label>
                    <textarea value={form.description} onChange={e => update('description', e.target.value)}
                      rows={5} placeholder="Include specifications, technical details, certifications needed, preferred brands, installation requirements, etc."
                      className="w-full px-5 py-4 rounded-xl text-base outline-none transition-all resize-none"
                      style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                      onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                      onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                    <p className="text-xs mt-1.5" style={{ color: '#94a3b8' }}>More details = better quotes from suppliers</p>
                  </div>

                  <button onClick={() => { if (form.productName.trim()) setStep(1); }}
                    disabled={!form.productName.trim()}
                    className="w-full py-4 rounded-xl font-bold text-lg transition-all"
                    style={{
                      background: form.productName.trim() ? 'linear-gradient(135deg, #f59e0b, #d97706)' : '#e2e8f0',
                      color: form.productName.trim() ? '#0f172a' : '#94a3b8'
                    }}>
                    Next: Quantity & Delivery →
                  </button>
                </div>
              )}

              {/* Step 1 — Quantity & Delivery */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Quantity & Delivery Details</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>Quantity Required *</label>
                      <input type="number" min="1" value={form.quantity}
                        onChange={e => update('quantity', e.target.value)}
                        placeholder="e.g. 100"
                        className="w-full px-5 py-4 rounded-xl text-base outline-none transition-all"
                        style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                        onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                        onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>Unit</label>
                      <select value={form.unit} onChange={e => update('unit', e.target.value)}
                        className="w-full px-5 py-4 rounded-xl text-base outline-none transition-all"
                        style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                        onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                        onBlur={e => (e.target.style.borderColor = '#e2e8f0')}>
                        {units.map(u => <option key={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>Delivery Location *</label>
                    <input type="text" value={form.deliveryLocation}
                      onChange={e => update('deliveryLocation', e.target.value)}
                      placeholder="e.g. Mumbai, Maharashtra"
                      className="w-full px-5 py-4 rounded-xl text-base outline-none transition-all"
                      style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                      onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                      onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>Required By Date</label>
                    <input type="date" value={form.deliveryDeadline}
                      onChange={e => update('deliveryDeadline', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-5 py-4 rounded-xl text-base outline-none transition-all"
                      style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                      onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                      onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(0)}
                      className="flex-1 py-4 rounded-xl font-bold text-base transition-all"
                      style={{ border: '2px solid #e2e8f0', color: '#64748b' }}>
                      ← Back
                    </button>
                    <button onClick={() => { if (form.quantity && form.deliveryLocation) setStep(2); }}
                      disabled={!form.quantity || !form.deliveryLocation}
                      className="flex-1 py-4 rounded-xl font-bold text-base transition-all"
                      style={{
                        background: (form.quantity && form.deliveryLocation) ? 'linear-gradient(135deg, #f59e0b, #d97706)' : '#e2e8f0',
                        color: (form.quantity && form.deliveryLocation) ? '#0f172a' : '#94a3b8'
                      }}>
                      Next: Review →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 — Review */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Review Your Requirement</h2>

                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e8edf2' }}>
                    {[
                      ['Product', form.productName],
                      ['Category', categories.find(c => String(c.id) === form.categoryId)?.name || 'Not specified'],
                      ['Quantity', `${form.quantity} ${form.unit}`],
                      ['Delivery Location', form.deliveryLocation],
                      ['Required By', form.deliveryDeadline || 'Flexible'],
                      ['Description', form.description || 'Not provided'],
                    ].map(([key, val], i) => (
                      <div key={key} className="flex gap-4 px-5 py-4"
                        style={{ background: i % 2 === 0 ? '#f8fafc' : 'white', borderBottom: '1px solid #f1f5f9' }}>
                        <span className="text-sm font-semibold w-40 flex-shrink-0" style={{ color: '#475569' }}>{key}</span>
                        <span className="text-sm font-medium" style={{ color: '#0f172a' }}>{val}</span>
                      </div>
                    ))}
                  </div>

                  {!isLoggedIn && (
                    <div className="p-4 rounded-xl text-sm font-medium"
                      style={{ background: '#fef3c7', border: '1px solid #fcd34d', color: '#92400e' }}>
                      ⚠️ You need to <Link href="/login" className="underline font-bold">login</Link> before submitting your RFQ.
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)}
                      className="flex-1 py-4 rounded-xl font-bold text-base"
                      style={{ border: '2px solid #e2e8f0', color: '#64748b' }}>
                      ← Back
                    </button>
                    <button onClick={handleSubmit} disabled={loading}
                      className="flex-1 py-4 rounded-xl font-bold text-base transition-all"
                      style={{ background: loading ? '#92400e' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>
                      {loading ? 'Submitting...' : '📩 Submit Requirement'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">
            <div className="rounded-2xl p-6" style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
              <h3 className="font-bold text-white mb-4">How RFQ Works</h3>
              {[
                ['📝', 'Post your requirement with specs and quantity'],
                ['🔔', 'Suppliers get notified instantly'],
                ['💬', 'Receive quotes within 24 hours'],
                ['✅', 'Compare and place your order'],
              ].map(([icon, text]) => (
                <div key={text as string} className="flex gap-3 mb-4 last:mb-0">
                  <span className="text-xl flex-shrink-0">{icon}</span>
                  <span className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{text as string}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #e8edf2' }}>
              <h3 className="font-bold text-gray-800 mb-4">Why Use RFQ?</h3>
              {['Get competitive pricing from multiple suppliers', 'No obligation to buy', 'Save time on negotiations', 'Verified suppliers only', 'GST invoice guaranteed'].map(item => (
                <div key={item} className="flex gap-2 mb-3 last:mb-0">
                  <span style={{ color: '#f59e0b' }}>⚡</span>
                  <span className="text-sm" style={{ color: '#64748b' }}>{item}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-6 text-center" style={{ background: '#fef3c7', border: '1px solid #fcd34d' }}>
              <div className="text-3xl mb-2">⚡</div>
              <p className="text-sm font-bold mb-1" style={{ color: '#92400e' }}>Average Response Time</p>
              <p className="text-3xl font-extrabold" style={{ color: '#b45309' }}>4 Hours</p>
              <p className="text-xs mt-1" style={{ color: '#92400e' }}>from verified suppliers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(stored);
  }, []);

  const updateQty = (productId: number, qty: number) => {
    const updated = cart.map(i => i.productId === productId ? { ...i, quantity: Math.max(1, qty) } : i);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (productId: number) => {
    const updated = cart.filter(i => i.productId !== productId);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const subtotal = cart.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);
  const gst = subtotal * 0.18;
  const shipping = subtotal > 10000 ? 0 : 500;
  const total = subtotal + gst + shipping;

  const handlePlaceOrder = async () => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    if (!address.trim()) { alert('Please enter delivery address'); return; }
    setLoading(true);
    try {
      await api.post('/orders', {
        items: cart.map(i => ({
          product: { id: i.productId },
          quantity: i.quantity,
          pricePerUnit: i.price,
          totalPrice: i.price * i.quantity,
        })),
        subtotal,
        gstAmount: gst,
        shippingCost: shipping,
        totalAmount: total,
        shippingAddress: address,
        paymentMethod,
      });
      localStorage.removeItem('cart');
      setCart([]);
      setStep('success');
    } catch {
      alert('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
      <div className="text-center max-w-lg">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>✓</div>
        <h2 className="text-4xl font-extrabold text-white mb-4">Order Placed!</h2>
        <p className="text-lg mb-3" style={{ color: '#94a3b8' }}>
          Your order has been confirmed. GST invoice will be sent to your email.
        </p>
        <p className="text-sm mb-10" style={{ color: '#64748b' }}>
          You can track your order in the dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard" className="btn-primary px-8 py-4 rounded-xl font-bold">
            Track Order →
          </Link>
          <Link href="/products"
            className="px-8 py-4 rounded-xl font-bold transition-all"
            style={{ border: '2px solid #334155', color: '#94a3b8' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm mb-3" style={{ color: '#64748b' }}>
            <Link href="/" className="hover:text-amber-400">Home</Link>
            <span>/</span>
            <span style={{ color: '#f59e0b' }}>Cart & Checkout</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            {step === 'cart' ? `My Cart (${cart.length} items)` : 'Checkout'}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {cart.length === 0 && step === 'cart' ? (
          <div className="card p-20 text-center">
            <div className="text-7xl mb-5">🛒</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-3">Your cart is empty</h3>
            <p className="text-gray-400 mb-8">Add products to your cart to get started</p>
            <Link href="/products" className="btn-primary px-10 py-4 rounded-xl font-bold inline-block">
              Browse Products →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: Items / Checkout form ── */}
            <div className="lg:col-span-2 space-y-4">
              {step === 'cart' ? (
                <>
                  {cart.map(item => (
                    <div key={item.productId} className="card p-5 flex gap-5 items-center">
                      <div className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 text-4xl"
                        style={{ background: '#f8fafc' }}>
                        {item.image || '⚡'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 mb-1 truncate">{item.name}</h4>
                        <p className="text-sm mb-3" style={{ color: '#64748b' }}>
                          ₹{Number(item.price).toLocaleString('en-IN')} per unit
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid #e8edf2' }}>
                            <button onClick={() => updateQty(item.productId, item.quantity - 1)}
                              className="w-9 h-9 flex items-center justify-center font-bold hover:bg-gray-100 transition-colors"
                              style={{ color: '#0f172a' }}>−</button>
                            <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                            <button onClick={() => updateQty(item.productId, item.quantity + 1)}
                              className="w-9 h-9 flex items-center justify-center font-bold hover:bg-gray-100 transition-colors"
                              style={{ color: '#0f172a' }}>+</button>
                          </div>
                          <span className="text-sm font-bold" style={{ color: '#0f172a' }}>
                            = ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.productId)}
                        className="text-2xl hover:scale-110 transition-transform flex-shrink-0"
                        style={{ color: '#ef4444' }}>×</button>
                    </div>
                  ))}
                  <Link href="/products"
                    className="block text-center py-3 rounded-xl text-sm font-medium transition-all"
                    style={{ border: '2px dashed #e2e8f0', color: '#94a3b8' }}>
                    + Add More Products
                  </Link>
                </>
              ) : (
                /* Checkout form */
                <div className="card p-8 space-y-6">
                  <h3 className="text-xl font-bold text-gray-800">Delivery Details</h3>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>
                      Delivery Address *
                    </label>
                    <textarea rows={3} value={address} onChange={e => setAddress(e.target.value)}
                      placeholder="Enter full delivery address with pincode..."
                      className="w-full px-5 py-4 rounded-xl text-base outline-none resize-none"
                      style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                      onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                      onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3" style={{ color: '#475569' }}>
                      Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'UPI', icon: '📱', label: 'UPI' },
                        { value: 'BANK_TRANSFER', icon: '🏦', label: 'Bank Transfer' },
                        { value: 'CREDIT', icon: '💳', label: 'Credit Terms' },
                      ].map(m => (
                        <button key={m.value} type="button"
                          onClick={() => setPaymentMethod(m.value)}
                          className="py-4 rounded-xl text-sm font-bold transition-all flex flex-col items-center gap-2"
                          style={{
                            border: paymentMethod === m.value ? '2px solid #f59e0b' : '2px solid #e2e8f0',
                            background: paymentMethod === m.value ? '#fef3c7' : '#f8fafc',
                            color: paymentMethod === m.value ? '#b45309' : '#64748b',
                          }}>
                          <span className="text-2xl">{m.icon}</span>
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl text-sm" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <p className="font-semibold text-green-800 mb-1">✅ What's included:</p>
                    <ul className="text-green-700 space-y-1">
                      <li>• GST Invoice generated automatically</li>
                      <li>• Purchase Order (PO) document</li>
                      <li>• Email confirmation with tracking details</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: Order summary ── */}
            <div className="space-y-4">
              <div className="card p-6">
                <h3 className="font-bold text-gray-800 text-lg mb-5">Order Summary</h3>
                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between" style={{ color: '#64748b' }}>
                    <span>Subtotal ({cart.length} items)</span>
                    <span className="font-medium text-gray-800">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between" style={{ color: '#64748b' }}>
                    <span>GST (18%)</span>
                    <span className="font-medium text-gray-800">₹{gst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between" style={{ color: '#64748b' }}>
                    <span>Shipping</span>
                    <span className="font-medium" style={{ color: shipping === 0 ? '#15803d' : '#0f172a' }}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs" style={{ color: '#15803d' }}>🎉 Free shipping on orders above ₹10,000</p>
                  )}
                  <div className="pt-3 border-t flex justify-between font-extrabold text-lg" style={{ borderColor: '#e8edf2' }}>
                    <span style={{ color: '#0f172a' }}>Total</span>
                    <span style={{ color: '#0f172a' }}>₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                {step === 'cart' ? (
                  <button onClick={() => setStep('checkout')}
                    className="w-full py-4 rounded-xl font-bold text-base transition-all"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>
                    Proceed to Checkout →
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button onClick={handlePlaceOrder} disabled={loading}
                      className="w-full py-4 rounded-xl font-bold text-base transition-all"
                      style={{ background: loading ? '#92400e' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>
                      {loading ? 'Placing Order...' : '✅ Place Order'}
                    </button>
                    <button onClick={() => setStep('cart')}
                      className="w-full py-3 rounded-xl font-bold text-sm transition-all"
                      style={{ border: '2px solid #e2e8f0', color: '#64748b' }}>
                      ← Back to Cart
                    </button>
                  </div>
                )}
              </div>

              {/* RFQ alternative */}
              <div className="card p-5 text-center" style={{ background: '#0f172a' }}>
                <p className="text-sm font-medium mb-3" style={{ color: '#94a3b8' }}>
                  Need larger quantities?
                </p>
                <Link href="/rfq" className="block py-3 rounded-xl text-sm font-bold transition-all"
                  style={{ border: '1px solid #f59e0b', color: '#f59e0b' }}>
                  📩 Post an RFQ Instead
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
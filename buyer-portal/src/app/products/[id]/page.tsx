'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'supplier' | 'delivery'>('specs');
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setQuantity(res.data.moq || 1);
        setActiveImage(0);
      })
      .catch(() => router.push('/products'))
      .finally(() => setLoading(false));
  }, [id]);

  const getPrice = () => {
    if (!product) return null;
    if (product.priceTiers?.length > 0) {
      const tier = product.priceTiers.find((t: any) =>
        quantity >= t.minQty && (t.maxQty === null || quantity <= t.maxQty)
      );
      return tier?.price || product.basePrice;
    }
    return product.basePrice;
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((i: any) => i.productId === product.id);
    if (existing) existing.quantity += quantity;
    else cart.push({ productId: product.id, name: product.name, price: getPrice(), quantity, image: '⚡' });
    localStorage.setItem('cart', JSON.stringify(cart));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="rounded-2xl h-96" style={{ background: '#e2e8f0' }} />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-5 rounded" style={{ background: '#e2e8f0', width: `${[60, 90, 50, 80, 40, 70][i]}%` }} />
          ))}
        </div>
      </div>
    </div>
  );

  if (!product) return null;

  const price = getPrice();
  const specs = product.specsJson ? JSON.parse(product.specsJson) : {};

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm" style={{ color: '#64748b' }}>
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-amber-400 transition-colors">Products</Link>
            <span>/</span>
            <span style={{ color: '#f59e0b' }}>{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">

          {/* Left: Images */}
          <div>
            <div className="rounded-2xl overflow-hidden mb-4"
              style={{ background: 'white', height: '380px', border: '1px solid #e8edf2' }}>
              {product.images?.length > 0 ? (
                <img src={product.images[activeImage ?? 0]} alt={product.name}
                  className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-9xl">⚡</span>
                </div>
              )}
            </div>
            {/* Thumbnail row */}
            {product.images?.length > 0 && (
              <div className="flex gap-3">
                {product.images.map((img: string, i: number) => (
                  <div key={i} onClick={() => setActiveImage(i)}
                    className="w-20 h-20 rounded-xl overflow-hidden cursor-pointer transition-all"
                    style={{ border: activeImage === i ? '2px solid #f59e0b' : '1px solid #e8edf2' }}>
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Info ── */}
          <div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.certifications?.map((c: string) => (
                <span key={c} className="badge badge-green">{c}</span>
              ))}
              {product.featuredProduct && <span className="badge badge-amber">⭐ Featured</span>}
              <span className="badge badge-blue">✅ GST Invoice</span>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-3 leading-tight">{product.name}</h1>

            {/* Supplier */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: '#0f172a', color: '#f59e0b' }}>S</div>
              <span className="text-sm font-medium" style={{ color: '#475569' }}>
                {product.supplier?.companyName || 'Verified Supplier'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#dcfce7', color: '#15803d' }}>✓ Verified</span>
            </div>

            {/* Price */}
            <div className="rounded-2xl p-6 mb-6" style={{ background: 'white', border: '1px solid #e8edf2' }}>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-4xl font-extrabold" style={{ color: '#0f172a' }}>
                  {price ? `₹${Number(price).toLocaleString('en-IN')}` : 'Get Quote'}
                </span>
                {price && <span className="text-sm mb-1" style={{ color: '#94a3b8' }}>per unit</span>}
              </div>

              {/* Price tiers */}
              {product.priceTiers?.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#94a3b8' }}>Bulk Pricing</p>
                  <div className="grid grid-cols-3 gap-2">
                    {product.priceTiers.map((tier: any) => (
                      <div key={tier.id} className="text-center p-2 rounded-lg"
                        style={{ background: '#f8fafc', border: '1px solid #e8edf2' }}>
                        <div className="text-xs font-medium" style={{ color: '#64748b' }}>
                          {tier.minQty}–{tier.maxQty || '∞'} units
                        </div>
                        <div className="text-sm font-bold" style={{ color: '#0f172a' }}>
                          ₹{Number(tier.price).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MOQ */}
              <div className="flex items-center justify-between text-sm mb-5 p-3 rounded-xl"
                style={{ background: '#fef3c7' }}>
                <span className="font-medium" style={{ color: '#92400e' }}>📦 Minimum Order Quantity</span>
                <span className="font-bold" style={{ color: '#b45309' }}>{product.moq || 1} units</span>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center gap-4 mb-5">
                <span className="text-sm font-medium" style={{ color: '#64748b' }}>Quantity:</span>
                <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid #e8edf2' }}>
                  <button onClick={() => setQuantity(Math.max(product.moq || 1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-lg font-bold transition-colors hover:bg-gray-100"
                    style={{ color: '#0f172a' }}>−</button>
                  <span className="w-14 text-center font-bold text-base" style={{ color: '#0f172a' }}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-lg font-bold transition-colors hover:bg-gray-100"
                    style={{ color: '#0f172a' }}>+</button>
                </div>
                {price && (
                  <span className="text-sm font-semibold" style={{ color: '#64748b' }}>
                    Total: <span style={{ color: '#0f172a' }}>₹{(Number(price) * quantity).toLocaleString('en-IN')}</span>
                  </span>
                )}
              </div>

              {/* CTAs */}
              <div className="flex gap-3">
                <button onClick={handleAddToCart}
                  disabled={quantity < (product.moq || 1)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-base transition-all"
                  style={{
                    background: quantity < (product.moq || 1)
                      ? '#e2e8f0'
                      : addedToCart
                        ? '#15803d'
                        : 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: quantity < (product.moq || 1) ? '#94a3b8' : '#0f172a',
                    cursor: quantity < (product.moq || 1) ? 'not-allowed' : 'pointer'
                  }}>
                  {addedToCart ? '✓ Added to Cart!' : '🛒 Add to Cart'}
                </button>
                <Link href="/rfq" className="flex-1 py-3.5 rounded-xl font-bold text-base text-center transition-all"
                  style={{ background: '#0f172a', color: '#f59e0b', border: '1px solid #334155' }}>
                  📩 Request Quote
                </Link>
              </div>
            </div>

            {/* Delivery */}
            <div className="flex items-center gap-3 text-sm" style={{ color: '#64748b' }}>
              <span>🚚 Delivery in <strong style={{ color: '#0f172a' }}>{product.deliveryTimeline || '5–7 days'}</strong></span>
              <span>·</span>
              <span>📍 Pan India</span>
              <span>·</span>
              <span style={{ color: '#15803d' }}>📄 GST Invoice</span>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #e8edf2' }}>
          <div className="flex" style={{ borderBottom: '1px solid #e8edf2' }}>
            {(['specs', 'supplier', 'delivery'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="flex-1 py-4 text-sm font-bold capitalize transition-all"
                style={{
                  color: activeTab === tab ? '#f59e0b' : '#64748b',
                  borderBottom: activeTab === tab ? '2px solid #f59e0b' : '2px solid transparent',
                  background: activeTab === tab ? '#fffbeb' : 'transparent'
                }}>
                {tab === 'specs' ? '📋 Specifications' : tab === 'supplier' ? '🏭 Supplier Info' : '🚚 Delivery & Payment'}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'specs' && (
              <div>
                <p className="text-gray-600 leading-relaxed mb-6">{product.description || 'High quality electrical product from a verified supplier. Suitable for industrial and commercial use.'}</p>
                {Object.keys(specs).length > 0 ? (
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(specs).map(([key, val]: any) => (
                        <tr key={key} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td className="py-3 font-semibold w-1/3" style={{ color: '#475569' }}>{key}</td>
                          <td className="py-3 font-medium" style={{ color: '#0f172a' }}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[['Brand', product.brand || 'N/A'], ['MOQ', `${product.moq || 1} units`], ['Delivery', product.deliveryTimeline || '5–7 days'], ['Category', product.category?.name || 'Electrical'], ['GST Invoice', 'Included'], ['Warranty', '1 Year']].map(([k, v]) => (
                      <div key={k} className="p-4 rounded-xl" style={{ background: '#f8fafc' }}>
                        <div className="text-xs font-medium mb-1" style={{ color: '#94a3b8' }}>{k}</div>
                        <div className="font-bold text-sm" style={{ color: '#0f172a' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'supplier' && (
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>
                  {product.supplier?.companyName?.[0] || 'S'}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{product.supplier?.companyName || 'Verified Supplier'}</h3>
                  <p className="text-sm mb-3" style={{ color: '#64748b' }}>{product.supplier?.location || 'India'}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.supplier?.gstVerified && <span className="badge badge-green">GST Verified</span>}
                    {product.supplier?.isoVerified && <span className="badge badge-blue">ISO Certified</span>}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
                    {product.supplier?.description || 'Verified B2B supplier on SmartElectro platform.'}
                  </p>
                  {product.supplier?.id && (
                    <Link href={`/suppliers/${product.supplier.id}`}
                      className="inline-block mt-4 text-sm font-bold"
                      style={{ color: '#f59e0b' }}>
                      View Full Supplier Profile →
                    </Link>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: '🚚', title: 'Delivery Timeline', desc: product.deliveryTimeline || '5–7 business days' },
                  { icon: '📍', title: 'Shipping Coverage', desc: 'Pan India delivery available' },
                  { icon: '💳', title: 'Payment Methods', desc: 'UPI, Bank Transfer, Credit Terms (verified buyers)' },
                  { icon: '📄', title: 'GST Invoice', desc: 'Automatic GST invoice generated on every order' },
                  { icon: '📦', title: 'Purchase Order', desc: 'PO document generated automatically' },
                  { icon: '↩️', title: 'Returns', desc: 'Contact supplier within 7 days for damaged goods' },
                ].map(item => (
                  <div key={item.title} className="flex gap-4 p-4 rounded-xl" style={{ background: '#f8fafc' }}>
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="font-bold text-sm text-gray-800 mb-1">{item.title}</div>
                      <div className="text-sm" style={{ color: '#64748b' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
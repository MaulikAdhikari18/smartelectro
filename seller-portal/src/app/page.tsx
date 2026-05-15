'use client';
import Link from 'next/link';

const features = [
  { icon: '📦', title: 'List Products', desc: 'Upload your catalog with images, specs, and bulk pricing tiers' },
  { icon: '📩', title: 'Receive RFQs', desc: 'Get instant notifications when buyers post requirements matching your products' },
  { icon: '💰', title: 'GST Invoicing', desc: 'Automatic GST invoice generation on every order — no manual work' },
  { icon: '📊', title: 'Analytics', desc: 'Track leads, conversion rates and revenue from your seller dashboard' },
  { icon: '🤝', title: '25,000+ Buyers', desc: 'Access to verified industrial buyers, contractors and government institutions' },
  { icon: '🚚', title: 'Pan India', desc: 'Sell to buyers across 150+ cities with logistics support' },
];

const steps = [
  { step: '01', title: 'Register & Verify', desc: 'Create your seller account with GST number for instant verification' },
  { step: '02', title: 'List Products', desc: 'Upload your product catalog with pricing, MOQ and specifications' },
  { step: '03', title: 'Receive Orders', desc: 'Get RFQs and direct orders from verified B2B buyers' },
  { step: '04', title: 'Grow Revenue', desc: 'Track performance, manage orders and scale your business' },
];

export default function SellerHomePage() {
  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav style={{ borderBottom: '1px solid #1e293b' }} className="sticky top-0 z-50" >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>SE</div>
            <span className="text-xl font-extrabold text-white">
              Smart<span style={{ color: '#f59e0b' }}>Electro</span>
              <span className="text-xs font-bold ml-2 px-2 py-0.5 rounded"
                style={{ background: '#f59e0b', color: '#0f172a' }}>SELLER</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-amber-400 transition-colors"
              style={{ color: '#94a3b8' }}>Login</Link>
            <Link href="/register" className="btn-primary text-sm py-2.5 px-6 rounded-xl font-bold">
              Start Selling Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-28 px-4">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: '#f59e0b' }} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', color: '#fbbf24' }}>
            🏭 Seller Portal — SmartElectro B2B
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Sell Electrical Products<br />to <span style={{ color: '#f59e0b' }}>25,000+ Businesses</span><br />Across India
          </h1>
          <p className="text-xl leading-relaxed mb-10 max-w-2xl mx-auto" style={{ color: '#94a3b8' }}>
            Join 500+ verified suppliers on SmartElectro B2B. List your products, receive bulk RFQs, and grow your business with automated GST invoicing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary px-10 py-4 rounded-xl font-bold text-lg">
              Start Selling Free →
            </Link>
            <Link href="/login"
              className="px-10 py-4 rounded-xl font-bold text-lg transition-all"
              style={{ border: '2px solid #334155', color: '#94a3b8' }}>
              Login to Dashboard
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {['✅ Free to Register', '📄 GST Verified', '🔒 Secure Payments', '📦 Pan India'].map(b => (
              <span key={b} className="text-sm font-medium" style={{ color: '#64748b' }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12" style={{ background: '#f59e0b' }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[['500+', 'Verified Sellers'], ['25,000+', 'B2B Buyers'], ['10,000+', 'Products Listed'], ['₹50Cr+', 'GMV Processed']].map(([val, label]) => (
              <div key={label}>
                <div className="text-3xl font-extrabold text-gray-900">{val}</div>
                <div className="text-sm font-medium mt-1" style={{ color: '#78350f' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4" style={{ background: '#0f172a' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-white mb-3">Everything You Need to Sell</h2>
            <p style={{ color: '#64748b' }}>Powerful tools built for B2B electrical suppliers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="p-6 rounded-2xl transition-all hover:scale-105"
                style={{ background: '#1e293b', border: '1px solid #334155' }}>
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4" style={{ background: '#1e293b' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-white mb-3">How It Works</h2>
            <p style={{ color: '#64748b' }}>Start selling in 4 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(s => (
              <div key={s.step} className="text-center p-6 rounded-2xl relative"
                style={{ background: '#0f172a', border: '1px solid #334155' }}>
                <div className="text-5xl font-black opacity-10 mb-3" style={{ color: '#f59e0b' }}>{s.step}</div>
                <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4" style={{ background: '#f59e0b' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Ready to Grow Your Business?</h2>
          <p className="text-lg mb-8" style={{ color: '#78350f' }}>
            Join 500+ verified suppliers and start receiving orders from 25,000+ B2B buyers
          </p>
          <Link href="/register"
            className="inline-block px-12 py-5 rounded-xl font-extrabold text-lg transition-all hover:scale-105"
            style={{ background: '#0f172a', color: '#f59e0b' }}>
            Start Selling Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm" style={{ background: '#0f172a', borderTop: '1px solid #1e293b', color: '#475569' }}>
        © 2024 SmartElectro B2B · Seller Portal · Made in India 🇮🇳
      </footer>
    </div>
  );
}
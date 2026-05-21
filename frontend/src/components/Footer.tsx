import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#0f172a', borderTop: '1px solid #1e293b' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>SE</div>
              <span className="text-xl font-extrabold text-white">
                Smart<span style={{ color: '#f59e0b' }}>Electro</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: '#64748b' }}>
              India's leading B2B marketplace for electrical and EV products. Connecting manufacturers, suppliers, and industrial buyers.
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="badge badge-amber">GST Verified</span>
              <span className="badge badge-blue">ISO Certified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: '#f59e0b' }}>Quick Links</h4>
            <ul className="space-y-2.5">
              {([['All Products', '/products'], ['Post Requirement', '/rfq'], ['Find Suppliers', '/suppliers'], ['Become a Supplier', '/register']] as [string, string][]).map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors hover:text-amber-400" style={{ color: '#64748b' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: '#f59e0b' }}>Categories</h4>
            <ul className="space-y-2.5">
              {([['EV Chargers', '1'], ['Commercial Induction', '2'], ['Industrial Equipment', '3'], ['Solar & Renewable', '4']] as [string, string][]).map(([label, id]) => (
                <li key={id}>
                  <Link href={`/products?categoryId=${id}`} className="text-sm transition-colors hover:text-amber-400" style={{ color: '#64748b' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: '#f59e0b' }}>Contact Us</h4>
            <ul className="space-y-3">
              {(['📧 support@smartelectro.in', '📞 +91 98765 43210', '📍 New Delhi, India', '🕐 Mon–Sat, 9AM–6PM IST'] as string[]).map(text => (
                <li key={text} className="text-sm" style={{ color: '#64748b' }}>{text}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm"
          style={{ borderTop: '1px solid #1e293b', color: '#475569' }}>
          <p>© 2024 SmartElectro B2B. All rights reserved.</p>
          <div className="flex gap-6 mt-3 md:mt-0">
            <Link href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-amber-400 transition-colors">Terms of Use</Link>
            <p>Made with ❤️ in India 🇮🇳</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
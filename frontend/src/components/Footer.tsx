import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SE</span>
              </div>
              <span className="text-white text-xl font-bold">SmartElectro</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              India's leading B2B marketplace for electrical and EV products. Connecting manufacturers, suppliers, and industrial buyers.
            </p>
            <div className="flex gap-3 mt-5">
              <span className="badge-green text-xs">GST Verified</span>
              <span className="badge-blue text-xs">ISO Certified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/rfq" className="hover:text-white transition-colors">Post Requirement</Link></li>
              <li><Link href="/suppliers" className="hover:text-white transition-colors">Find Suppliers</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Become a Supplier</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=1" className="hover:text-white transition-colors">EV Chargers</Link></li>
              <li><Link href="/products?category=2" className="hover:text-white transition-colors">Commercial Induction</Link></li>
              <li><Link href="/products?category=3" className="hover:text-white transition-colors">Industrial Equipment</Link></li>
              <li><Link href="/products?category=4" className="hover:text-white transition-colors">Solar & Renewable</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">📧 <span>support@smartelectro.in</span></li>
              <li className="flex items-center gap-2">📞 <span>+91 98765 43210</span></li>
              <li className="flex items-center gap-2">📍 <span>New Delhi, India</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2024 SmartElectro B2B. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}

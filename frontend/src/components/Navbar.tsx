'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem('userName');
    const role = localStorage.getItem('userRole');
    if (name && role) setUser({ name, role });

    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((sum: number, i: any) => sum + i.quantity, 0));
    };
    updateCart();
    window.addEventListener('storage', updateCart);
    return () => window.removeEventListener('storage', updateCart);
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setCartCount(0);
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/products?search=${searchQuery}`);
  };

  return (
    <nav style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>
              SE
            </div>
            <span className="text-xl font-extrabold text-white">
              Smart<span style={{ color: '#f59e0b' }}>Electro</span>
              <span className="text-xs font-medium ml-1.5 px-1.5 py-0.5 rounded"
                style={{ background: '#1e293b', color: '#64748b' }}>B2B</span>
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="flex w-full rounded-lg overflow-hidden" style={{ border: '1px solid #334155' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, suppliers, categories..."
                className="flex-1 px-4 py-2.5 text-sm outline-none text-white"
                style={{ background: '#1e293b' }}
              />
              <button type="submit" className="px-5 py-2.5 text-sm font-bold transition-colors"
                style={{ background: '#f59e0b', color: '#0f172a' }}>
                Search
              </button>
            </div>
          </form>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-5">
            {[['Products', '/products'], ['Post RFQ', '/rfq'], ['Suppliers', '/suppliers']].map(([label, href]) => (
              <Link key={href} href={href}
                className="text-sm font-medium transition-colors hover:text-amber-400"
                style={{ color: '#94a3b8' }}>
                {label}
              </Link>
            ))}

            {/* Cart */}
            <Link href="/cart" className="relative flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-amber-400"
              style={{ color: '#94a3b8' }}>
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 w-5 h-5 rounded-full text-xs font-black flex items-center justify-center"
                  style={{ background: '#f59e0b', color: '#0f172a' }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-sm font-medium" style={{ color: '#f59e0b' }}>
                  Hi, {user.name.split(' ')[0]}
                </Link>
                <button onClick={logout} className="text-sm font-medium hover:text-red-400 transition-colors"
                  style={{ color: '#ef4444' }}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium hover:text-amber-400 transition-colors"
                  style={{ color: '#94a3b8' }}>Login</Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-5 rounded-lg">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 flex flex-col gap-1.5" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-5 h-0.5 rounded" style={{ background: '#94a3b8' }}></div>
            <div className="w-5 h-0.5 rounded" style={{ background: '#94a3b8' }}></div>
            <div className="w-5 h-0.5 rounded" style={{ background: '#94a3b8' }}></div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 space-y-3" style={{ borderTop: '1px solid #1e293b' }}>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..." className="flex-1 px-3 py-2 text-sm rounded-lg text-white outline-none"
                style={{ background: '#1e293b', border: '1px solid #334155' }} />
              <button type="submit" className="px-4 py-2 text-sm font-bold rounded-lg"
                style={{ background: '#f59e0b', color: '#0f172a' }}>Go</button>
            </form>
            {[['Products', '/products'], ['Post RFQ', '/rfq'], ['Suppliers', '/suppliers'], [`🛒 Cart (${cartCount})`, '/cart']].map(([label, href]) => (
              <Link key={href} href={href} className="block text-sm py-1 hover:text-amber-400 transition-colors"
                style={{ color: '#94a3b8' }}>{label}</Link>
            ))}
            {user ? (
              <>
                <Link href="/dashboard" className="block text-sm py-1 font-medium" style={{ color: '#f59e0b' }}>
                  Dashboard
                </Link>
                <button onClick={logout} className="block text-sm py-1" style={{ color: '#ef4444' }}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-sm py-1" style={{ color: '#94a3b8' }}>Login</Link>
                <Link href="/register" className="block text-sm py-1 font-bold" style={{ color: '#f59e0b' }}>
                  Register Free →
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
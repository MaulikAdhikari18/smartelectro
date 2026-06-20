'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function SellerNavbar() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const syncUser = () => {
      const name = localStorage.getItem('sellerName');
      const token = localStorage.getItem('sellerToken');
      if (name && token) setUser({ name });
      else setUser(null);
    };
    syncUser();
    window.addEventListener('storage', syncUser);
    window.addEventListener('focus', syncUser);
    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('focus', syncUser);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('sellerName');
    localStorage.removeItem('sellerRole');
    localStorage.removeItem('sellerId');
    setUser(null);
    window.location.href = '/login';
  };

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Products', href: '/products' },
    { label: 'RFQ Inbox', href: '/rfqs' },
    { label: 'Orders', href: '/orders' },
  ];

  return (
    <nav style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>
              SE
            </div>
            <div>
              <span className="text-lg font-extrabold text-white">
                Smart<span style={{ color: '#f59e0b' }}>Electro</span>
              </span>
              <span className="text-xs font-bold ml-2 px-2 py-0.5 rounded"
                style={{ background: '#f59e0b', color: '#0f172a' }}>SELLER</span>
            </div>
          </Link>

          {/* Nav links — only show when logged in */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: pathname === link.href ? '#1e293b' : 'transparent',
                    color: pathname === link.href ? '#f59e0b' : '#94a3b8'
                  }}>
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>
                    {user.name[0]}
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#f59e0b' }}>
                    {user.name.split(' ')[0]}
                  </span>
                </div>
                <button onClick={logout}
                  className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                  style={{ background: '#1e293b', color: '#ef4444', border: '1px solid #334155' }}>
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login"
                  className="text-sm font-medium hover:text-amber-400 transition-colors"
                  style={{ color: '#94a3b8' }}>
                  Login
                </Link>
                <Link href="/register"
                  className="btn-primary text-sm py-2 px-5 rounded-lg">
                  Register as Seller
                </Link>
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
          <div className="md:hidden py-4 space-y-2" style={{ borderTop: '1px solid #1e293b' }}>
            {user && navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="block px-3 py-2 rounded-lg text-sm font-medium"
                style={{ color: pathname === link.href ? '#f59e0b' : '#94a3b8' }}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <button onClick={logout} className="block text-sm py-2 px-3 font-bold" style={{ color: '#ef4444' }}>
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="block text-sm py-2 px-3" style={{ color: '#94a3b8' }}>Login</Link>
                <Link href="/register" className="block text-sm py-2 px-3 font-bold" style={{ color: '#f59e0b' }}>
                  Register as Seller →
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
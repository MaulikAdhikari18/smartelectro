'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem('userName');
    const role = localStorage.getItem('userRole');
    if (name && role) setUser({ name, role });
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/products?search=${searchQuery}`);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SE</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Smart<span className="text-blue-600">Electro</span>
            </span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="flex w-full rounded-lg border border-gray-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, suppliers, categories..."
                className="flex-1 px-4 py-2 text-sm outline-none"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>
          </form>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">Products</Link>
            <Link href="/rfq" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">Post RFQ</Link>
            <Link href="/suppliers" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">Suppliers</Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-blue-600 font-medium">
                  Hi, {user.name.split(' ')[0]}
                </Link>
                <button onClick={logout} className="text-sm text-red-500 hover:text-red-700 font-medium">Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Login</Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-4">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-600"></div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg">Go</button>
            </form>
            <Link href="/products" className="block text-sm text-gray-600 py-1">Products</Link>
            <Link href="/rfq" className="block text-sm text-gray-600 py-1">Post RFQ</Link>
            <Link href="/suppliers" className="block text-sm text-gray-600 py-1">Suppliers</Link>
            {user ? (
              <>
                <Link href="/dashboard" className="block text-sm text-gray-600 py-1">Dashboard</Link>
                <button onClick={logout} className="block text-sm text-red-500 py-1">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-sm text-gray-600 py-1">Login</Link>
                <Link href="/register" className="block text-sm text-blue-600 py-1 font-medium">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

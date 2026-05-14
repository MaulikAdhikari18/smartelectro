'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SellerNavbar from '@/components/SellerNavbar';
import api from '@/lib/api';

const defaultCategories = [
  { id: 1, name: 'EV Chargers' },
  { id: 2, name: 'Commercial Induction' },
  { id: 3, name: 'Industrial Equipment' },
  { id: 4, name: 'Solar & Renewable' },
  { id: 5, name: 'Wiring & Components' },
  { id: 6, name: 'Automation Systems' },
];

export default function SellerProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>(defaultCategories);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '', description: '', basePrice: '', moq: '1',
    brand: '', deliveryTimeline: '5-7 days', categoryId: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('sellerToken');
    if (!token) { router.push('/login'); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
      ]);
      setProducts(productsRes.data);
      if (categoriesRes.data?.length > 0) setCategories(categoriesRes.data);
    } catch { }
    finally { setLoading(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      setImageError('Maximum 5 images allowed');
      return;
    }

    setUploadingImage(true);
    setImageError('');

    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Each image must be under 5MB');
        setUploadingImage(false);
        return;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post('/products/upload-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setImages(prev => [...prev, res.data]);
      } catch {
        setImageError('Failed to upload image. Try again.');
      }
    }
    setUploadingImage(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateCategory = async () => {
    if (!customCategory.trim()) return;
    try {
      const res = await api.post('/categories', {
        name: customCategory.trim(),
        slug: customCategory.trim().toLowerCase().replace(/\s+/g, '-'),
        description: `Custom category: ${customCategory.trim()}`
      });
      setCategories(prev => [...prev, res.data]);
      setForm({ ...form, categoryId: String(res.data.id) });
      setCustomCategory('');
      setShowCustomCategory(false);
    } catch { alert('Failed to create category'); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length < 2) {
      setImageError('Please upload at least 2 product images');
      return;
    }

    setSaving(true);
    try {
      await api.post('/products', {
        ...form,
        basePrice: Number(form.basePrice),
        moq: Number(form.moq),
        category: form.categoryId ? { id: Number(form.categoryId) } : null,
        images: images,
        active: true,
      });
      setShowForm(false);
      setImages([]);
      setForm({ name: '', description: '', basePrice: '', moq: '1', brand: '', deliveryTimeline: '5-7 days', categoryId: '' });
      setImageError('');
      fetchData();
    } catch { alert('Failed to add product. Please try again.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this product?')) return;
    await api.delete(`/products/${id}`);
    fetchData();
  };

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh' }}>
      <SellerNavbar />

      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white">My Products</h1>
              <p className="text-sm mt-1" style={{ color: '#64748b' }}>{products.length} products in your catalog</p>
            </div>
            <button onClick={() => { setShowForm(!showForm); setImages([]); setImageError(''); }}
              className="btn-primary px-6 py-3 rounded-xl font-bold text-sm">
              {showForm ? '✕ Cancel' : '+ Add Product'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Add product form */}
        {showForm && (
          <div className="rounded-2xl p-8 mb-8" style={{ background: 'white', border: '2px solid #f59e0b' }}>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Add New Product</h3>
            <form onSubmit={handleAdd} className="space-y-6">

              {/* Image upload section */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>
                  Product Images * <span className="font-normal" style={{ color: '#94a3b8' }}>(minimum 2, max 5)</span>
                </label>

                {/* Image preview grid */}
                <div className="grid grid-cols-5 gap-3 mb-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt={`Product ${i + 1}`}
                        className="w-full h-24 object-cover rounded-xl"
                        style={{ border: '1px solid #e8edf2' }} />
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: '#ef4444', color: 'white' }}>×</button>
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 text-xs px-1.5 py-0.5 rounded font-bold"
                          style={{ background: '#f59e0b', color: '#0f172a' }}>Main</span>
                      )}
                    </div>
                  ))}

                  {/* Upload button */}
                  {images.length < 5 && (
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="h-24 rounded-xl flex flex-col items-center justify-center gap-1 transition-all hover:border-amber-400"
                      style={{ border: '2px dashed #e2e8f0', background: '#f8fafc' }}>
                      {uploadingImage ? (
                        <span className="text-xs" style={{ color: '#94a3b8' }}>Uploading...</span>
                      ) : (
                        <>
                          <span className="text-2xl">📷</span>
                          <span className="text-xs font-medium" style={{ color: '#94a3b8' }}>Add Photo</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <input ref={fileInputRef} type="file" accept="image/*" multiple
                  onChange={handleImageUpload} className="hidden" />

                {/* Image count indicator */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <div key={n} className="w-2 h-2 rounded-full transition-all"
                      style={{ background: images.length >= n ? '#f59e0b' : '#e2e8f0' }} />
                  ))}
                  <span className="text-xs ml-1" style={{ color: images.length >= 2 ? '#15803d' : '#94a3b8' }}>
                    {images.length}/5 images {images.length >= 2 ? '✓ Minimum met' : `(need ${2 - images.length} more)`}
                  </span>
                </div>

                {imageError && (
                  <p className="text-sm mt-2 font-medium" style={{ color: '#ef4444' }}>⚠️ {imageError}</p>
                )}
              </div>

              {/* Product fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { key: 'name', label: 'Product Name *', placeholder: 'e.g. 22kW AC EV Charger', type: 'text', required: true },
                  { key: 'brand', label: 'Brand', placeholder: 'e.g. Tata, Havells, Samsung', type: 'text', required: false },
                  { key: 'basePrice', label: 'Base Price (₹) *', placeholder: '45000', type: 'number', required: true },
                  { key: 'moq', label: 'Min Order Quantity (MOQ)', placeholder: '1', type: 'number', required: false },
                  { key: 'deliveryTimeline', label: 'Delivery Timeline', placeholder: '5-7 days', type: 'text', required: false },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>{field.label}</label>
                    <input type={field.type} required={field.required}
                      value={(form as any)[field.key]}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3.5 rounded-xl text-sm outline-none"
                      style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                      onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                      onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                  </div>
                ))}

                {/* Category with custom option */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>Category</label>
                  <select value={form.categoryId}
                    onChange={e => {
                      if (e.target.value === 'custom') { setShowCustomCategory(true); }
                      else { setForm({ ...form, categoryId: e.target.value }); setShowCustomCategory(false); }
                    }}
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none"
                    style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                    onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                    onBlur={e => (e.target.style.borderColor = '#e2e8f0')}>
                    <option value="">Select a category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    <option value="custom">+ Create Custom Category</option>
                  </select>

                  {/* Custom category input */}
                  {showCustomCategory && (
                    <div className="mt-3 flex gap-2">
                      <input type="text" value={customCategory}
                        onChange={e => setCustomCategory(e.target.value)}
                        placeholder="e.g. Mobile Accessories, Phones..."
                        className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ border: '1.5px solid #f59e0b', background: '#fffbeb' }}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleCreateCategory())} />
                      <button type="button" onClick={handleCreateCategory}
                        className="px-4 py-3 rounded-xl text-sm font-bold"
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}>
                        Create
                      </button>
                      <button type="button" onClick={() => { setShowCustomCategory(false); setCustomCategory(''); }}
                        className="px-3 py-3 rounded-xl text-sm font-bold"
                        style={{ background: '#fee2e2', color: '#dc2626' }}>
                        ✕
                      </button>
                    </div>
                  )}

                  {form.categoryId && !showCustomCategory && (
                    <p className="text-xs mt-1.5 font-medium" style={{ color: '#15803d' }}>
                      ✓ {categories.find(c => String(c.id) === form.categoryId)?.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#475569' }}>
                  Product Description
                </label>
                <textarea rows={4} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your product in detail — specifications, use cases, certifications..."
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none resize-none"
                  style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                  onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                  onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
              </div>

              {/* Submit */}
              <button type="submit" disabled={saving || images.length < 2}
                className="w-full py-4 rounded-xl font-bold text-base transition-all"
                style={{
                  background: (saving || images.length < 2) ? '#e2e8f0' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: (saving || images.length < 2) ? '#94a3b8' : '#0f172a',
                  cursor: (saving || images.length < 2) ? 'not-allowed' : 'pointer'
                }}>
                {saving ? 'Adding Product...' : images.length < 2 ? `Upload ${2 - images.length} more image${2 - images.length > 1 ? 's' : ''} to continue` : '+ Add Product'}
              </button>
            </form>
          </div>
        )}

        {/* Products list */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-5 animate-pulse flex gap-4">
                <div className="w-16 h-16 rounded-xl" style={{ background: '#e2e8f0' }} />
                <div className="flex-1 space-y-2">
                  <div className="h-4 rounded" style={{ background: '#e2e8f0', width: '50%' }} />
                  <div className="h-3 rounded" style={{ background: '#e2e8f0', width: '30%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 && !showForm ? (
          <div className="card p-20 text-center">
            <div className="text-7xl mb-5">📦</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-3">No products yet</h3>
            <p className="text-gray-400 mb-8">Add your first product to start receiving orders from B2B buyers</p>
            <button onClick={() => setShowForm(true)}
              className="btn-primary px-10 py-4 rounded-xl font-bold inline-block">
              + Add Your First Product
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map(p => (
              <div key={p.id} className="card p-5 flex items-center gap-5">
                {/* Product image or placeholder */}
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ background: '#fef3c7' }}>
                  {p.images?.length > 0 ? (
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">⚡</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-800 truncate">{p.name}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0"
                      style={{ background: p.active ? '#dcfce7' : '#fee2e2', color: p.active ? '#15803d' : '#dc2626' }}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm" style={{ color: '#64748b' }}>
                    <span>₹{p.basePrice?.toLocaleString('en-IN')}</span>
                    <span>MOQ: {p.moq || 1} units</span>
                    <span>{p.category?.name || 'Uncategorized'}</span>
                    <span>🚚 {p.deliveryTimeline || '5-7 days'}</span>
                    <span style={{ color: p.images?.length >= 2 ? '#15803d' : '#ef4444' }}>
                      📷 {p.images?.length || 0} images
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleDelete(p.id)}
                    className="px-4 py-2 rounded-lg text-xs font-bold"
                    style={{ background: '#fee2e2', color: '#dc2626' }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
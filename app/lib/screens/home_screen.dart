import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../constants/app_colors.dart';
import '../services/api_service.dart';
import 'products_screen.dart';
import 'product_detail_screen.dart';
import 'rfq_screen.dart';
import 'login_screen.dart';
import 'cart_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  List<dynamic> _featured = [];
  List<dynamic> _categories = [];
  String? _userName;
  bool _loading = true;

  final List<Map<String, dynamic>> _defaultCategories = [
    {'name': 'EV Chargers', 'icon': '⚡', 'color': 0xFF0F172A, 'accent': 0xFFF59E0B},
    {'name': 'Induction', 'icon': '🔥', 'color': 0xFF1E1B4B, 'accent': 0xFF818CF8},
    {'name': 'Industrial', 'icon': '⚙️', 'color': 0xFF1C1917, 'accent': 0xFFA8A29E},
    {'name': 'Solar', 'icon': '☀️', 'color': 0xFF14532D, 'accent': 0xFF86EFAC},
    {'name': 'Wiring', 'icon': '🔌', 'color': 0xFF1E3A5F, 'accent': 0xFF7DD3FC},
    {'name': 'Automation', 'icon': '🤖', 'color': 0xFF3B0764, 'accent': 0xFFE879F9},
  ];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final name = await ApiService.getUserName();
    try {
      final featured = await ApiService.getFeaturedProducts();
      final cats = await ApiService.getCategories();
      setState(() { _featured = featured; _categories = cats; _userName = name; _loading = false; });
    } catch (_) {
      setState(() { _userName = name; _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgLight,
      body: IndexedStack(
        index: _currentIndex,
        children: [
          _buildHome(),
          const ProductsScreen(),
          const RfqScreen(),
          const CartScreen(),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (i) => setState(() => _currentIndex = i),
        backgroundColor: AppColors.navy,
        indicatorColor: AppColors.amber.withOpacity(0.2),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined, color: AppColors.textMuted), selectedIcon: Icon(Icons.home, color: AppColors.amber), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.grid_view_outlined, color: AppColors.textMuted), selectedIcon: Icon(Icons.grid_view, color: AppColors.amber), label: 'Products'),
          NavigationDestination(icon: Icon(Icons.description_outlined, color: AppColors.textMuted), selectedIcon: Icon(Icons.description, color: AppColors.amber), label: 'RFQ'),
          NavigationDestination(icon: Icon(Icons.shopping_cart_outlined, color: AppColors.textMuted), selectedIcon: Icon(Icons.shopping_cart, color: AppColors.amber), label: 'Cart'),
        ],
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
      ),
    );
  }

  Widget _buildHome() {
    return CustomScrollView(
      slivers: [
        // App Bar
        SliverAppBar(
          expandedHeight: 120,
          floating: true,
          pinned: true,
          backgroundColor: AppColors.navy,
          flexibleSpace: FlexibleSpaceBar(
            background: Container(
              decoration: const BoxDecoration(gradient: AppColors.navyGradient),
              padding: const EdgeInsets.fromLTRB(20, 50, 20, 0),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(
                      _userName != null ? 'Hello, ${_userName!.split(' ')[0]} 👋' : 'SmartElectro B2B',
                      style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w700),
                    ),
                    const Text('India\'s #1 Electrical Marketplace', style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
                  ]),
                  GestureDetector(
                    onTap: () async {
                      await ApiService.clearAuthData();
                      if (!mounted) return;
                      Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
                    },
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(color: AppColors.navyLight, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.navyBorder)),
                      child: _userName != null
                          ? Text(_userName![0], style: const TextStyle(color: AppColors.amber, fontWeight: FontWeight.w900, fontSize: 16))
                          : const Icon(Icons.person_outline, color: AppColors.textMuted, size: 20),
                    ),
                  ),
                ]),
              ]),
            ),
          ),
          bottom: PreferredSize(
            preferredSize: const Size.fromHeight(60),
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
              child: GestureDetector(
                onTap: () => setState(() => _currentIndex = 1),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(color: AppColors.navyLight, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.navyBorder)),
                  child: const Row(children: [
                    Icon(Icons.search, color: AppColors.textMuted, size: 20),
                    SizedBox(width: 10),
                    Text('Search products, suppliers...', style: TextStyle(color: AppColors.textMuted, fontSize: 14)),
                  ]),
                ),
              ),
            ),
          ),
        ),

        SliverToBoxAdapter(child: Column(children: [

          // Stats bar
          Container(
            color: AppColors.amber,
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [
              _statItem('500+', 'Suppliers'),
              _divider(),
              _statItem('10K+', 'Products'),
              _divider(),
              _statItem('25K+', 'Buyers'),
              _divider(),
              _statItem('150+', 'Cities'),
            ]),
          ),

          // Categories
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
            child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              const Text('Categories', style: TextStyle(color: AppColors.textPrimary, fontSize: 18, fontWeight: FontWeight.w800)),
              GestureDetector(
                onTap: () => setState(() => _currentIndex = 1),
                child: const Text('See all →', style: TextStyle(color: AppColors.amber, fontSize: 13, fontWeight: FontWeight.w600)),
              ),
            ]),
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 100,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              separatorBuilder: (_, __) => const SizedBox(width: 10),
              itemCount: _defaultCategories.length,
              itemBuilder: (_, i) {
                final cat = _defaultCategories[i];
                return GestureDetector(
                  onTap: () {
                    setState(() => _currentIndex = 1);
                  },
                  child: Container(
                    width: 80,
                    decoration: BoxDecoration(color: Color(cat['color']), borderRadius: BorderRadius.circular(14)),
                    child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                      Text(cat['icon'], style: const TextStyle(fontSize: 28)),
                      const SizedBox(height: 6),
                      Text(cat['name'], textAlign: TextAlign.center,
                          style: TextStyle(color: Color(cat['accent']), fontSize: 10, fontWeight: FontWeight.w700),
                          maxLines: 2, overflow: TextOverflow.ellipsis),
                    ]),
                  ),
                );
              },
            ),
          ),

          // Featured Products
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 24, 16, 12),
            child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              const Text('Featured Products', style: TextStyle(color: AppColors.textPrimary, fontSize: 18, fontWeight: FontWeight.w800)),
              GestureDetector(
                onTap: () => setState(() => _currentIndex = 1),
                child: const Text('View all →', style: TextStyle(color: AppColors.amber, fontSize: 13, fontWeight: FontWeight.w600)),
              ),
            ]),
          ),

          if (_loading)
            const Padding(padding: EdgeInsets.all(32), child: CircularProgressIndicator(color: AppColors.amber))
          else if (_featured.isEmpty)
            Padding(
              padding: const EdgeInsets.all(32),
              child: Column(children: [
                const Text('📦', style: TextStyle(fontSize: 48)),
                const SizedBox(height: 8),
                const Text('No featured products yet', style: TextStyle(color: AppColors.textSecondary, fontSize: 14)),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => setState(() => _currentIndex = 1),
                  child: const Text('Browse All Products'),
                ),
              ]),
            )
          else
            SizedBox(
              height: 220,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                separatorBuilder: (_, __) => const SizedBox(width: 12),
                itemCount: _featured.length,
                itemBuilder: (_, i) => _productCard(_featured[i]),
              ),
            ),

          // RFQ Banner
          Padding(
            padding: const EdgeInsets.all(16),
            child: GestureDetector(
              onTap: () => setState(() => _currentIndex = 2),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: AppColors.navyGradient,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.navyBorder),
                ),
                child: Row(children: [
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    const Text('Need a Bulk Order?', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w800)),
                    const SizedBox(height: 4),
                    const Text('Post your requirement and get quotes from verified suppliers in 24 hours',
                        style: TextStyle(color: AppColors.textMuted, fontSize: 13)),
                    const SizedBox(height: 14),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(gradient: AppColors.amberGradient, borderRadius: BorderRadius.circular(10)),
                      child: const Text('Post Requirement →', style: TextStyle(color: AppColors.navy, fontWeight: FontWeight.w700, fontSize: 13)),
                    ),
                  ])),
                  const SizedBox(width: 16),
                  const Text('📩', style: TextStyle(fontSize: 48)),
                ]),
              ),
            ),
          ),

          // How it works
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Text('How It Works', style: TextStyle(color: AppColors.textPrimary, fontSize: 18, fontWeight: FontWeight.w800)),
              const SizedBox(height: 16),
              ...[
                {'icon': '🔍', 'title': 'Search & Browse', 'desc': 'Find products across 6+ categories with filters'},
                {'icon': '📩', 'title': 'Get Quotes or Buy', 'desc': 'Add to cart or post RFQ for bulk orders'},
                {'icon': '📦', 'title': 'Order & Track', 'desc': 'Place order with GST invoice and PO generation'},
              ].map((s) => Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14),
                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8, offset: const Offset(0, 2))]),
                child: Row(children: [
                  Text(s['icon']!, style: const TextStyle(fontSize: 28)),
                  const SizedBox(width: 14),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(s['title']!, style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.textPrimary, fontSize: 15)),
                    Text(s['desc']!, style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                  ])),
                ]),
              )).toList(),
            ]),
          ),
        ])),
      ],
    );
  }

  Widget _productCard(Map<String, dynamic> p) {
    return GestureDetector(
      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => ProductDetailScreen(productId: p['id']))),
      child: Container(
        width: 160,
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 8, offset: const Offset(0, 2))]),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Container(
            height: 110, width: double.infinity,
            decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: const BorderRadius.vertical(top: Radius.circular(16))),
            child: p['images'] != null && (p['images'] as List).isNotEmpty
                ? ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                child: CachedNetworkImage(imageUrl: p['images'][0], fit: BoxFit.cover,
                    errorWidget: (_, __, ___) => const Center(child: Text('⚡', style: TextStyle(fontSize: 36)))))
                : const Center(child: Text('⚡', style: TextStyle(fontSize: 36))),
          ),
          Padding(
            padding: const EdgeInsets.all(10),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(p['category']?['name'] ?? 'Electrical',
                  style: const TextStyle(color: AppColors.amber, fontSize: 10, fontWeight: FontWeight.w700)),
              const SizedBox(height: 4),
              Text(p['name'] ?? '', maxLines: 2, overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: AppColors.textPrimary)),
              const SizedBox(height: 6),
              Text(
                p['basePrice'] != null ? '₹${(p['basePrice'] as num).toStringAsFixed(0)}' : 'Get Quote',
                style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14, color: AppColors.textPrimary),
              ),
            ]),
          ),
        ]),
      ),
    );
  }

  Widget _statItem(String val, String label) => Column(children: [
    Text(val, style: const TextStyle(color: AppColors.navy, fontWeight: FontWeight.w900, fontSize: 18)),
    Text(label, style: const TextStyle(color: Color(0xFF78350F), fontSize: 11)),
  ]);

  Widget _divider() => Container(height: 30, width: 1, color: AppColors.navy.withOpacity(0.2));
}
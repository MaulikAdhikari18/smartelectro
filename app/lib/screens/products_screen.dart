import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../constants/app_colors.dart';
import '../services/api_service.dart';
import 'product_detail_screen.dart';

class ProductsScreen extends StatefulWidget {
  const ProductsScreen({super.key});
  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  List<dynamic> _products = [];
  List<dynamic> _categories = [];
  bool _loading = true;
  String _search = '';
  int? _selectedCategoryId;
  final _searchCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _loading = true);
    try {
      final products = await ApiService.getProducts(search: _search.isNotEmpty ? _search : null, categoryId: _selectedCategoryId);
      final cats = await ApiService.getCategories();
      setState(() { _products = products; _categories = cats; _loading = false; });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: AppBar(
        title: const Text('Products'),
        backgroundColor: AppColors.navy,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(56),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(12, 0, 12, 8),
            child: TextField(
              controller: _searchCtrl,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Search products...',
                prefixIcon: const Icon(Icons.search, color: AppColors.textMuted),
                suffixIcon: _search.isNotEmpty ? IconButton(
                  icon: const Icon(Icons.clear, color: AppColors.textMuted),
                  onPressed: () { _searchCtrl.clear(); setState(() => _search = ''); _loadData(); },
                ) : null,
                contentPadding: const EdgeInsets.symmetric(vertical: 10),
              ),
              onSubmitted: (v) { setState(() => _search = v); _loadData(); },
            ),
          ),
        ),
      ),
      body: Column(children: [
        // Category filter
        if (_categories.isNotEmpty) SizedBox(
          height: 48,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            separatorBuilder: (_, __) => const SizedBox(width: 8),
            itemCount: _categories.length + 1,
            itemBuilder: (_, i) {
              if (i == 0) return _catChip('All', null);
              return _catChip(_categories[i-1]['name'], _categories[i-1]['id']);
            },
          ),
        ),

        Expanded(child: _loading
            ? const Center(child: CircularProgressIndicator(color: AppColors.amber))
            : _products.isEmpty
            ? Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          const Text('🔍', style: TextStyle(fontSize: 48)),
          const SizedBox(height: 12),
          const Text('No products found', style: TextStyle(color: AppColors.textSecondary, fontSize: 16, fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          TextButton(onPressed: () { _searchCtrl.clear(); setState(() { _search = ''; _selectedCategoryId = null; }); _loadData(); },
              child: const Text('Clear filters', style: TextStyle(color: AppColors.amber))),
        ]))
            : RefreshIndicator(
          color: AppColors.amber,
          onRefresh: _loadData,
          child: GridView.builder(
            padding: const EdgeInsets.all(12),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2, mainAxisSpacing: 12, crossAxisSpacing: 12, childAspectRatio: 0.72),
            itemCount: _products.length,
            itemBuilder: (_, i) => _buildCard(_products[i]),
          ),
        )),
      ]),
    );
  }

  Widget _catChip(String name, int? id) => GestureDetector(
    onTap: () { setState(() => _selectedCategoryId = id); _loadData(); },
    child: Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
      decoration: BoxDecoration(
        gradient: _selectedCategoryId == id ? AppColors.amberGradient : null,
        color: _selectedCategoryId == id ? null : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: _selectedCategoryId == id ? AppColors.amber : const Color(0xFFE2E8F0)),
      ),
      child: Text(name, style: TextStyle(
        color: _selectedCategoryId == id ? AppColors.navy : AppColors.textSecondary,
        fontWeight: FontWeight.w600, fontSize: 13,
      )),
    ),
  );

  Widget _buildCard(Map<String, dynamic> p) => GestureDetector(
    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => ProductDetailScreen(productId: p['id']))),
    child: Container(
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8, offset: const Offset(0, 2))]),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Expanded(
          flex: 3,
          child: Container(
            decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: const BorderRadius.vertical(top: Radius.circular(16))),
            child: p['images'] != null && (p['images'] as List).isNotEmpty
                ? ClipRRect(borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                child: CachedNetworkImage(imageUrl: p['images'][0], fit: BoxFit.cover, width: double.infinity,
                    errorWidget: (_, __, ___) => const Center(child: Text('⚡', style: TextStyle(fontSize: 36)))))
                : const Center(child: Text('⚡', style: TextStyle(fontSize: 36))),
          ),
        ),
        Expanded(
          flex: 2,
          child: Padding(
            padding: const EdgeInsets.all(10),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text(p['category']?['name'] ?? 'Electrical',
                  style: const TextStyle(color: AppColors.amber, fontSize: 10, fontWeight: FontWeight.w700)),
              Text(p['name'] ?? '', maxLines: 2, overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: AppColors.textPrimary)),
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Text(p['basePrice'] != null ? '₹${(p['basePrice'] as num).toStringAsFixed(0)}' : 'Quote',
                    style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: AppColors.textPrimary)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(color: AppColors.amberLight, borderRadius: BorderRadius.circular(6)),
                  child: Text('MOQ:${p['moq'] ?? 1}', style: const TextStyle(fontSize: 9, color: AppColors.warning, fontWeight: FontWeight.w700)),
                ),
              ]),
            ]),
          ),
        ),
      ]),
    ),
  );
}
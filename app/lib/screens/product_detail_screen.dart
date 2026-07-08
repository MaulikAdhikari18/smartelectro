import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:carousel_slider/carousel_slider.dart';
import '../constants/app_colors.dart';
import '../services/api_service.dart';
import 'rfq_screen.dart';

class ProductDetailScreen extends StatefulWidget {
  final int productId;
  const ProductDetailScreen({super.key, required this.productId});
  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  Map<String, dynamic>? _product;
  bool _loading = true;
  int _quantity = 1;
  int _activeImage = 0;
  bool _addedToCart = false;
  String _activeTab = 'specs';

  @override
  void initState() {
    super.initState();
    _loadProduct();
  }

  Future<void> _loadProduct() async {
    try {
      final p = await ApiService.getProduct(widget.productId);
      setState(() {
        _product = p;
        _quantity = (p['moq'] as num?)?.toInt() ?? 1;
        _loading = false;
      });
    } catch (_) {
      setState(() => _loading = false);
      if (mounted) Navigator.pop(context);
    }
  }

  double get _price {
    if (_product == null) return 0;
    final tiers = _product!['priceTiers'] as List?;
    if (tiers != null && tiers.isNotEmpty) {
      for (final tier in tiers) {
        final min = (tier['minQty'] as num?)?.toInt() ?? 0;
        final max = (tier['maxQty'] as num?)?.toInt();
        if (_quantity >= min && (max == null || _quantity <= max)) {
          return (tier['price'] as num?)?.toDouble() ?? 0;
        }
      }
    }
    return (_product!['basePrice'] as num?)?.toDouble() ?? 0;
  }

  int get _moq => (_product?['moq'] as num?)?.toInt() ?? 1;

  void _addToCart() {
    // Simple cart stored in memory (extend with shared_preferences if needed)
    setState(() => _addedToCart = true);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${_product!['name']} added to cart!'),
        backgroundColor: AppColors.success,
        duration: const Duration(seconds: 2),
      ),
    );
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) setState(() => _addedToCart = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Scaffold(backgroundColor: AppColors.bgLight,
        body: Center(child: CircularProgressIndicator(color: AppColors.amber)));

    if (_product == null) return const SizedBox();

    final images = (_product!['images'] as List?) ?? [];
    final priceTiers = (_product!['priceTiers'] as List?) ?? [];

    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: AppBar(
        backgroundColor: AppColors.navy,
        title: Text(_product!['name'] ?? 'Product', maxLines: 1, overflow: TextOverflow.ellipsis),
        leading: IconButton(icon: const Icon(Icons.arrow_back_ios, color: Colors.white), onPressed: () => Navigator.pop(context)),
      ),
      body: SingleChildScrollView(
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

          // Image carousel
          if (images.isNotEmpty)
            Stack(children: [
              CarouselSlider(
                options: CarouselOptions(
                  height: 280, viewportFraction: 1.0, enableInfiniteScroll: images.length > 1,
                  onPageChanged: (i, _) => setState(() => _activeImage = i),
                ),
                items: images.map((img) => CachedNetworkImage(
                  imageUrl: img as String, fit: BoxFit.cover, width: double.infinity,
                  errorWidget: (_, __, ___) => Container(color: const Color(0xFFF8FAFC),
                      child: const Center(child: Text('⚡', style: TextStyle(fontSize: 60)))),
                )).toList(),
              ),
              if (images.length > 1) Positioned(
                bottom: 12, left: 0, right: 0,
                child: Row(mainAxisAlignment: MainAxisAlignment.center, children: images.asMap().entries.map((e) =>
                    Container(width: e.key == _activeImage ? 20 : 6, height: 6, margin: const EdgeInsets.symmetric(horizontal: 3),
                      decoration: BoxDecoration(
                          color: e.key == _activeImage ? AppColors.amber : Colors.white.withOpacity(0.5),
                          borderRadius: BorderRadius.circular(3)),
                    )
                ).toList()),
              ),
            ])
          else
            Container(height: 280, color: const Color(0xFFF8FAFC),
                child: const Center(child: Text('⚡', style: TextStyle(fontSize: 80)))),

          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

              // Category + name
              Text(_product!['category']?['name'] ?? 'Electrical',
                  style: const TextStyle(color: AppColors.amber, fontSize: 12, fontWeight: FontWeight.w700)),
              const SizedBox(height: 6),
              Text(_product!['name'] ?? '', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
              const SizedBox(height: 8),

              // Supplier
              Row(children: [
                Container(width: 28, height: 28, decoration: BoxDecoration(gradient: AppColors.amberGradient, borderRadius: BorderRadius.circular(8)),
                    child: Center(child: Text((_product!['supplier']?['companyName'] ?? 'S')[0],
                        style: const TextStyle(color: AppColors.navy, fontWeight: FontWeight.w900, fontSize: 13)))),
                const SizedBox(width: 8),
                Text(_product!['supplier']?['companyName'] ?? 'Verified Supplier',
                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                const SizedBox(width: 6),
                Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(color: AppColors.successLight, borderRadius: BorderRadius.circular(6)),
                    child: const Text('✓ Verified', style: TextStyle(color: AppColors.success, fontSize: 11, fontWeight: FontWeight.w600))),
              ]),
              const SizedBox(height: 16),

              // Price card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8)]),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

                  // Price
                  Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
                    Text(_price > 0 ? '₹${_price.toStringAsFixed(0)}' : 'Get Quote',
                        style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: AppColors.textPrimary)),
                    if (_price > 0) const Padding(padding: EdgeInsets.only(bottom: 4, left: 4),
                        child: Text('per unit', style: TextStyle(color: AppColors.textMuted, fontSize: 13))),
                  ]),

                  // Price tiers
                  if (priceTiers.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    const Text('Bulk Pricing', style: TextStyle(color: AppColors.textMuted, fontSize: 12, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 8),
                    SizedBox(
                      height: 60,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        separatorBuilder: (_, __) => const SizedBox(width: 8),
                        itemCount: priceTiers.length,
                        itemBuilder: (_, i) {
                          final tier = priceTiers[i];
                          return Container(
                            width: 90,
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(color: AppColors.bgLight, borderRadius: BorderRadius.circular(10),
                                border: Border.all(color: const Color(0xFFE2E8F0))),
                            child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                              Text('${tier['minQty']}-${tier['maxQty'] ?? '∞'}',
                                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 10)),
                              Text('₹${(tier['price'] as num).toStringAsFixed(0)}',
                                  style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: AppColors.textPrimary)),
                            ]),
                          );
                        },
                      ),
                    ),
                  ],

                  // MOQ warning
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(color: AppColors.amberLight, borderRadius: BorderRadius.circular(10)),
                    child: Row(children: [
                      const Text('📦 ', style: TextStyle(fontSize: 16)),
                      Text('Minimum Order: $_moq units', style: const TextStyle(color: AppColors.warning, fontWeight: FontWeight.w700, fontSize: 13)),
                    ]),
                  ),
                  const SizedBox(height: 12),

                  // Quantity selector
                  Row(children: [
                    const Text('Qty:', style: TextStyle(color: AppColors.textSecondary, fontSize: 14, fontWeight: FontWeight.w600)),
                    const SizedBox(width: 12),
                    Container(
                      decoration: BoxDecoration(border: Border.all(color: const Color(0xFFE2E8F0)), borderRadius: BorderRadius.circular(10)),
                      child: Row(children: [
                        IconButton(
                          icon: const Icon(Icons.remove, size: 18),
                          onPressed: _quantity > _moq ? () => setState(() => _quantity--) : null,
                          color: AppColors.textPrimary,
                          padding: const EdgeInsets.all(8),
                          constraints: const BoxConstraints(),
                        ),
                        SizedBox(width: 40, child: Text('$_quantity', textAlign: TextAlign.center,
                            style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: AppColors.textPrimary))),
                        IconButton(
                          icon: const Icon(Icons.add, size: 18),
                          onPressed: () => setState(() => _quantity++),
                          color: AppColors.textPrimary,
                          padding: const EdgeInsets.all(8),
                          constraints: const BoxConstraints(),
                        ),
                      ]),
                    ),
                    const SizedBox(width: 12),
                    if (_price > 0) Text('= ₹${(_price * _quantity).toStringAsFixed(0)}',
                        style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.textSecondary, fontSize: 14)),
                  ]),
                  const SizedBox(height: 16),

                  // CTAs
                  Row(children: [
                    Expanded(child: ElevatedButton(
                      onPressed: _quantity >= _moq ? _addToCart : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _addedToCart ? AppColors.success : AppColors.amber,
                        foregroundColor: AppColors.navy,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: Text(_addedToCart ? '✓ Added!' : '🛒 Add to Cart', style: const TextStyle(fontWeight: FontWeight.w700)),
                    )),
                    const SizedBox(width: 10),
                    Expanded(child: OutlinedButton(
                      onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const RfqScreen())),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: AppColors.navy),
                        foregroundColor: AppColors.navy,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('📩 Get Quote', style: TextStyle(fontWeight: FontWeight.w700)),
                    )),
                  ]),
                ]),
              ),
              const SizedBox(height: 16),

              // Tabs
              Row(children: ['specs', 'supplier', 'delivery'].map((tab) => Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _activeTab = tab),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    decoration: BoxDecoration(
                      border: Border(bottom: BorderSide(
                          color: _activeTab == tab ? AppColors.amber : Colors.transparent, width: 2)),
                      color: _activeTab == tab ? AppColors.amberLight : Colors.white,
                    ),
                    child: Text(
                      tab == 'specs' ? 'Specs' : tab == 'supplier' ? 'Supplier' : 'Delivery',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: _activeTab == tab ? AppColors.warning : AppColors.textSecondary,
                        fontWeight: FontWeight.w700, fontSize: 13,
                      ),
                    ),
                  ),
                ),
              )).toList()),

              // Tab content
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: Colors.white, borderRadius: const BorderRadius.vertical(bottom: Radius.circular(16)),
                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 6)]),
                child: _buildTabContent(priceTiers),
              ),
              const SizedBox(height: 24),
            ]),
          ),
        ]),
      ),
    );
  }

  Widget _buildTabContent(List priceTiers) {
    if (_activeTab == 'specs') {
      return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        if (_product!['description'] != null)
          Text(_product!['description'], style: const TextStyle(color: AppColors.textSecondary, fontSize: 14, height: 1.6)),
        const SizedBox(height: 12),
        ...[
          ['Brand', _product!['brand'] ?? 'N/A'],
          ['MOQ', '$_moq units'],
          ['Delivery', _product!['deliveryTimeline'] ?? '5-7 days'],
          ['Category', _product!['category']?['name'] ?? 'Electrical'],
          ['GST Invoice', 'Included'],
        ].map((row) => Padding(
          padding: const EdgeInsets.symmetric(vertical: 6),
          child: Row(children: [
            SizedBox(width: 100, child: Text(row[0], style: const TextStyle(color: AppColors.textMuted, fontSize: 13))),
            Expanded(child: Text(row[1], style: const TextStyle(fontWeight: FontWeight.w600, color: AppColors.textPrimary, fontSize: 13))),
          ]),
        )).toList(),
      ]);
    } else if (_activeTab == 'supplier') {
      return Row(children: [
        Container(width: 48, height: 48, decoration: BoxDecoration(gradient: AppColors.amberGradient, borderRadius: BorderRadius.circular(12)),
            child: Center(child: Text((_product!['supplier']?['companyName'] ?? 'S')[0],
                style: const TextStyle(color: AppColors.navy, fontWeight: FontWeight.w900, fontSize: 20)))),
        const SizedBox(width: 14),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(_product!['supplier']?['companyName'] ?? 'Verified Supplier',
              style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: AppColors.textPrimary)),
          Text(_product!['supplier']?['location'] ?? 'India',
              style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
          const SizedBox(height: 6),
          Row(children: [
            Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(color: AppColors.successLight, borderRadius: BorderRadius.circular(8)),
                child: const Text('✓ GST Verified', style: TextStyle(color: AppColors.success, fontSize: 11, fontWeight: FontWeight.w600))),
          ]),
        ])),
      ]);
    } else {
      return Column(children: [
        ['🚚', 'Delivery', _product!['deliveryTimeline'] ?? '5-7 business days'],
        ['📍', 'Coverage', 'Pan India delivery'],
        ['💳', 'Payment', 'UPI, Bank Transfer, Credit Terms'],
        ['📄', 'GST Invoice', 'Auto-generated on every order'],
        ['📦', 'Purchase Order', 'PO document generated automatically'],
      ].map((item) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(children: [
          Text(item[0], style: const TextStyle(fontSize: 20)),
          const SizedBox(width: 12),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(item[1], style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.textPrimary, fontSize: 13)),
            Text(item[2], style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
          ])),
        ]),
      )).toList(),
      );
    }
  }
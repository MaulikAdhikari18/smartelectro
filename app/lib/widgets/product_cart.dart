import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../constants/app_colors.dart';

class ProductCard extends StatelessWidget {
  final Map<String, dynamic> product;
  final VoidCallback onTap;

  const ProductCard({super.key, required this.product, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final images = (product['images'] as List?) ?? [];
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 8, offset: const Offset(0, 2))]),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Expanded(flex: 3, child: Container(
            decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: const BorderRadius.vertical(top: Radius.circular(16))),
            child: images.isNotEmpty
                ? ClipRRect(borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                child: CachedNetworkImage(imageUrl: images[0], fit: BoxFit.cover, width: double.infinity,
                    errorWidget: (_, __, ___) => const Center(child: Text('⚡', style: TextStyle(fontSize: 36)))))
                : const Center(child: Text('⚡', style: TextStyle(fontSize: 36))),
          )),
          Expanded(flex: 2, child: Padding(
            padding: const EdgeInsets.all(10),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text(product['category']?['name'] ?? 'Electrical',
                  style: const TextStyle(color: AppColors.amber, fontSize: 10, fontWeight: FontWeight.w700)),
              Text(product['name'] ?? '', maxLines: 2, overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: AppColors.textPrimary)),
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Text(product['basePrice'] != null ? '₹${(product['basePrice'] as num).toStringAsFixed(0)}' : 'Quote',
                    style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: AppColors.textPrimary)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                  decoration: BoxDecoration(color: AppColors.amberLight, borderRadius: BorderRadius.circular(5)),
                  child: Text('MOQ:${product['moq'] ?? 1}',
                      style: const TextStyle(fontSize: 9, color: AppColors.warning, fontWeight: FontWeight.w700)),
                ),
              ]),
            ]),
          )),
        ]),
      ),
    );
  }
}
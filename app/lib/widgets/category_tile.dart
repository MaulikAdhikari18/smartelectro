import 'package:flutter/material.dart';

class CategoryTile extends StatelessWidget {
  final String icon;
  final String name;
  final Color bgColor;
  final Color accentColor;
  final VoidCallback onTap;

  const CategoryTile({
    super.key,
    required this.icon,
    required this.name,
    required this.bgColor,
    required this.accentColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 80,
        decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(14)),
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          Text(icon, style: const TextStyle(fontSize: 28)),
          const SizedBox(height: 6),
          Text(name, textAlign: TextAlign.center,
              style: TextStyle(color: accentColor, fontSize: 10, fontWeight: FontWeight.w700),
              maxLines: 2, overflow: TextOverflow.ellipsis),
        ]),
      ),
    );
  }
}
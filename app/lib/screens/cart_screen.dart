import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

class CartItem {
  final int productId;
  final String name;
  final double price;
  int quantity;
  final String image;

  CartItem({required this.productId, required this.name, required this.price, required this.quantity, this.image = '⚡'});
}

// Global cart state (simple in-memory)
class CartManager {
  static final List<CartItem> items = [];

  static void addItem(int productId, String name, double price, int quantity, {String image = '⚡'}) {
    final existing = items.where((i) => i.productId == productId).toList();
    if (existing.isNotEmpty) {
      existing.first.quantity += quantity;
    } else {
      items.add(CartItem(productId: productId, name: name, price: price, quantity: quantity, image: image));
    }
  }

  static void removeItem(int productId) => items.removeWhere((i) => i.productId == productId);
  static void updateQty(int productId, int qty) {
    final item = items.where((i) => i.productId == productId).toList();
    if (item.isNotEmpty) item.first.quantity = qty;
  }

  static double get subtotal => items.fold(0, (sum, i) => sum + i.price * i.quantity);
  static double get gst => subtotal * 0.18;
  static double get shipping => subtotal > 10000 ? 0 : 500;
  static double get total => subtotal + gst + shipping;
  static int get count => items.fold(0, (sum, i) => sum + i.quantity);
}

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});
  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  bool _isCheckout = false;
  bool _isSuccess = false;
  bool _loading = false;
  String _paymentMethod = 'UPI';
  final _addressCtrl = TextEditingController();

  void _placeOrder() async {
    if (_addressCtrl.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter delivery address'), backgroundColor: AppColors.error),
      );
      return;
    }
    setState(() => _loading = true);
    await Future.delayed(const Duration(seconds: 1)); // Simulate API call
    CartManager.items.clear();
    setState(() { _loading = false; _isSuccess = true; });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: AppBar(
        backgroundColor: AppColors.navy,
        title: Text(_isSuccess ? 'Order Confirmed' : _isCheckout ? 'Checkout' : 'My Cart (${CartManager.count})'),
        automaticallyImplyLeading: false,
        actions: [
          if (!_isSuccess && !_isCheckout && CartManager.items.isNotEmpty)
            TextButton(
              onPressed: () { setState(() { CartManager.items.clear(); }); },
              child: const Text('Clear', style: TextStyle(color: AppColors.amber)),
            ),
        ],
      ),
      body: _isSuccess ? _buildSuccess() : CartManager.items.isEmpty && !_isCheckout ? _buildEmpty() : _buildCart(),
    );
  }

  Widget _buildEmpty() => Center(
    child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      const Text('🛒', style: TextStyle(fontSize: 64)),
      const SizedBox(height: 16),
      const Text('Your cart is empty', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
      const SizedBox(height: 8),
      const Text('Browse products and add them to your cart', style: TextStyle(color: AppColors.textSecondary, fontSize: 14)),
      const SizedBox(height: 28),
      ElevatedButton(
        onPressed: () {},
        child: const Text('Browse Products'),
      ),
    ]),
  );

  Widget _buildSuccess() => Center(
    child: Padding(
      padding: const EdgeInsets.all(32),
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Container(width: 90, height: 90, decoration: BoxDecoration(gradient: AppColors.amberGradient, shape: BoxShape.circle),
            child: const Center(child: Text('✓', style: TextStyle(color: AppColors.navy, fontSize: 40, fontWeight: FontWeight.w900)))),
        const SizedBox(height: 24),
        const Text('Order Placed!', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
        const SizedBox(height: 12),
        const Text('Your order has been confirmed. GST invoice will be sent to your email.', textAlign: TextAlign.center,
            style: TextStyle(color: AppColors.textSecondary, fontSize: 15, height: 1.5)),
        const SizedBox(height: 40),
        SizedBox(width: double.infinity, child: ElevatedButton(
          onPressed: () => setState(() { _isSuccess = false; _isCheckout = false; }),
          child: const Text('Continue Shopping'),
        )),
      ]),
    ),
  );

  Widget _buildCart() => Column(children: [
    Expanded(child: SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(children: [

        // Cart items
        if (!_isCheckout) ...[
          ...CartManager.items.map((item) => Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8)]),
            child: Row(children: [
              Container(width: 60, height: 60, decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(12)),
                  child: Center(child: Text(item.image, style: const TextStyle(fontSize: 28)))),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(item.name, maxLines: 2, overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.textPrimary)),
                const SizedBox(height: 4),
                Text('₹${item.price.toStringAsFixed(0)} per unit', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                const SizedBox(height: 8),
                Row(children: [
                  Container(
                    decoration: BoxDecoration(border: Border.all(color: const Color(0xFFE2E8F0)), borderRadius: BorderRadius.circular(8)),
                    child: Row(mainAxisSize: MainAxisSize.min, children: [
                      InkWell(
                        onTap: () { if (item.quantity > 1) setState(() => CartManager.updateQty(item.productId, item.quantity - 1)); },
                        child: const Padding(padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4), child: Icon(Icons.remove, size: 16, color: AppColors.textPrimary)),
                      ),
                      Text('${item.quantity}', style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.textPrimary)),
                      InkWell(
                        onTap: () => setState(() => CartManager.updateQty(item.productId, item.quantity + 1)),
                        child: const Padding(padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4), child: Icon(Icons.add, size: 16, color: AppColors.textPrimary)),
                      ),
                    ]),
                  ),
                  const SizedBox(width: 10),
                  Text('= ₹${(item.price * item.quantity).toStringAsFixed(0)}',
                      style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: AppColors.textPrimary)),
                ]),
              ])),
              IconButton(
                icon: const Icon(Icons.close, color: AppColors.error, size: 20),
                onPressed: () => setState(() => CartManager.removeItem(item.productId)),
              ),
            ]),
          )).toList(),
        ],

        // Checkout form
        if (_isCheckout) Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8)]),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('Delivery Details', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
            const SizedBox(height: 16),
            const Text('Delivery Address *', style: TextStyle(color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            TextField(controller: _addressCtrl, maxLines: 3,
              decoration: const InputDecoration(hintText: 'Enter full delivery address with pincode...', fillColor: Color(0xFFF8FAFC),
                enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12)), borderSide: BorderSide(color: Color(0xFFE2E8F0))),
                focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12)), borderSide: BorderSide(color: AppColors.amber, width: 2)),
              ),
              style: const TextStyle(color: AppColors.textPrimary),
            ),
            const SizedBox(height: 20),
            const Text('Payment Method', style: TextStyle(color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),
            Row(children: [
              {'value': 'UPI', 'icon': '📱', 'label': 'UPI'},
              {'value': 'BANK_TRANSFER', 'icon': '🏦', 'label': 'Bank'},
              {'value': 'CREDIT', 'icon': '💳', 'label': 'Credit'},
            ].map((m) => Expanded(child: GestureDetector(
              onTap: () => setState(() => _paymentMethod = m['value']!),
              child: Container(
                margin: const EdgeInsets.only(right: 8),
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: _paymentMethod == m['value'] ? AppColors.amberLight : AppColors.bgLight,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: _paymentMethod == m['value'] ? AppColors.amber : const Color(0xFFE2E8F0), width: 2),
                ),
                child: Column(children: [
                  Text(m['icon']!, style: const TextStyle(fontSize: 24)),
                  const SizedBox(height: 4),
                  Text(m['label']!, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700,
                      color: _paymentMethod == m['value'] ? AppColors.warning : AppColors.textSecondary)),
                ]),
              ),
            ))).toList(),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: AppColors.successLight, borderRadius: BorderRadius.circular(10)),
              child: const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('✅ What\'s included:', style: TextStyle(fontWeight: FontWeight.w700, color: AppColors.success, fontSize: 13)),
                SizedBox(height: 6),
                Text('• GST Invoice generated automatically', style: TextStyle(color: AppColors.success, fontSize: 12)),
                Text('• Purchase Order (PO) document', style: TextStyle(color: AppColors.success, fontSize: 12)),
                Text('• Email confirmation with tracking', style: TextStyle(color: AppColors.success, fontSize: 12)),
              ]),
            ),
          ]),
        ),

        // Order summary
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8)]),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('Order Summary', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
            const SizedBox(height: 14),
            _summaryRow('Subtotal (${CartManager.items.length} items)', '₹${CartManager.subtotal.toStringAsFixed(0)}'),
            _summaryRow('GST (18%)', '₹${CartManager.gst.toStringAsFixed(0)}'),
            _summaryRow('Shipping', CartManager.shipping == 0 ? 'FREE' : '₹${CartManager.shipping.toStringAsFixed(0)}', isGreen: CartManager.shipping == 0),
            if (CartManager.shipping == 0) Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Text('🎉 Free shipping on orders above ₹10,000', style: TextStyle(color: AppColors.success, fontSize: 11)),
            ),
            const Divider(color: Color(0xFFE2E8F0)),
            _summaryRow('Total', '₹${CartManager.total.toStringAsFixed(0)}', isBold: true, isLarge: true),
          ]),
        ),
        const SizedBox(height: 80),
      ]),
    )),

    // Bottom bar
    Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      decoration: BoxDecoration(color: Colors.white,
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 12, offset: const Offset(0, -4))]),
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        if (_isCheckout) ...[
          SizedBox(width: double.infinity, child: ElevatedButton(
            onPressed: _loading ? null : _placeOrder,
            style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
            child: _loading
                ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: AppColors.navy, strokeWidth: 2))
                : const Text('✅ Place Order'),
          )),
          const SizedBox(height: 8),
          SizedBox(width: double.infinity, child: OutlinedButton(
            onPressed: () => setState(() => _isCheckout = false),
            style: OutlinedButton.styleFrom(side: const BorderSide(color: Color(0xFFE2E8F0)), foregroundColor: AppColors.textSecondary,
                padding: const EdgeInsets.symmetric(vertical: 14), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
            child: const Text('← Back to Cart'),
          )),
        ] else
          SizedBox(width: double.infinity, child: ElevatedButton(
            onPressed: () => setState(() => _isCheckout = true),
            style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
            child: Text('Proceed to Checkout  ₹${CartManager.total.toStringAsFixed(0)}'),
          )),
      ]),
    ),
  ]);

  Widget _summaryRow(String label, String value, {bool isBold = false, bool isLarge = false, bool isGreen = false}) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 5),
    child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      Text(label, style: TextStyle(color: AppColors.textSecondary, fontSize: isLarge ? 15 : 13, fontWeight: isBold ? FontWeight.w700 : FontWeight.normal)),
      Text(value, style: TextStyle(
        color: isGreen ? AppColors.success : AppColors.textPrimary,
        fontSize: isLarge ? 17 : 13,
        fontWeight: isBold ? FontWeight.w800 : FontWeight.w600,
      )),
    ]),
  );
}
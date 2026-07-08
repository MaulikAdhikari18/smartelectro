import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../services/api_service.dart';

class RfqScreen extends StatefulWidget {
  const RfqScreen({super.key});
  @override
  State<RfqScreen> createState() => _RfqScreenState();
}

class _RfqScreenState extends State<RfqScreen> {
  int _step = 0;
  bool _loading = false;
  bool _submitted = false;

  final _productNameCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _quantityCtrl = TextEditingController();
  final _locationCtrl = TextEditingController();
  String _unit = 'Pieces';
  int? _selectedCategoryId;
  String? _selectedCategoryName;

  final List<Map<String, dynamic>> _categories = [
    {'id': 1, 'name': 'EV Chargers'},
    {'id': 2, 'name': 'Commercial Induction'},
    {'id': 3, 'name': 'Industrial Equipment'},
    {'id': 4, 'name': 'Solar & Renewable'},
    {'id': 5, 'name': 'Wiring & Components'},
    {'id': 6, 'name': 'Automation Systems'},
  ];

  final List<String> _units = ['Pieces', 'Units', 'Kg', 'Metres', 'Sets', 'Boxes'];
  final List<String> _steps = ['Product Details', 'Quantity & Delivery', 'Review'];

  Future<void> _submit() async {
    final loggedIn = await ApiService.isLoggedIn();
    if (!loggedIn) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please login to submit an RFQ'), backgroundColor: AppColors.error),
      );
      return;
    }
    setState(() => _loading = true);
    try {
      await ApiService.submitRfq(
        productName: _productNameCtrl.text.trim(),
        quantity: int.tryParse(_quantityCtrl.text) ?? 1,
        unit: _unit,
        deliveryLocation: _locationCtrl.text.trim(),
        description: _descCtrl.text.trim(),
        categoryId: _selectedCategoryId,
      );
      setState(() { _submitted = true; _loading = false; });
    } catch (_) {
      setState(() => _loading = false);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to submit. Please try again.'), backgroundColor: AppColors.error),
      );
    }
  }

  void _reset() {
    setState(() {
      _step = 0; _submitted = false;
      _productNameCtrl.clear(); _descCtrl.clear();
      _quantityCtrl.clear(); _locationCtrl.clear();
      _unit = 'Pieces'; _selectedCategoryId = null; _selectedCategoryName = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: AppBar(
        backgroundColor: AppColors.navy,
        title: const Text('Post Requirement'),
        automaticallyImplyLeading: false,
      ),
      body: _submitted ? _buildSuccess() : _buildForm(),
    );
  }

  Widget _buildSuccess() => Center(
    child: Padding(
      padding: const EdgeInsets.all(32),
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Container(width: 90, height: 90, decoration: BoxDecoration(gradient: AppColors.amberGradient, shape: BoxShape.circle),
            child: const Center(child: Text('✓', style: TextStyle(color: AppColors.navy, fontSize: 40, fontWeight: FontWeight.w900)))),
        const SizedBox(height: 24),
        const Text('RFQ Submitted!', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
        const SizedBox(height: 12),
        Text('Your requirement for "${_productNameCtrl.text}" has been sent to matching suppliers.',
            textAlign: TextAlign.center, style: const TextStyle(color: AppColors.textSecondary, fontSize: 15, height: 1.5)),
        const SizedBox(height: 8),
        const Text('You\'ll receive quotes within 24 hours.', textAlign: TextAlign.center,
            style: TextStyle(color: AppColors.textMuted, fontSize: 13)),
        const SizedBox(height: 40),
        SizedBox(width: double.infinity, child: ElevatedButton(onPressed: _reset, child: const Text('Post Another RFQ'))),
      ]),
    ),
  );

  Widget _buildForm() => SingleChildScrollView(
    padding: const EdgeInsets.all(16),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

      // Step indicator
      Row(children: List.generate(_steps.length, (i) {
        final done = i < _step;
        final active = i == _step;
        return Expanded(child: Row(children: [
          Column(children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 32, height: 32,
              decoration: BoxDecoration(
                gradient: done || active ? AppColors.amberGradient : null,
                color: done || active ? null : const Color(0xFFE2E8F0),
                shape: BoxShape.circle,
              ),
              child: Center(child: Text(done ? '✓' : '${i+1}',
                  style: TextStyle(color: done || active ? AppColors.navy : AppColors.textMuted, fontWeight: FontWeight.w800, fontSize: 13))),
            ),
            const SizedBox(height: 4),
            Text(_steps[i], style: TextStyle(fontSize: 9, color: active ? AppColors.amber : AppColors.textMuted, fontWeight: FontWeight.w600)),
          ]),
          if (i < _steps.length - 1) Expanded(child: Container(height: 2, margin: const EdgeInsets.only(bottom: 20),
              color: i < _step ? AppColors.amber : const Color(0xFFE2E8F0))),
        ]));
      })),
      const SizedBox(height: 20),

      // Step content card
      Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8)]),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

          // Step 0
          if (_step == 0) ...[
            const Text('What do you need?', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
            const SizedBox(height: 20),
            _label('Product Name *'),
            TextField(controller: _productNameCtrl,
              decoration: const InputDecoration(hintText: 'e.g. 22kW AC EV Charger', fillColor: Color(0xFFF8FAFC),
                enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12)), borderSide: BorderSide(color: Color(0xFFE2E8F0))),
                focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12)), borderSide: BorderSide(color: AppColors.amber, width: 2)),
              ),
              style: const TextStyle(color: AppColors.textPrimary),
            ),
            const SizedBox(height: 16),
            _label('Category'),
            DropdownButtonFormField<int>(
              value: _selectedCategoryId,
              decoration: const InputDecoration(fillColor: Color(0xFFF8FAFC),
                enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12)), borderSide: BorderSide(color: Color(0xFFE2E8F0))),
                focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12)), borderSide: BorderSide(color: AppColors.amber, width: 2)),
              ),
              hint: const Text('Select category', style: TextStyle(color: AppColors.textMuted)),
              items: _categories.map((c) => DropdownMenuItem<int>(value: c['id'], child: Text(c['name']))).toList(),
              onChanged: (v) => setState(() { _selectedCategoryId = v; _selectedCategoryName = _categories.firstWhere((c) => c['id'] == v)['name']; }),
            ),
            const SizedBox(height: 16),
            _label('Describe Your Requirement'),
            TextField(controller: _descCtrl, maxLines: 4,
              decoration: const InputDecoration(hintText: 'Specifications, certifications, preferred brands...', fillColor: Color(0xFFF8FAFC),
                enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12)), borderSide: BorderSide(color: Color(0xFFE2E8F0))),
                focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12)), borderSide: BorderSide(color: AppColors.amber, width: 2)),
              ),
              style: const TextStyle(color: AppColors.textPrimary),
            ),
            const SizedBox(height: 24),
            SizedBox(width: double.infinity, child: ElevatedButton(
              onPressed: _productNameCtrl.text.isNotEmpty ? () => setState(() => _step = 1) : null,
              child: const Text('Next: Quantity & Delivery →'),
            )),
          ],

          // Step 1
          if (_step == 1) ...[
            const Text('Quantity & Delivery', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
            const SizedBox(height: 20),
            Row(children: [
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                _label('Quantity *'),
                TextField(controller: _quantityCtrl, keyboardType: TextInputType.number,
                  decoration: const InputDecoration(hintText: '100', fillColor: Color(0xFFF8FAFC),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12)), borderSide: BorderSide(color: Color(0xFFE2E8F0))),
                    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12)), borderSide: BorderSide(color: AppColors.amber, width: 2)),
                  ),
                  style: const TextStyle(color: AppColors.textPrimary),
                ),
              ])),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                _label('Unit'),
                DropdownButtonFormField<String>(
                  value: _unit,
                  decoration: const InputDecoration(fillColor: Color(0xFFF8FAFC),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12)), borderSide: BorderSide(color: Color(0xFFE2E8F0))),
                    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12)), borderSide: BorderSide(color: AppColors.amber, width: 2)),
                  ),
                  items: _units.map((u) => DropdownMenuItem(value: u, child: Text(u))).toList(),
                  onChanged: (v) => setState(() => _unit = v!),
                ),
              ])),
            ]),
            const SizedBox(height: 16),
            _label('Delivery Location *'),
            TextField(controller: _locationCtrl,
              decoration: const InputDecoration(hintText: 'Mumbai, Maharashtra', prefixIcon: Icon(Icons.location_on_outlined, color: AppColors.textMuted),
                fillColor: Color(0xFFF8FAFC),
                enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12)), borderSide: BorderSide(color: Color(0xFFE2E8F0))),
                focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12)), borderSide: BorderSide(color: AppColors.amber, width: 2)),
              ),
              style: const TextStyle(color: AppColors.textPrimary),
            ),
            const SizedBox(height: 24),
            Row(children: [
              Expanded(child: OutlinedButton(
                onPressed: () => setState(() => _step = 0),
                style: OutlinedButton.styleFrom(side: const BorderSide(color: Color(0xFFE2E8F0)), foregroundColor: AppColors.textSecondary,
                    padding: const EdgeInsets.symmetric(vertical: 14), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                child: const Text('← Back'),
              )),
              const SizedBox(width: 12),
              Expanded(child: ElevatedButton(
                onPressed: (_quantityCtrl.text.isNotEmpty && _locationCtrl.text.isNotEmpty) ? () => setState(() => _step = 2) : null,
                child: const Text('Review →'),
              )),
            ]),
          ],

          // Step 2
          if (_step == 2) ...[
            const Text('Review & Submit', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
            const SizedBox(height: 20),
            ...[
              ['Product', _productNameCtrl.text],
              ['Category', _selectedCategoryName ?? 'Not specified'],
              ['Quantity', '${_quantityCtrl.text} $_unit'],
              ['Location', _locationCtrl.text],
              if (_descCtrl.text.isNotEmpty) ['Description', _descCtrl.text],
            ].asMap().entries.map((e) => Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(color: e.key % 2 == 0 ? AppColors.bgLight : Colors.white),
              child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                SizedBox(width: 90, child: Text(e.value[0], style: const TextStyle(color: AppColors.textMuted, fontSize: 13, fontWeight: FontWeight.w600))),
                Expanded(child: Text(e.value[1], style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w600))),
              ]),
            )).toList(),
            const SizedBox(height: 24),
            Row(children: [
              Expanded(child: OutlinedButton(
                onPressed: () => setState(() => _step = 1),
                style: OutlinedButton.styleFrom(side: const BorderSide(color: Color(0xFFE2E8F0)), foregroundColor: AppColors.textSecondary,
                    padding: const EdgeInsets.symmetric(vertical: 14), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                child: const Text('← Back'),
              )),
              const SizedBox(width: 12),
              Expanded(child: ElevatedButton(
                onPressed: _loading ? null : _submit,
                child: _loading
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: AppColors.navy, strokeWidth: 2))
                    : const Text('📩 Submit RFQ'),
              )),
            ]),
          ],
        ]),
      ),

      // Why RFQ sidebar
      const SizedBox(height: 16),
      Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: AppColors.navy, borderRadius: BorderRadius.circular(16)),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('Why Use RFQ?', style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w800)),
          const SizedBox(height: 12),
          ...['Get competitive pricing from multiple suppliers', 'No obligation to buy', 'Verified suppliers only', 'GST invoice guaranteed', 'Average response time: 4 hours'].map((t) =>
              Padding(padding: const EdgeInsets.symmetric(vertical: 4), child: Row(children: [
                const Text('⚡ ', style: TextStyle(fontSize: 14)),
                Expanded(child: Text(t, style: const TextStyle(color: AppColors.textMuted, fontSize: 13))),
              ])),
          ).toList(),
        ]),
      ),
    ]),
  );

  Widget _label(String text) => Padding(
    padding: const EdgeInsets.only(bottom: 8),
    child: Text(text, style: const TextStyle(color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.w600)),
  );
}
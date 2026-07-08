import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../services/api_service.dart';
import 'login_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _gstCtrl = TextEditingController();
  String _selectedRole = 'BUYER';
  bool _loading = false;
  String? _error;
  bool _obscurePassword = true;

  Future<void> _register() async {
    if (_nameCtrl.text.isEmpty || _emailCtrl.text.isEmpty || _passCtrl.text.isEmpty) {
      setState(() => _error = 'Please fill all required fields');
      return;
    }
    setState(() { _loading = true; _error = null; });
    try {
      await ApiService.register(
        name: _nameCtrl.text.trim(),
        email: _emailCtrl.text.trim(),
        password: _passCtrl.text,
        role: _selectedRole,
        phone: _phoneCtrl.text.trim(),
        gstNumber: _gstCtrl.text.trim(),
      );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Account created! Please login.'), backgroundColor: AppColors.success),
      );
      Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
    } catch (e) {
      setState(() { _error = 'Registration failed. Email may already be registered.'; _loading = false; });
    }
  }

  Widget _buildField(String label, TextEditingController ctrl, {TextInputType? type, bool obscure = false, String? hint, IconData? icon, bool required = true}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text('$label${required ? ' *' : ''}', style: const TextStyle(color: AppColors.textMuted, fontSize: 14, fontWeight: FontWeight.w600)),
      const SizedBox(height: 8),
      TextField(
        controller: ctrl,
        keyboardType: type,
        obscureText: obscure,
        style: const TextStyle(color: Colors.white),
        decoration: InputDecoration(
          hintText: hint,
          prefixIcon: icon != null ? Icon(icon, color: AppColors.textMuted) : null,
        ),
      ),
      const SizedBox(height: 16),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.navyGradient),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const SizedBox(height: 16),
              Row(children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
                  onPressed: () => Navigator.pop(context),
                ),
                RichText(text: const TextSpan(children: [
                  TextSpan(text: 'Smart', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900)),
                  TextSpan(text: 'Electro', style: TextStyle(color: AppColors.amber, fontSize: 20, fontWeight: FontWeight.w900)),
                ])),
              ]),
              const SizedBox(height: 24),
              const Text('Create Account', style: TextStyle(color: Colors.white, fontSize: 30, fontWeight: FontWeight.w800)),
              const SizedBox(height: 8),
              const Text('Join 25,000+ B2B buyers and suppliers', style: TextStyle(color: AppColors.textMuted, fontSize: 15)),
              const SizedBox(height: 28),

              // Role toggle
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(14)),
                child: Row(children: ['BUYER', 'SUPPLIER'].map((role) => Expanded(
                  child: GestureDetector(
                    onTap: () => setState(() => _selectedRole = role),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      decoration: BoxDecoration(
                        gradient: _selectedRole == role ? AppColors.amberGradient : null,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        role == 'BUYER' ? '🛒  I want to Buy' : '🏭  I want to Sell',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: _selectedRole == role ? AppColors.navy : AppColors.textMuted,
                          fontWeight: FontWeight.w700, fontSize: 14,
                        ),
                      ),
                    ),
                  ),
                )).toList()),
              ),
              const SizedBox(height: 24),

              if (_error != null) ...[
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(color: AppColors.errorLight, borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.error.withOpacity(0.3))),
                  child: Row(children: [
                    const Icon(Icons.warning_amber_rounded, color: AppColors.error, size: 18),
                    const SizedBox(width: 8),
                    Expanded(child: Text(_error!, style: const TextStyle(color: AppColors.error, fontSize: 13))),
                  ]),
                ),
                const SizedBox(height: 16),
              ],

              _buildField('Full Name', _nameCtrl, hint: 'Rajesh Kumar', icon: Icons.person_outline),
              _buildField('Email Address', _emailCtrl, type: TextInputType.emailAddress, hint: 'you@company.com', icon: Icons.email_outlined),
              _buildField('Phone Number', _phoneCtrl, type: TextInputType.phone, hint: '+91 98765 43210', icon: Icons.phone_outlined, required: false),
              _buildField('GST Number', _gstCtrl, hint: '22AAAAA0000A1Z5', icon: Icons.receipt_outlined, required: _selectedRole == 'SUPPLIER'),

              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Text('Password *', style: TextStyle(color: AppColors.textMuted, fontSize: 14, fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                TextField(
                  controller: _passCtrl,
                  obscureText: _obscurePassword,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Min 6 characters',
                    prefixIcon: const Icon(Icons.lock_outline, color: AppColors.textMuted),
                    suffixIcon: IconButton(
                      icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility, color: AppColors.textMuted),
                      onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                    ),
                  ),
                ),
              ]),
              const SizedBox(height: 28),

              SizedBox(width: double.infinity,
                child: ElevatedButton(
                  onPressed: _loading ? null : _register,
                  child: _loading
                      ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: AppColors.navy, strokeWidth: 2))
                      : Text('Create ${_selectedRole == 'BUYER' ? 'Buyer' : 'Seller'} Account →'),
                ),
              ),
              const SizedBox(height: 20),
              Center(child: GestureDetector(
                onTap: () => Navigator.pop(context),
                child: RichText(text: const TextSpan(children: [
                  TextSpan(text: 'Already have an account? ', style: TextStyle(color: AppColors.textMuted, fontSize: 14)),
                  TextSpan(text: 'Sign in', style: TextStyle(color: AppColors.amber, fontSize: 14, fontWeight: FontWeight.w700)),
                ])),
              )),
              const SizedBox(height: 24),
            ]),
          ),
        ),
      ),
    );
  }
}
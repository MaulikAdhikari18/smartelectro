import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../services/api_service.dart';
import 'home_screen.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  String _selectedRole = 'BUYER';
  bool _loading = false;
  String? _error;
  bool _obscurePassword = true;

  Future<void> _login() async {
    setState(() { _loading = true; _error = null; });
    try {
      final data = await ApiService.login(_emailCtrl.text.trim(), _passCtrl.text);
      final role = data['role'] as String;
      if (role != _selectedRole && role != 'ADMIN') {
        setState(() { _error = 'This account is a $role account. Please select the correct role.'; _loading = false; });
        return;
      }
      await ApiService.saveAuthData(data['token'], role, data['name'], data['userId']);
      if (!mounted) return;
      Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const HomeScreen()));
    } catch (e) {
      setState(() { _error = 'Invalid email or password'; _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.navyGradient),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 32),
                // Logo
                Row(children: [
                  Container(
                    width: 48, height: 48,
                    decoration: BoxDecoration(gradient: AppColors.amberGradient, borderRadius: BorderRadius.circular(12)),
                    child: const Center(child: Text('SE', style: TextStyle(color: AppColors.navy, fontWeight: FontWeight.w900, fontSize: 18))),
                  ),
                  const SizedBox(width: 12),
                  RichText(text: const TextSpan(children: [
                    TextSpan(text: 'Smart', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900)),
                    TextSpan(text: 'Electro', style: TextStyle(color: AppColors.amber, fontSize: 24, fontWeight: FontWeight.w900)),
                  ])),
                ]),
                const SizedBox(height: 40),
                const Text('Welcome back', style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w800)),
                const SizedBox(height: 8),
                const Text('Sign in to your B2B account', style: TextStyle(color: AppColors.textMuted, fontSize: 16)),
                const SizedBox(height: 32),

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
                          role == 'BUYER' ? '🛒  Login as Buyer' : '🏭  Login as Supplier',
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

                // Error
                if (_error != null) Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(color: AppColors.errorLight, borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.error.withOpacity(0.3))),
                  child: Row(children: [
                    const Icon(Icons.warning_amber_rounded, color: AppColors.error, size: 18),
                    const SizedBox(width: 8),
                    Expanded(child: Text(_error!, style: const TextStyle(color: AppColors.error, fontSize: 13))),
                  ]),
                ),
                if (_error != null) const SizedBox(height: 16),

                // Email
                const Text('Email Address', style: TextStyle(color: AppColors.textMuted, fontSize: 14, fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                TextField(
                  controller: _emailCtrl,
                  keyboardType: TextInputType.emailAddress,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(hintText: 'you@company.com', prefixIcon: Icon(Icons.email_outlined, color: AppColors.textMuted)),
                ),
                const SizedBox(height: 20),

                // Password
                const Text('Password', style: TextStyle(color: AppColors.textMuted, fontSize: 14, fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                TextField(
                  controller: _passCtrl,
                  obscureText: _obscurePassword,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: '••••••••',
                    prefixIcon: const Icon(Icons.lock_outline, color: AppColors.textMuted),
                    suffixIcon: IconButton(
                      icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility, color: AppColors.textMuted),
                      onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                    ),
                  ),
                ),
                const SizedBox(height: 32),

                // Login button
                SizedBox(width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _loading ? null : _login,
                    child: _loading
                        ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: AppColors.navy, strokeWidth: 2))
                        : Text('Sign in as ${_selectedRole == 'BUYER' ? 'Buyer' : 'Supplier'} →'),
                  ),
                ),
                const SizedBox(height: 24),

                // Register link
                Center(child: GestureDetector(
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterScreen())),
                  child: RichText(text: const TextSpan(children: [
                    TextSpan(text: "Don't have an account? ", style: TextStyle(color: AppColors.textMuted, fontSize: 14)),
                    TextSpan(text: 'Register free', style: TextStyle(color: AppColors.amber, fontSize: 14, fontWeight: FontWeight.w700)),
                  ])),
                )),
                const SizedBox(height: 32),
                const Center(child: Text('🔒 Secure login · GST Verified Platform', style: TextStyle(color: AppColors.textMuted, fontSize: 12))),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
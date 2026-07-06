import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  // Change this to your computer's IP address when testing on physical device
  // For emulator use: 10.0.2.2 (Android) or localhost (iOS simulator)
  static const String baseUrl = 'http://10.0.2.2:8080/api';

  // Get stored JWT token
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  // Save token and user info after login
  static Future<void> saveAuthData(String token, String role, String name, int userId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
    await prefs.setString('userRole', role);
    await prefs.setString('userName', name);
    await prefs.setInt('userId', userId);
  }

  // Clear auth data on logout
  static Future<void> clearAuthData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('userRole');
    await prefs.remove('userName');
    await prefs.remove('userId');
  }

  // Check if user is logged in
  static Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  // Get user role
  static Future<String?> getUserRole() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('userRole');
  }

  // Get user name
  static Future<String?> getUserName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('userName');
  }

  // Build headers with optional auth
  static Future<Map<String, String>> _headers({bool auth = true}) async {
    final headers = {'Content-Type': 'application/json'};
    if (auth) {
      final token = await getToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }
    return headers;
  }

  // ── Auth APIs ──────────────────────────────────────────

  static Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: await _headers(auth: false),
      body: jsonEncode({'email': email, 'password': password}),
    );
    if (res.statusCode == 200) return jsonDecode(res.body);
    throw Exception(res.body);
  }

  static Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
    required String role,
    String? phone,
    String? gstNumber,
  }) async {
    final res = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: await _headers(auth: false),
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
        'role': role,
        'phone': phone,
        'gstNumber': gstNumber,
      }),
    );
    if (res.statusCode == 200) return jsonDecode(res.body);
    throw Exception(res.body);
  }

  // ── Product APIs ──────────────────────────────────────

  static Future<List<dynamic>> getProducts({String? search, int? categoryId}) async {
    String url = '$baseUrl/products';
    final params = <String, String>{};
    if (search != null && search.isNotEmpty) params['search'] = search;
    if (categoryId != null) params['categoryId'] = categoryId.toString();
    if (params.isNotEmpty) {
      url += '?${params.entries.map((e) => '${e.key}=${e.value}').join('&')}';
    }
    final res = await http.get(Uri.parse(url), headers: await _headers(auth: false));
    if (res.statusCode == 200) return jsonDecode(res.body);
    throw Exception('Failed to load products');
  }

  static Future<Map<String, dynamic>> getProduct(int id) async {
    final res = await http.get(
      Uri.parse('$baseUrl/products/$id'),
      headers: await _headers(auth: false),
    );
    if (res.statusCode == 200) return jsonDecode(res.body);
    throw Exception('Product not found');
  }

  static Future<List<dynamic>> getFeaturedProducts() async {
    final res = await http.get(
      Uri.parse('$baseUrl/products/featured'),
      headers: await _headers(auth: false),
    );
    if (res.statusCode == 200) return jsonDecode(res.body);
    return [];
  }

  // ── Category APIs ─────────────────────────────────────

  static Future<List<dynamic>> getCategories() async {
    final res = await http.get(
      Uri.parse('$baseUrl/categories'),
      headers: await _headers(auth: false),
    );
    if (res.statusCode == 200) return jsonDecode(res.body);
    return [];
  }

  // ── RFQ APIs ──────────────────────────────────────────

  static Future<void> submitRfq({
    required String productName,
    required int quantity,
    required String unit,
    required String deliveryLocation,
    String? description,
    String? deliveryDeadline,
    int? categoryId,
  }) async {
    final res = await http.post(
      Uri.parse('$baseUrl/rfq'),
      headers: await _headers(),
      body: jsonEncode({
        'productName': productName,
        'quantity': quantity,
        'unit': unit,
        'deliveryLocation': deliveryLocation,
        'description': description,
        'deliveryDeadline': deliveryDeadline,
        if (categoryId != null) 'category': {'id': categoryId},
      }),
    );
    if (res.statusCode != 200) throw Exception('Failed to submit RFQ');
  }

  // ── Supplier APIs ─────────────────────────────────────

  static Future<List<dynamic>> getSuppliers() async {
    final res = await http.get(
      Uri.parse('$baseUrl/suppliers'),
      headers: await _headers(auth: false),
    );
    if (res.statusCode == 200) return jsonDecode(res.body);
    return [];
  }
}
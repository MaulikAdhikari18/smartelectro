package com.smartelectro.controller;

import com.smartelectro.model.Product;
import com.smartelectro.model.RfqRequest;
import com.smartelectro.model.User;
import com.smartelectro.repository.ProductRepository;
import com.smartelectro.repository.RfqRepository;
import com.smartelectro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final RfqRepository rfqRepository;

    // Dashboard stats
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalProducts", productRepository.count());
        stats.put("totalRfqs", rfqRepository.count());
        stats.put("totalBuyers", userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.BUYER).count());
        stats.put("totalSuppliers", userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.SUPPLIER).count());
        stats.put("activeProducts", productRepository.findAll().stream()
                .filter(Product::isActive).count());
        stats.put("openRfqs", rfqRepository.findByStatus(RfqRequest.RfqStatus.OPEN).size());
        return ResponseEntity.ok(stats);
    }

    // Users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}/toggle")
    public ResponseEntity<String> toggleUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(!user.isActive());
        userRepository.save(user);
        return ResponseEntity.ok(user.isActive() ? "User activated" : "User deactivated");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted");
    }

    // Products
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    @PutMapping("/products/{id}/toggle")
    public ResponseEntity<String> toggleProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setActive(!product.isActive());
        productRepository.save(product);
        return ResponseEntity.ok(product.isActive() ? "Product activated" : "Product deactivated");
    }

    @PutMapping("/products/{id}/feature")
    public ResponseEntity<String> toggleFeature(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setFeaturedProduct(!product.isFeaturedProduct());
        productRepository.save(product);
        return ResponseEntity.ok(product.isFeaturedProduct() ? "Product featured" : "Product unfeatured");
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.ok("Product deleted");
    }

    // RFQs
    @GetMapping("/rfqs")
    public ResponseEntity<List<RfqRequest>> getAllRfqs() {
        return ResponseEntity.ok(rfqRepository.findAll());
    }
}
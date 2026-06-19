package com.smartelectro.service;

import com.smartelectro.model.Product;
import com.smartelectro.model.Supplier;
import com.smartelectro.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final SupplierService supplierService;

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public List<Product> getFeatured() {
        return productRepository.findByFeaturedProductTrue();
    }

    public List<Product> getByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> getBySupplier(Long supplierId) {
        return productRepository.findBySupplierId(supplierId);
    }

    public List<Product> search(String keyword) {
        return productRepository.searchByKeyword(keyword);
    }

    public List<Product> filter(Long categoryId, Long supplierId) {
        return productRepository.filterProducts(categoryId, supplierId);
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product create(Product product) {
        // Auto-link to the logged-in supplier
        try {
            Supplier supplier = supplierService.getCurrentSupplier();
            product.setSupplier(supplier);
        } catch (Exception ignored) {}
        product.setActive(true);
        return productRepository.save(product);
    }

    public Product update(Long id, Product updated) {
        Product existing = getById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setBasePrice(updated.getBasePrice());
        existing.setMoq(updated.getMoq());
        existing.setDeliveryTimeline(updated.getDeliveryTimeline());
        existing.setBrand(updated.getBrand());
        existing.setImages(updated.getImages());
        existing.setSpecsJson(updated.getSpecsJson());
        existing.setCertifications(updated.getCertifications());
        existing.setFeaturedProduct(updated.isFeaturedProduct());
        return productRepository.save(existing);
    }

    public void delete(Long id) {
        Product p = getById(id);
        p.setActive(false);
        productRepository.save(p);
    }
}
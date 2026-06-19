package com.smartelectro.service;

import com.smartelectro.model.Supplier;
import com.smartelectro.model.User;
import com.smartelectro.repository.SupplierRepository;
import com.smartelectro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;

    public Supplier getCurrentSupplier() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return supplierRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    // Auto-create supplier profile if not exists
                    Supplier supplier = Supplier.builder()
                            .user(user)
                            .companyName(user.getName() + "'s Store")
                            .location("India")
                            .gstNumber(user.getGstNumber())
                            .rating(0.0)
                            .totalReviews(0)
                            .build();
                    return supplierRepository.save(supplier);
                });
    }

    public List<Supplier> getAll() {
        return supplierRepository.findAll();
    }

    public Supplier getById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
    }
}
package com.smartelectro.service;

import com.smartelectro.model.Category;
import com.smartelectro.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllTopLevel() {
        return categoryRepository.findByParentIsNull();
    }

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public Category getById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    public Category create(Category category) {
        return categoryRepository.save(category);
    }

    public void seedCategories() {
        if (categoryRepository.count() > 0) return;

        String[][] cats = {
            {"EV Chargers", "ev-chargers", "Electric Vehicle charging solutions"},
            {"Commercial Induction", "commercial-induction", "Industrial induction cooking systems"},
            {"Industrial Equipment", "industrial-equipment", "Heavy duty electrical equipment"},
            {"Solar & Renewable", "solar-renewable", "Solar panels and renewable energy products"},
            {"Wiring & Components", "wiring-components", "Cables, wires and electrical components"},
            {"Automation Systems", "automation-systems", "Industrial automation and control systems"}
        };

        for (String[] c : cats) {
            categoryRepository.save(Category.builder()
                    .name(c[0]).slug(c[1]).description(c[2]).build());
        }
    }
}

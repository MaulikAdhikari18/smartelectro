package com.smartelectro.repository;

import com.smartelectro.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByParentIsNull();
    Optional<Category> findBySlug(String slug);
}
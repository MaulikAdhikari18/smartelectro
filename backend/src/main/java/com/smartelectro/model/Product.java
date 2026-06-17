package com.smartelectro.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    private BigDecimal basePrice; // fallback price

    private Integer moq = 1; // Minimum Order Quantity

    private String deliveryTimeline; // e.g. "5-7 days"

    private String brand;

    @ElementCollection
    private List<String> images; // list of image URLs

    private String videoUrl;

    // Specs stored as JSON string for flexibility
    @Column(columnDefinition = "TEXT")
    private String specsJson;

    @ElementCollection
    private List<String> certifications;

    private boolean active = true;

    private boolean featuredProduct = false;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<PriceTier> priceTiers;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

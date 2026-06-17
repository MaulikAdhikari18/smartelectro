package com.smartelectro.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "price_tiers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceTier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private Integer minQty;  // e.g. 1
    private Integer maxQty;  // e.g. 10  (null means "and above")
    private BigDecimal price; // e.g. 500.00
}

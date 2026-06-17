package com.smartelectro.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rfq_quotes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RfqQuote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "rfq_request_id", nullable = false)
    private RfqRequest rfqRequest;

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    private BigDecimal pricePerUnit;
    private Integer deliveryDays;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Enumerated(EnumType.STRING)
    private QuoteStatus status;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        status = QuoteStatus.PENDING;
    }

    public enum QuoteStatus {
        PENDING, ACCEPTED, REJECTED
    }
}

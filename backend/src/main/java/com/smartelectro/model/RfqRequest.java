package com.smartelectro.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "rfq_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RfqRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false)
    private String productName;

    private Integer quantity;

    private String unit; // pieces, kg, metres etc.

    @Column(columnDefinition = "TEXT")
    private String description;

    private String deliveryLocation;

    private LocalDate deliveryDeadline;

    private String specFileUrl; // uploaded PDF/image

    @Enumerated(EnumType.STRING)
    private RfqStatus status; // OPEN, CLOSED, FULFILLED

    @OneToMany(mappedBy = "rfqRequest", cascade = CascadeType.ALL)
    private List<RfqQuote> quotes;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        status = RfqStatus.OPEN;
    }

    public enum RfqStatus {
        OPEN, CLOSED, FULFILLED
    }
}

package com.smartelectro.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "suppliers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String companyName;

    private String companyLogo;

    private String location;

    private String description;

    private String gstNumber;

    private boolean gstVerified = false;

    private boolean isoVerified = false;

    private Double rating = 0.0;

    private Integer totalReviews = 0;

    @ElementCollection
    private List<String> certifications; // ISO, BIS, CE etc.

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

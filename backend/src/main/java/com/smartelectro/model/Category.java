package com.smartelectro.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    private String imageUrl;

    private String slug; // e.g. "ev-chargers"

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Category parent; // for sub-categories

    @OneToMany(mappedBy = "parent")
    private List<Category> children;
}

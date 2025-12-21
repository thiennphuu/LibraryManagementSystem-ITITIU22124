package com.example.Library.Management.ITITIU22124.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 255)
    private String author;

    @Column(nullable = false, unique = true, length = 50)
    private String isbn;

    @Column(length = 100)
    private String category;

    @Column(name = "published_year")
    private Integer publishedYear;

    @Column(name = "copies_total", nullable = false)
    private Integer copiesTotal;

    @Column(name = "copies_available", nullable = false)
    private Integer copiesAvailable;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}

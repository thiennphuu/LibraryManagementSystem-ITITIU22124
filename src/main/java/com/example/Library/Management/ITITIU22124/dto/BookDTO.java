package com.example.Library.Management.ITITIU22124.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDTO {
    private Long id;
    private String title;
    private String author;
    private String isbn;
    private String category;
    private Integer publishedYear;
    private Integer copiesTotal;
    private Integer copiesAvailable;
    private boolean available; // Computed: copiesAvailable > 0
}

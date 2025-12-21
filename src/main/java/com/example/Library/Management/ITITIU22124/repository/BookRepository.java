package com.example.Library.Management.ITITIU22124.repository;

import com.example.Library.Management.ITITIU22124.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrIsbnContainingIgnoreCase(String title,
            String author, String isbn);

    List<Book> findByTitleContaining(String title);

    Optional<Book> findByIsbn(String isbn);

    List<Book> findByAuthorContaining(String author);

    // Find books by category
    List<Book> findByCategory(String category);
}

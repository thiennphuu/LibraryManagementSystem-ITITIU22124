package com.example.Library.Management.ITITIU22124.mapper;

import com.example.Library.Management.ITITIU22124.dto.BookDTO;
import com.example.Library.Management.ITITIU22124.model.Book;
import org.springframework.stereotype.Component;

@Component
public class BookMapper {

    public BookDTO toDTO(Book book) {
        if (book == null) {
            return null;
        }

        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setIsbn(book.getIsbn());
        dto.setCategory(book.getCategory());
        dto.setPublishedYear(book.getPublishedYear());
        dto.setCopiesTotal(book.getCopiesTotal());
        dto.setCopiesAvailable(book.getCopiesAvailable());
        dto.setAvailable(book.getCopiesAvailable() != null && book.getCopiesAvailable() > 0);

        return dto;
    }

    public Book toEntity(BookDTO dto) {
        if (dto == null) {
            return null;
        }

        Book book = new Book();
        book.setId(dto.getId());
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setIsbn(dto.getIsbn());
        book.setCategory(dto.getCategory());
        book.setPublishedYear(dto.getPublishedYear());
        book.setCopiesTotal(dto.getCopiesTotal());
        book.setCopiesAvailable(dto.getCopiesAvailable());

        return book;
    }
}

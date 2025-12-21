package com.example.Library.Management.ITITIU22124.service;

import com.example.Library.Management.ITITIU22124.exception.BadRequestException;
import com.example.Library.Management.ITITIU22124.exception.NotFoundException;
import com.example.Library.Management.ITITIU22124.model.Book;
import com.example.Library.Management.ITITIU22124.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    public Book updateBook(Long id, Book bookDetails) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Book not found with id: " + id));
        book.setTitle(bookDetails.getTitle());
        book.setAuthor(bookDetails.getAuthor());
        book.setIsbn(bookDetails.getIsbn());
        book.setCopiesAvailable(bookDetails.getCopiesAvailable());
        book.setCopiesTotal(bookDetails.getCopiesTotal());
        return bookRepository.save(book);
    }

    public void borrowCopy(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NotFoundException("Book not found with id: " + bookId));
        if (book.getCopiesAvailable() <= 0) {
            throw new BadRequestException("No copies available for book with id: " + bookId);
        }
        book.setCopiesAvailable(book.getCopiesAvailable() - 1);
        bookRepository.save(book);
    }

    public void returnCopy(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NotFoundException("Book not found with id: " + bookId));
        book.setCopiesAvailable(book.getCopiesAvailable() + 1);
        bookRepository.save(book);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    public List<Book> searchBooks(String query) {
        return bookRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrIsbnContainingIgnoreCase(
                query, query, query);
    }
}

package com.booknestfresh.booknest_backend_fresh.repository;

import com.booknestfresh.booknest_backend_fresh.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Integer> {
}
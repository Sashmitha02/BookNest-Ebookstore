package com.booknestfresh.booknest_backend_fresh.repository;

import com.booknestfresh.booknest_backend_fresh.entity.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<CustomerOrder, Integer> {
}


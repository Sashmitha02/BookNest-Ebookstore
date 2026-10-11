package com.booknestfresh.booknest_backend_fresh.controller;

import com.booknestfresh.booknest_backend_fresh.entity.CustomerOrder;
import com.booknestfresh.booknest_backend_fresh.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public List<CustomerOrder> getAllOrders() {
        return orderRepository.findAll();
    }

    @PostMapping
    public CustomerOrder placeOrder(@RequestBody CustomerOrder order) {
        order.setStatus("CONFIRMED");
        return orderRepository.save(order);
    }
}


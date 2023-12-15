package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IProductRepository extends IBaseReporitory<Product, Long> {
    @Query("SELECT pro FROM Product pro WHERE pro.name = ?1 and pro.deleted = false")
    Optional<Product> findByName(String name);

    @Query("SELECT pro FROM Product pro WHERE pro.id = ?1 and pro.deleted = false")
    Optional<Product> findProductDetailsById(Long id);

}

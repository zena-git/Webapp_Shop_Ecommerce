package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Brand;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IBrandRepository extends IBaseReporitory<Brand, Long> {
    @Query("SELECT b FROM Brand b WHERE b.name = ?1 and b.deleted = false")
    Optional<Brand> findByName(String name);
}

package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Style;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IStyleRepository extends IBaseReporitory<Style, Long> {
    @Query("SELECT b FROM Style b WHERE b.name = ?1 and b.deleted = false")
    Optional<Style> findByName(String name);
}

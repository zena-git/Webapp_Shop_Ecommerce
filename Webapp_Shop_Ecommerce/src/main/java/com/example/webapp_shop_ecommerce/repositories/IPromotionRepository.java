package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Promotion;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IPromotionRepository extends IBaseReporitory<Promotion, Long> {
    @Query("SELECT b FROM Promotion b WHERE b.name = ?1 and b.deleted = false")
    Optional<Promotion> findByName(String name);
}

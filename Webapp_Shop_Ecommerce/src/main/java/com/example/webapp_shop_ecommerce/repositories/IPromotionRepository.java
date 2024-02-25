package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.Optional;

@Repository
public interface IPromotionRepository extends IBaseReporitory<Promotion, Long> {
    @Query("SELECT b FROM Promotion b WHERE b.name = ?1 and b.deleted = false")
    Optional<Promotion> findByName(String name);

    @Query("SELECT p FROM Promotion p WHERE p.name like %:#{#keyWork['search']}% and p.status like %:#{#keyWork['status']}% and p.deleted = false")
    Page<Promotion> findPromotionByKeyWorkAndDeletedFalse(Pageable pageable, @Param("keyWork") Map<String,String> keyWork);


}

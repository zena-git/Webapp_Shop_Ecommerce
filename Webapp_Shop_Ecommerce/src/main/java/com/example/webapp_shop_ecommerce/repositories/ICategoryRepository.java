package com.example.webapp_shop_ecommerce.repositories;

import com.example.backend_web_truong_huong.entity.Category;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ICategoryRepository extends IBaseReporitory<Category, Long> {
    @Query("SELECT ctg FROM Category ctg WHERE ctg.name = ?1 and ctg.deleted = false")
    Optional<Category> findByName(String name);
}

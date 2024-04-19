package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Size;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ISizeRepository extends IBaseReporitory<Size, Long> {
    @Query("SELECT b FROM Size b WHERE b.name = ?1 and b.deleted = false")
    Optional<Size> findByName(String name);
}

package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Color;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IColorRepository extends IBaseReporitory<Color, Long> {
    @Query("SELECT b FROM Color b WHERE b.name = ?1 and b.deleted = false")
    Optional<Color> findByName(String name);


}

package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Material;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IMaterialRepository extends IBaseReporitory<Material, Long>{
    @Query("SELECT e FROM Material e WHERE e.name = ?1 and e.deleted = false")
    Optional<Material> findByName(String name);

    boolean existsBrandByName(String name);
}

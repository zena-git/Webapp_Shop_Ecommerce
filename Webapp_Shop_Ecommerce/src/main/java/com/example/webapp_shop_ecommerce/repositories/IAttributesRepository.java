package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Attributes;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IAttributesRepository extends IBaseReporitory<Attributes, Long> {
    @Query("SELECT att FROM Attributes att WHERE att.name = ?1 and att.deleted = false")
    Optional<Attributes> findByName(String name);
}

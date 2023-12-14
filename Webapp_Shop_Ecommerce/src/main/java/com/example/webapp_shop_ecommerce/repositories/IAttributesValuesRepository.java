package com.example.webapp_shop_ecommerce.repositories;

import com.example.backend_web_truong_huong.entity.AttributesValues;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IAttributesValuesRepository extends IBaseReporitory<AttributesValues, Long>{
    @Query("SELECT att FROM AttributesValues att WHERE att.name = ?1 and att.deleted = false")
    Optional<AttributesValues> findAllByName(String name);


}

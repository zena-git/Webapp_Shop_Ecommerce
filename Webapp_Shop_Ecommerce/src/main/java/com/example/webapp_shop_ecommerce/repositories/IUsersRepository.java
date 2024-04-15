package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Promotion;
import com.example.webapp_shop_ecommerce.entity.Users;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface IUsersRepository extends IBaseReporitory<Users, Long> {

    @Query("SELECT p FROM Users p WHERE  p.deleted = :type")
    List<Users> findAllByDeleted(@Param("type") Boolean type);

    @Transactional
    @Modifying
    @Query("UPDATE Users p SET p.deleted = false where p.id = :id")
    void updateRecover(@Param("id") Long id);
}

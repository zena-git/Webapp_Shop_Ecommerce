package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Voucher;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IVoucherRepository extends IBaseReporitory<Voucher, Long> {
    @Query("SELECT b FROM Voucher b WHERE b.name = ?1 and b.deleted = false")
    Optional<Voucher> findByName(String name);
}

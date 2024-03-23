package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Bill;
import com.example.webapp_shop_ecommerce.entity.HistoryBill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface IHistoryBillRepository extends IBaseReporitory<HistoryBill, Long> {

    @Query("Select b from HistoryBill b WHERE b.bill.id = ?1")
    List<HistoryBill> findByBillId(Long id);
}

package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.HistoryBill;
import com.example.webapp_shop_ecommerce.entity.VoucherDetails;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IHistoryBillRepository extends IBaseReporitory<HistoryBill, Long>{

    @Query("select vd from HistoryBill vd where vd.bill.id = :idBill")
    List<HistoryBill> findByIdBill(@Param("idBill") Long idBill);
}

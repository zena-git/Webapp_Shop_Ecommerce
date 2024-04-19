package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Promotion;
import com.example.webapp_shop_ecommerce.entity.Voucher;
import com.example.webapp_shop_ecommerce.entity.VoucherDetails;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface IVoucherDetailsRepository extends IBaseReporitory<VoucherDetails, Long> {
    @Transactional
    @Modifying
    @Query("update VoucherDetails vd set vd.deleted = true where vd.voucher = :voucher")
    void deleteByVoucherTyleUpdate(@Param("voucher") Voucher voucher);

    @Transactional
    @Modifying
    @Query("update VoucherDetails vd set vd.deleted = true where vd.id = :id")
    void softDelete(@Param("id") Long id);

    @Query("select vd from VoucherDetails vd where vd.voucher.id = :idx")
    List<VoucherDetails> findByVoucherId(@Param("idx") Long idx);

    @Query("select vd from VoucherDetails vd where vd.bill.id = :idBill")
    List<VoucherDetails> findByIdBill(@Param("idBill") Long idBill);

    @Query("select vd from VoucherDetails vd join vd.voucher v where v.deleted = false and vd.deleted = false and vd.status = false and v.status = :status and vd.customer.id = :idCustomer")
    List<VoucherDetails> findAllByIdCustomer(@Param("idCustomer") Long idCustomer,@Param("status") String status);

    @Query("select vd from VoucherDetails vd join vd.voucher v where v.deleted = false and vd.deleted = false and vd.customer.id = :idCustomer")
    VoucherDetails findByIdCustomer(@Param("idCustomer") Long idCustomer);

    @Modifying
    @Transactional
    @Query("UPDATE VoucherDetails p SET p.deleted = false WHERE p.id =:id")
    void updateDeletedFalseById(@Param("id") Long id);
}

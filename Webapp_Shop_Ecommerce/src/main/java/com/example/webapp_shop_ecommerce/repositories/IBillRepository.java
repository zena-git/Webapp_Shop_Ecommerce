package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Bill;
import com.example.webapp_shop_ecommerce.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IBillRepository extends IBaseReporitory<Bill, Long> {
    List<Bill> findBillByCustomer(Customer customer);
    @Query("select b from Bill b where b.billType = ?1 and b.status = ?2  and b.deleted = false")
    List<Bill> findAllTypeAndStatus(String type, String status);

    @Query("SELECT COALESCE(COUNT(b), 0) FROM Bill b WHERE b.billType = :type AND b.status = :status and b.deleted = false GROUP BY b.billType, b.status ")
    Integer countBillsByTypeAndStatus(@Param("type") String type, @Param("status") String status);

    @Query("SELECT b FROM Bill b WHERE b.status like %:status% AND b.status != :statusNot AND b.deleted = false order by b.createdDate desc ")
    Page<Bill> findAllDeletedFalseAndStatusAndStatusNot(Pageable page, @Param("status") String status, @Param("statusNot") String statusNot);

}

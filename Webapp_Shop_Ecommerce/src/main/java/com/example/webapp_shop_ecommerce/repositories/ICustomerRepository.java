package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface ICustomerRepository extends IBaseReporitory<Customer, Long> {
    @Query("select c from Customer c where (c.fullName like %:keyWord% or c.phone like %:keyWord%) and c.deleted = false order by c.createdDate desc ")
    List<Customer> findByNameAndPhone(@Param("keyWord") String keyWord);

    @Query("select c from Customer c where month(c.createdDate) = :month and c.deleted = false order by c.createdDate desc")
    List<Customer> findAllCustomerCreated (@Param("month") Integer month);

    @Query("select c from Customer c join fetch  c.lstBill bill where month(bill.lastModifiedDate) = :month and bill.status like %:status% and c.deleted = false order by c.createdDate desc ")
    List<Customer> findAllCustomersWithInvoiceCreated (@Param("month") Integer month, @Param("status") String status);

}

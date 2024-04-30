package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

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

    @Query("select c from Customer c join fetch c.lstAddress ad where c.id = :id and c.deleted = false and ad.deleted = false")
    Optional<Customer> findCustomerByIdAndAddressNotDeleted (@Param("id") Long id);

    @Query("select c from Customer c join fetch c.lstAddress ad where c.phone = :phone and c.deleted = false and ad.deleted = false")
    Optional<Customer> findCustomerByPhone (@Param("phone") String phone);

    @Query("select c from Customer c join fetch c.lstAddress ad where c.email = :email and c.deleted = false and ad.deleted = false")
    Optional<Customer> findCustomerByEmail (@Param("email") String email);

    @Query("update Customer c SET c.password = :newPassword where c.id = :id")
    void updateCustomerPassword(@Param("id") Long id, @Param("newPassword") String newPassword);

    @Query("SELECT p FROM Customer p WHERE  p.deleted = :type")
    List<Customer> findAllCustomerByDeleted(@Param("type") Boolean type);

    @Query("SELECT b FROM Customer b WHERE b.id = :id and b.deleted = true")
    Optional<Customer> findByIdDeleted(@Param("id") Long id);

    @Transactional
    @Modifying
    @Query("UPDATE Customer p SET p.deleted = false where p.id = :id")
    void updateRecover(@Param("id") Long id);
}

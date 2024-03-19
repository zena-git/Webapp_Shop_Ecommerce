package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ICustomerRepository extends IBaseReporitory<Customer, Long> {
    @Query("select c from Customer c where (c.fullName like %:keyWord% or c.phone like %:keyWord%) and c.deleted = false order by c.createdDate desc ")
    List<Customer> findByNameAndPhone(@Param("keyWord") String keyWord);
}

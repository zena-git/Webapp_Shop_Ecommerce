package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Bill;
import com.example.webapp_shop_ecommerce.entity.BillDetails;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IBillDetailsRepository extends IBaseReporitory<BillDetails, Long> {

    Optional<BillDetails> findByProductDetails(ProductDetails productDetails);

    List<BillDetails> findAllByBill(Bill bill);
    @Query("SELECT bd FROM BillDetails bd WHERE bd.bill = :bill AND bd.productDetails = :productDetails")
    Optional<BillDetails> findByBillAndProductDetails(@Param("bill") Bill bill, @Param("productDetails") ProductDetails productDetails);
}

package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.dto.response.statistical.StatisticalReponse;
import com.example.webapp_shop_ecommerce.dto.response.statistical.TopSaleReponse;
import com.example.webapp_shop_ecommerce.entity.Bill;
import lombok.extern.java.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface IStatisticalRepository extends JpaRepository<Bill, Long> {
    @Query(value = "select Product.name, sum(BillDetails.quantity) as quantity, DATE(Bill.last_modified_date) AS 'time' from Bill join BillDetails on bill_id = Bill.id join ProductDetail on product_detail_id = ProductDetail.id join  Product on product_id = Product.id where Bill.status ='4'\n" +
            "group by Product.name, BillDetails.quantity,DATE(Bill.last_modified_date)",
    nativeQuery = true)
    List<TopSaleReponse> getAllTopSale();

    @Query(value = "select count(Bill.id) as completedOrders, sum(Bill.into_money) as revenue, DATE(Bill.last_modified_date) AS time from Bill join BillDetails on bill_id = Bill.id join ProductDetail on product_detail_id = ProductDetail.id join  Product on product_id = Product.id where Bill.status ='4'\n" +
            "group by DATE(Bill.last_modified_date)",
            nativeQuery = true)
    List<StatisticalReponse> getAllStatistical();
}

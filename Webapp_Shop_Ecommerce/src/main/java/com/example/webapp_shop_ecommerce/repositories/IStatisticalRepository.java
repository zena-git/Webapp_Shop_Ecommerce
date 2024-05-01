package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.dto.response.statistical.StaticalProductResponse;
import com.example.webapp_shop_ecommerce.dto.response.statistical.StatisticalReponse;
import com.example.webapp_shop_ecommerce.dto.response.statistical.Top5ProductSellingReponse;
import com.example.webapp_shop_ecommerce.dto.response.statistical.TopSaleReponse;
import com.example.webapp_shop_ecommerce.dto.response.statistical.ToppSaleResponse;
import com.example.webapp_shop_ecommerce.entity.Bill;
import lombok.extern.java.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
@Repository
public interface IStatisticalRepository extends JpaRepository<Bill, Long> {

    @Query(value = "select Product.name as name, sum(BillDetails.quantity) as quantity from Bill join BillDetails on bill_id = Bill.id join ProductDetail on product_detail_id = ProductDetail.id join  Product on product_id = Product.id " +
            "where Bill.status ='4' AND Bill.last_modified_date BETWEEN :startDate AND :endDate " +
            "group by Product.name, BillDetails.quantity",
            nativeQuery = true)
    List<TopSaleReponse> getTopSaleDay(@Param("startDate") LocalDateTime  startDate, @Param("endDate") LocalDateTime endDate);


    @Query(value = "select count(Bill.id) as completedOrders, sum(Bill.into_money) as revenue, 1 as time from Bill where Bill.status ='4' and Bill.last_modified_date between :startDate and :endDate",
            nativeQuery = true)
    StatisticalReponse getAllStatistical(@Param("startDate") LocalDateTime  startDate, @Param("endDate") LocalDateTime endDate);

    @Query(value = "SELECT product.image_url AS 'imageUrl', product.name , SUM(billdetails.quantity) AS 'quantity'FROM product JOIN productdetail ON product.id = productdetail.product_id JOIN billdetails ON productdetail.id = billdetails.product_detail_id GROUP BY product.name, product.image_url ORDER BY quantity DESC LIMIT 5", nativeQuery = true)
    List<Top5ProductSellingReponse> getTop5ProductSelling();


    @Query(value = "SELECT COUNT(sub.completedOrders) AS completedOrders, SUM(sub.revenue) AS revenue " +
            "FROM (SELECT COUNT(Bill.id) AS completedOrders, SUM(Bill.into_money) AS revenue " +
            "FROM Bill " +
            "JOIN BillDetails ON bill_id = Bill.id " +
            "JOIN ProductDetail ON product_detail_id = ProductDetail.id " +
            "JOIN Product ON product_id = Product.id " +
            "WHERE Bill.status ='4' " +
            "AND Bill.last_modified_date >= DATE_SUB(NOW(), INTERVAL 30 DAY) " +
            "AND Bill.last_modified_date < NOW() " +
            "GROUP BY Bill.id) AS sub",
            nativeQuery = true)
    List<StatisticalReponse> getLastMonthStatistical();

    @Query(value = "SELECT COUNT(Bill.id) AS completedOrders, SUM(Bill.into_money) AS revenue " +
            "FROM Bill " +
            "JOIN BillDetails ON bill_id = Bill.id " +
            "JOIN ProductDetail ON product_detail_id = ProductDetail.id " +
            "JOIN Product ON product_id = Product.id " +
            "WHERE Bill.status ='4' " +
            "AND Bill.last_modified_date >= DATE_SUB(DATE_SUB(NOW(), INTERVAL 30 DAY), INTERVAL 30 DAY) " +
            "AND Bill.last_modified_date < DATE_SUB(NOW(), INTERVAL 30 DAY)",
            nativeQuery = true)
    List<StatisticalReponse> getBeforeLastMonthStatistical();


    @Query(value = "SELECT COUNT(Bill.id) AS completedOrders, SUM(Bill.into_money) AS revenue\n" +
            "    FROM Bill\n" +
            "    WHERE Bill.status ='4'\n" +
            "    AND WEEK(Bill.last_modified_date) = WEEK(NOW()) - 1",
            nativeQuery = true)
    List<StatisticalReponse> getLastWeekStatistical();


    @Query(value = "SELECT COUNT(Bill.id) AS completedOrders, SUM(Bill.into_money) AS revenue\n" +
            "    FROM Bill\n" +
            "    WHERE Bill.status ='4'\n" +
            "    AND WEEK(Bill.last_modified_date) = WEEK(NOW()) - 2",
            nativeQuery = true)
    List<StatisticalReponse> getBeforeLastWeekStatistical();
}

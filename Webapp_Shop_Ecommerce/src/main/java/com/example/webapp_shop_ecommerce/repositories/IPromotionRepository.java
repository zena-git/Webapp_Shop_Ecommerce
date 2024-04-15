package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Promotion;
import com.example.webapp_shop_ecommerce.entity.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface IPromotionRepository extends IBaseReporitory<Promotion, Long> {
    @Query("SELECT b FROM Promotion b WHERE b.name = ?1 and b.deleted = false")
    Optional<Promotion> findByName(String name);

    @Query("SELECT p FROM Promotion p WHERE p.name like %:#{#keyWork['search']}% and p.status like %:#{#keyWork['status']}% and p.deleted = false")
    Page<Promotion> findPromotionByKeyWorkAndDeletedFalse(Pageable pageable, @Param("keyWork") Map<String,String> keyWork);

    @Transactional
    @Modifying
    @Query("UPDATE Promotion p SET p.status = :newStatus WHERE p.startDate <= :now AND p.status = :oldStatus and p.deleted = false ")
    void updateStatusToDangDienRa(@Param("now") LocalDateTime now, @Param("oldStatus") String oldStatus, @Param("newStatus") String newStatus);

    @Transactional
    @Modifying
    @Query("UPDATE Promotion p SET p.status = :newStatus WHERE p.endDate <= :now AND p.status = :oldStatus and p.deleted = false ")
    void updateStatusToDaKetThuc(@Param("now") LocalDateTime now, @Param("oldStatus") String oldStatus, @Param("newStatus") String newStatus);

    @Query("SELECT p FROM Promotion p WHERE  p.deleted = :type")
    List<Promotion> findAllByDeleted(@Param("type") Boolean type);

    @Transactional
    @Modifying
    @Query("UPDATE Promotion p SET p.deleted = false where p.id = :id")
    void updateRecover(@Param("id") Long id);


}

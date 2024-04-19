package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import com.example.webapp_shop_ecommerce.entity.Promotion;
import com.example.webapp_shop_ecommerce.entity.PromotionDetails;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface IPromotionDetailsRepository extends IBaseReporitory<PromotionDetails, Long> {
    @Transactional
    @Modifying
    void deleteByPromotion(Promotion promotion);

    @Query("select pd from PromotionDetails pd where pd.deleted = false and pd.promotion.deleted = false and pd.promotion.status = '1' and pd.productDetails.id = :idProductDetails ORDER BY pd.lastModifiedDate DESC")
    Optional<PromotionDetails> findPromotionDetailsActiveProductDetail(@Param("idProductDetails") Long idProductDetails);


    @Query("select pd from PromotionDetails pd where pd.productDetails.id = :idProductDetails and pd.promotion.id = :idPromotion and pd.deleted = false")
    List<PromotionDetails> findPromotionDetailsByProductDetailAAndPromotion(@Param("idProductDetails") Long idProductDetails,@Param("idPromotion") Long idPromotion);
    @Modifying
    @Transactional
    @Query("UPDATE PromotionDetails p SET p.deleted = true WHERE p.productDetails.id NOT IN :ids")
    void updateDeletedFlagForNotInIds(@Param("ids") List<Long> ids);

    @Modifying
    @Transactional
    @Query("UPDATE PromotionDetails p SET p.deleted = false WHERE p.productDetails.id IN :ids")
    void updateDeletedFalseInIds(@Param("ids") List<Long> ids);

    @Modifying
    @Transactional
    @Query("UPDATE PromotionDetails p SET p.deleted = false WHERE p.id =:id")
    void updateDeletedFalseById(@Param("id") Long id);
}

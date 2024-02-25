package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Promotion;
import com.example.webapp_shop_ecommerce.entity.PromotionDetails;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface IPromotionDetailsRepository extends IBaseReporitory<PromotionDetails, Long> {
    @Transactional
    @Modifying
    void deleteByPromotion(Promotion promotion);
}

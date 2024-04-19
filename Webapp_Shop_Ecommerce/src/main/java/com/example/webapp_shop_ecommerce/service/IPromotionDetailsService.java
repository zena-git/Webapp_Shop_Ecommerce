package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import com.example.webapp_shop_ecommerce.entity.PromotionDetails;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface IPromotionDetailsService extends IBaseService<PromotionDetails, Long>{
    Optional<PromotionDetails> findPromotionDetailsActiveProductDetail(Long idProductDetails);

}

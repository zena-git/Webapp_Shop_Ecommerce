package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.dto.request.promotion.PromotionRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.Optional;

public interface IPromotionService extends IBaseService<Promotion, Long>{
    Page<Promotion> findPromotionByKeyWorkAndDeletedFalse(Pageable pageable,Map<String,String> keyWork);
    ResponseEntity<ResponseObject> save(PromotionRequest promotionRequest);
    ResponseEntity<ResponseObject> update(PromotionRequest promotionRequest, Long id);
    Optional<Promotion> findByIdAndPromotionDetails(Long id);


}

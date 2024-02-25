package com.example.webapp_shop_ecommerce.dto.request.promotion;

import com.example.webapp_shop_ecommerce.dto.request.promotionDetials.PromotionDetailsRequest;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class PromotionRequest {
    private String code;
    private String name;
    private String description;
    private Float value;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private List<Long> lstProductDetails;
}

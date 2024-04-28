package com.example.webapp_shop_ecommerce.dto.response.statistical;

import com.example.webapp_shop_ecommerce.dto.response.products.ProductResponse;
import org.hibernate.internal.util.StringHelper;

public interface Top5ProductSellingReponse {
    Integer getQuantity();
    String getName();
    String getImageUrl();
}

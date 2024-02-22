package com.example.webapp_shop_ecommerce.dto.request.products;

import com.example.webapp_shop_ecommerce.dto.request.productdetails.ProductDetailsRequest;
import com.example.webapp_shop_ecommerce.entity.Category;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ProductRequest {
    private Long id;
    private String code;
    private String imageUrl;
    private String name;
    private Long category;
    private String description;
    private Long brand;
    private Long material;
    private Long style;

    private List<ProductDetailsRequest> lstProductDetails;

}

package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.dto.request.productdetails.ProductDetailsRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import com.example.webapp_shop_ecommerce.infrastructure.converter.ProductDetailConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IProductDetailsService extends IBaseService<ProductDetails, Long> {

    Page<ProductDetails> findAllByProductToPage(Long productId, Pageable page);
    List<ProductDetails> findAllByProduct(Long productId);


    ResponseEntity<ResponseObject> saveAll(List<ProductDetailsRequest> lstProductDetails);

    ResponseEntity<ResponseObject> updateAll(List<ProductDetailsRequest> lstProductDetails);

    void updateProductDetailsByProductId(Long id);

}

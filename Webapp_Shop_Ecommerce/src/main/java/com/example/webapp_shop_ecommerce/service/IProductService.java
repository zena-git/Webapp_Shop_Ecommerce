package com.example.webapp_shop_ecommerce.service;


import com.example.webapp_shop_ecommerce.dto.request.products.ProductRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface IProductService extends IBaseService<Product, Long> {



    Optional<Product> findByName(String name);
    Optional<Product> findByProductDetailByIdProduct(Long idProduct);
    List<Product> findProductByName(String name);
    ResponseEntity<ResponseObject> saveOrUpdate(ProductRequest request,Long... idProduct);
//    Optional<Product> findByCodeProduct(String code);
    Page<Product> findProductsAndDetailsNotDeleted(Pageable pageable, Map<String,String> keyWork);
    Optional<Product> findProductByIdAndDetailsNotDeleted(Long id,Map<String,String> keyWork);

    ResponseEntity<Resource> generateBarcodes(@RequestParam("data") List<String> dataList) throws IOException;

    ResponseEntity<Resource> exportExcel(@RequestParam("data") List<String> dataList) throws IOException;
    ResponseEntity<ResponseObject> updateStatus(ProductRequest request,Long idProduct);
    Page<Product> findProductsDeleted(Pageable pageable);

    ResponseEntity<ResponseObject> productRecover(Long idProduct);
}

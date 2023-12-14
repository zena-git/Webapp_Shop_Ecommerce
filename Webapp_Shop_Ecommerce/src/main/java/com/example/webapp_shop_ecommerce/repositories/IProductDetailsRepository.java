package com.example.webapp_shop_ecommerce.repositories;

import com.example.backend_web_truong_huong.entity.ProductDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface IProductDetailsRepository extends IBaseReporitory<ProductDetails, Long> {
//    @Query(value = "SELECT * FROM dbo.ProductDetail WHERE product_id = ?1", nativeQuery = true)
//    List<ProductDetails> findAllByProduct(Long productId);
    @Query(value = "SELECT proDetail FROM ProductDetails proDetail where  proDetail.product.id = ?1")
    Page<ProductDetails> findAllByProduct(Long idPro, Pageable pageable);

}

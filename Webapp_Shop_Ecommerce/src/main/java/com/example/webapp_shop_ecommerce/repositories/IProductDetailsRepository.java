package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface IProductDetailsRepository extends IBaseReporitory<ProductDetails, Long> {
//    @Query(value = "SELECT * FROM dbo.ProductDetail WHERE product_id = ?1", nativeQuery = true)
//    List<ProductDetails> findAllByProduct(Long productId);
    @Query(value = "SELECT proDetail FROM ProductDetails proDetail where  proDetail.product.id = ?1")
    Page<ProductDetails> findAllByProductToPage(Long idPro, Pageable pageable);

    @Query(value = "SELECT proDetail FROM ProductDetails proDetail where  proDetail.product.id = ?1")
    List<ProductDetails> findAllByProduct(Long idPro);

    @Transactional
    @Modifying
    @Query("UPDATE ProductDetails pd SET pd.deleted = true WHERE pd.product.id = ?1")
    void updateProductDetailsByProductId(Long id);
}

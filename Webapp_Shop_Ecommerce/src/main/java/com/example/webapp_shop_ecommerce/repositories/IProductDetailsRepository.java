package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IProductDetailsRepository extends IBaseReporitory<ProductDetails, Long> {
//    @Query(value = "SELECT * FROM dbo.ProductDetail WHERE product_id = ?1", nativeQuery = true)
//    List<ProductDetails> findAllByProduct(Long productId);
    @Query(value = "SELECT proDetail FROM ProductDetails proDetail where  proDetail.product.id = ?1")
    Page<ProductDetails> findAllByProductToPage(Long idPro, Pageable pageable);

    @Query(value = "SELECT proDetail FROM ProductDetails proDetail where proDetail.product.id = ?1 and proDetail.deleted = false and proDetail.product.deleted = false and proDetail.product.status = '0'")
    Page<ProductDetails> findAllClientDeletedFalseAndStatusFalse(Long idPro,Pageable pageable);


    @Query(value = "SELECT proDetail FROM ProductDetails proDetail where  proDetail.product.id = ?1")
    List<ProductDetails> findAllByProduct(Long idPro);

    @Transactional
    @Modifying
    @Query("UPDATE ProductDetails pd SET pd.deleted = true WHERE pd.product.id = ?1")
    void deleteProductDetailsByProductId(Long id);

    @Modifying
    @Transactional
    @Query("UPDATE ProductDetails p SET p.deleted = true WHERE p.id NOT IN :ids and p.product.id = :id")
    void updateDeletedFlagForNotInIds(@Param("ids") List<Long> ids, @Param("id") Long idProduct);

    boolean existsByCode(String code);

    Optional<ProductDetails> findByBarcode(String bacode);

    @Query(value = "SELECT proDetail FROM ProductDetails proDetail where proDetail.product.deleted = false and proDetail.deleted = false and proDetail.product.status = '0' and proDetail.quantity >0 order by proDetail.lastModifiedDate desc ")
    Page<ProductDetails> findAllDeletedFalseAndStatusFalse(Pageable pageable);





    //conjob
    @Transactional
    @Modifying
    @Query("UPDATE ProductDetails p set p.promotionDetailsActive = null where p.promotionDetailsActive.promotion.status != :status")
    void updateProductDetailsPromotionActiveToNull( @Param("status") String status);

    @Transactional
    @Modifying
    @Query("UPDATE ProductDetails pd set pd.promotionDetailsActive = (SELECT pd2 FROM PromotionDetails pd2 WHERE pd2.productDetails.id = pd.id AND pd2.promotion.status = :status)")
    void updateProductDetailsToPromotionDetailsWherePromotionToDangDienRa( @Param("status") String status);

}

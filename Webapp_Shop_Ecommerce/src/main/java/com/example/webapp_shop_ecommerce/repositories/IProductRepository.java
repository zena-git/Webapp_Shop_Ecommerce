package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IProductRepository extends IBaseReporitory<Product, Long> {
    @Query("SELECT pro FROM Product pro WHERE pro.name = ?1 and pro.deleted = false")
    Optional<Product> findByName(String name);

    @Query("SELECT pro FROM Product pro WHERE pro.id = ?1 and pro.deleted = false")
    Optional<Product> findProductDetailsById(Long id);

    @Query("SELECT pro FROM Product pro WHERE pro.name LIKE %?1% and pro.deleted = false")
    List<Product> findProductByName(String name);

    @Query("SELECT p FROM Product p JOIN FETCH p.lstProductDetails pd WHERE pd.deleted = false")
    Page<Product> findProductsAndDetailsNotDeleted(Pageable pageable);
    @Query("SELECT pro FROM Product pro JOIN FETCH pro.lstProductDetails pd WHERE pro.id = ?1 and pro.deleted = false and pd.deleted = false")
    Optional<Product> findProductByIdAndDetailsNotDeleted(Long id);
}

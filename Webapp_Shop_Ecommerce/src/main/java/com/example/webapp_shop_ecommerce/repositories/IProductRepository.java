package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface IProductRepository extends IBaseReporitory<Product, Long> {
    @Query("SELECT pro FROM Product pro WHERE pro.name = ?1 and pro.deleted = false")
    Optional<Product> findByName(String name);

    @Query("SELECT pro FROM Product pro WHERE pro.id = ?1 and pro.deleted = false")
    Optional<Product> findProductDetailsById(Long id);

    @Query("SELECT pro FROM Product pro WHERE pro.name LIKE %?1% and pro.deleted = false")
    List<Product> findProductByName(String name);
    // SpEL (Spring Expression Language)
    @Query("SELECT p FROM Product p JOIN FETCH p.lstProductDetails pd WHERE p.name like %:#{#keyWork['search']}% and p.category.name like %:#{#keyWork['category']}% and p.material.name like %:#{#keyWork['material']}% and p.brand.name like %:#{#keyWork['brand']}% and p.style.name like %:#{#keyWork['style']}% and p.status like %:#{#keyWork['status']}% and p.deleted = false and pd.deleted = false")
    Page<Product> findProductsAndDetailsNotDeleted(Pageable pageable, @Param("keyWork") Map<String,String> keyWork);
    @Query("SELECT pro FROM Product pro LEFT JOIN FETCH pro.lstProductDetails pd WHERE pro.id = :id and pd.color.name like %:#{#keyWork['color']}% and pd.size.name like %:#{#keyWork['size']}% and pd.price BETWEEN :#{#keyWork['min']} and :#{#keyWork['max']} and pro.deleted = false and pd.deleted = false")
    Optional<Product> findProductByIdAndDetailsNotDeleted(@Param("id") Long id,@Param("keyWork") Map<String,String> keyWork);
    boolean existsByCode(String code);

}

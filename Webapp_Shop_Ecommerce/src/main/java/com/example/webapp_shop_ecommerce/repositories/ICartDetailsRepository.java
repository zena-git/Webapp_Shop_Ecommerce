package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.Cart;
import com.example.webapp_shop_ecommerce.entity.CartDetails;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface ICartDetailsRepository extends IBaseReporitory<CartDetails, Long> {
    Optional<CartDetails> findCartDetailsByCartAndProductDetails(Cart cart, ProductDetails productDetails);
    @Transactional
    @Modifying
    @Query("UPDATE CartDetails cd SET cd.quantity = ?1 WHERE cd.id = ?2")
    void updateQuantity(Integer quantity,Long id);

}

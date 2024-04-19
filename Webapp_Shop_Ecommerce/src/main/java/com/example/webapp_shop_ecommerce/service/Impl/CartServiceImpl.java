package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.request.cart.CartRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Cart;
import com.example.webapp_shop_ecommerce.entity.CartDetails;
import com.example.webapp_shop_ecommerce.entity.Customer;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import com.example.webapp_shop_ecommerce.infrastructure.security.Authentication;
import com.example.webapp_shop_ecommerce.repositories.ICartDetailsRepository;
import com.example.webapp_shop_ecommerce.repositories.ICartRepository;
import com.example.webapp_shop_ecommerce.repositories.IProductDetailsRepository;
import com.example.webapp_shop_ecommerce.service.ICartDetailsService;
import com.example.webapp_shop_ecommerce.service.ICartService;
import com.example.webapp_shop_ecommerce.service.IProductDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl extends BaseServiceImpl<Cart, Long, ICartRepository> implements ICartService {
    @Autowired
    private IProductDetailsService productDetailsService;
    @Autowired
    private IProductDetailsRepository productDetailsRepo;
    @Autowired
    private Authentication authentication;
    @Autowired
    private ICartRepository cartRepo;
    @Autowired
    private ICartDetailsRepository cartDetailsRepo;
    @Autowired
    private ICartDetailsService cartDetailsService;
    @Override
    public ResponseEntity<ResponseObject> addToCart(CartRequest cartRequest) {
        Customer customer = authentication.getCustomer();
        CartDetails cartDetail = new CartDetails();

        Optional<ProductDetails> productDetails = productDetailsRepo.findById(cartRequest.getProductDetail());
        if (productDetails.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("error", "Sản phẩm khong tồn tại", 1, cartRequest), HttpStatus.BAD_REQUEST);
        }

        if (productDetails.get().getQuantity() < cartRequest.getQuantity()) {
            return new ResponseEntity<>(new ResponseObject("error", "Số Lượng Sản Phẩm Trong Kho Không Đủ", 1, cartRequest), HttpStatus.BAD_REQUEST);
        }


        Optional<Cart> cart = cartRepo.findCartByCustomer(customer);
        if (cart.isEmpty()) {
            Cart newCart = new Cart();
            newCart.setCustomer(customer);
            newCart.setId(null);
            newCart.setDeleted(false);
            newCart.setCreatedBy("Admin");
            newCart.setCreatedDate(LocalDateTime.now());
            newCart.setLastModifiedDate(LocalDateTime.now());
            newCart.setLastModifiedBy("Admin");
           Cart cartNew =  cartRepo.save(newCart);
           cart = Optional.ofNullable(cartNew);
            System.out.println("Tao cart moi");
        }

        Optional<CartDetails> cartDetails = cartDetailsRepo.findCartDetailsByCartAndProductDetails(cart.get(),productDetails.get());

        if (cartDetails.isPresent()) {
            cartDetail = cartDetails.get();

            Integer quantity = cartDetail.getQuantity() + cartRequest.getQuantity();
            if (quantity > productDetails.get().getQuantity()) {
                return new ResponseEntity<>(new ResponseObject("error", "Số Lượng Sản Phẩm Trong Kho Không Đủ", 1, cartRequest), HttpStatus.BAD_REQUEST);
            }
            cartDetail.setQuantity(quantity);
            cartDetailsRepo.save(cartDetail);
            System.out.println("update CartDetails + don");
        }else {
            cartDetail.setQuantity(cartRequest.getQuantity());
            cartDetail.setCart(cart.get());
            cartDetail.setProductDetails(productDetails.get());
            cartDetailsService.createNew(cartDetail);
            System.out.println("inset CartDetails");

        }
        return new ResponseEntity<>(new ResponseObject("success", "Thêm giỏ hàng thành công", 0, cartRequest), HttpStatus.CREATED);

    }

    @Override
    public Cart findCartClient() {

        Customer customer = authentication.getCustomer();
        Optional<Cart> cart = cartRepo.findCartByCustomer(customer);
        if (cart.isPresent()) {
            return cart.get();
        }
        return null;
    }


}

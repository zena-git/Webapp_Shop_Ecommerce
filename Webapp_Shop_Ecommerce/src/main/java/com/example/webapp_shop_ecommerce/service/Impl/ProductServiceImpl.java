package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.request.productdetails.ProductDetailsRequest;
import com.example.webapp_shop_ecommerce.dto.request.products.ProductRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Product;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import com.example.webapp_shop_ecommerce.infrastructure.converter.ProductConverter;
import com.example.webapp_shop_ecommerce.repositories.IProductRepository;
import com.example.webapp_shop_ecommerce.service.IProductDetailsService;
import com.example.webapp_shop_ecommerce.service.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl extends BaseServiceImpl<Product, Long, IProductRepository> implements IProductService {

    @Autowired
    IProductDetailsService productDetailsService;
    @Autowired
    ProductConverter productConverter;
    @Autowired
    IProductRepository productRepo;


    @Override
    public Optional<Product> findByName(String name) {
        return repository.findByName(name);
    }

    @Override
    public Optional<Product> findByProductDetailByIdProduct(Long idProduct) {

        return repository.findProductDetailsById(idProduct);
    }

    @Override
    public List<Product> findProductByName(String name) {
        return repository.findProductByName(name);
    }

    @Override
    public ResponseEntity<ResponseObject> saveOrUpdate(ProductRequest request,Long... idProduct) {
        Product entity = new Product();
        if (entity != null && idProduct.length <= 0) {
            //create
            Optional<Product> otp = findByName(request.getName());
            if (otp.isPresent()) {
                return new ResponseEntity<>(new ResponseObject("Fail", "Tên sản phẩm đã tồn tại", 1, request), HttpStatus.BAD_REQUEST);
            }
            entity = productConverter.convertRequestToEntity(request);
            entity.setId(null);
            entity.setDeleted(false);
            entity.setCreatedBy("Admin");
            entity.setCreatedDate(LocalDateTime.now());
            entity.setLastModifiedBy("Admin");
            entity.setLastModifiedDate(LocalDateTime.now());
        }else {

            System.out.println("Update ID: " + idProduct[0]);
            Optional<Product> otp = productRepo.findById(idProduct[0]);
            if (otp.isEmpty()) {
                return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, request), HttpStatus.BAD_REQUEST);
            }
            entity = otp.orElse(null);
            entity = productConverter.convertRequestToEntity(request);
            entity.setId(idProduct[0]);
            entity.setLastModifiedBy("Admin");
            entity.setLastModifiedDate(LocalDateTime.now());
            entity.setDeleted(false);
        }
        Product product = productRepo.save(entity);
        if(product != null) {
            //Update thi xoa mem all detail dang co
            if (idProduct.length > 0) {
                productDetailsService.updateProductDetailsByProductId(idProduct[0]);
            }
            //Tạo product details new
            List<ProductDetailsRequest> lst = request.getLstProductDetails().stream()
                    .map(productDetailDto -> {
                        productDetailDto.setProduct(product.getId());
                        return productDetailDto;
                    })
                    .collect(Collectors.toList());
            System.out.println(lst);
            productDetailsService.saveAll(lst);
        }
        return new ResponseEntity<>(new ResponseObject("Success", "Thêm Mới Thành Công", 0, request), HttpStatus.CREATED);

    }

    @Override
    public Page<Product> findProductsAndDetailsNotDeleted(Pageable pageable) {
        return repository.findProductsAndDetailsNotDeleted(pageable);
    }

    @Override
    public Optional<Product> findProductByIdAndDetailsNotDeleted(Long id) {



        return repository.findProductByIdAndDetailsNotDeleted(id);
    }

//    @Override
//    public Optional<Product> findByCodeProduct(String code) {
//           return repository.findByCodeProduct(code);
//
//    }
}

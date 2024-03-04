package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.request.productdetails.ProductDetailsRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import com.example.webapp_shop_ecommerce.infrastructure.converter.ProductDetailConverter;
import com.example.webapp_shop_ecommerce.repositories.IProductDetailsRepository;
import com.example.webapp_shop_ecommerce.service.IProductDetailsService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductDetailsService extends BaseServiceImpl<ProductDetails, Long, IProductDetailsRepository> implements IProductDetailsService {
    @Autowired
    ProductDetailConverter productDetailConverter;
    @Autowired
    private ModelMapper mapper;
    @Override
    public Page<ProductDetails> findAllByProductToPage(Long productId, Pageable page) {
        return repository.findAllByProductToPage(productId, page);
    }

    @Override
    public List<ProductDetails> findAllByProduct(Long productId) {
        return repository.findAllByProduct(productId);
    }

    @Override
    public ResponseEntity<ResponseObject> saveAll(List<ProductDetailsRequest> lstProductDetails) {
        List<ProductDetails> lst = lstProductDetails.stream()
                .map(productDetailsDto -> {
                    ProductDetails entity = productDetailConverter.convertRequestToEntity(productDetailsDto);
                    if (entity != null) {
                        entity.setId(null);
                        entity.setDeleted(false);
                        entity.setCreatedBy("Admin");
                        entity.setCreatedDate(LocalDateTime.now());
                    }
                    return entity;
                })
                .filter(productDetailsDto -> productDetailsDto != null)
                .collect(Collectors.toList());
        if (lst.size() == 0) {
            return new ResponseEntity<>(new ResponseObject("Success", "Không Thể Thêm Item", 1, lst), HttpStatus.BAD_REQUEST);
        }
        Integer lstSize = repository.saveAll(lst).size();

        return new ResponseEntity<>(new ResponseObject("Success", "Thêm Mới Thành Công "+lstSize +"Item", 0, lst), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<ResponseObject> updateAll(List<ProductDetailsRequest> lstProductDetails) {

        List<ProductDetails> lst = lstProductDetails.stream()
                .map(
                        productDetailsDto -> {
                            ProductDetails entity = repository.findById(productDetailsDto.getId()).get();

                            entity = productDetailConverter.convertRequestToEntity(productDetailsDto);
                            if (entity != null) {
                                entity.setLastModifiedDate(LocalDateTime.now());
                                entity.setLastModifiedBy("Admin");
                                entity.setDeleted(false);
                                entity.setId(productDetailsDto.getId());
                            }
                            return entity;
                        }
                )
                .filter(entity ->  entity != null)
                .filter(entity ->  entity.getId() != null)
                .collect(Collectors.toList());

        Integer lstSize = repository.saveAll(lst).size();
        return new ResponseEntity<>(new ResponseObject("Success", "Update Thành Công "+ lstSize +" Item", 0, lst), HttpStatus.CREATED);

    }
}

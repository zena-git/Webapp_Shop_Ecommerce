package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.request.productdetails.ProductDetailsRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import com.example.webapp_shop_ecommerce.infrastructure.converter.ProductDetailConverter;
import com.example.webapp_shop_ecommerce.repositories.IProductDetailsRepository;
import com.example.webapp_shop_ecommerce.service.IProductDetailsService;
import com.example.webapp_shop_ecommerce.ultiltes.RandomCodeGenerator;
import com.example.webapp_shop_ecommerce.ultiltes.RandomStringGenerator;
import org.modelmapper.ModelMapper;
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
public class ProductDetailsService extends BaseServiceImpl<ProductDetails, Long, IProductDetailsRepository> implements IProductDetailsService {
    @Autowired
    ProductDetailConverter productDetailConverter;
    @Autowired
    private ModelMapper mapper;

    @Autowired
    RandomStringGenerator randomStringGenerator;

    @Autowired
    RandomCodeGenerator randomCodeGenerator;

    @Override
    public Page<ProductDetails> findAllByProductToPage(Long productId, Pageable page) {
        return repository.findAllByProductToPage(productId, page);
    }

    @Override
    public Page<ProductDetails> findAllClientDeletedFalseAndStatusFalse(Long productId, Pageable page) {
        return repository.findAllClientDeletedFalseAndStatusFalse(productId, page);
    }

    @Override
    public Page<ProductDetails> findAllDeletedFalseAndStatusFalse(Pageable page) {
        return repository.findAllDeletedFalseAndStatusFalse(page);
    }

    @Override
    public List<ProductDetails> findAllByProduct(Long productId) {
        return repository.findAllByProduct(productId);
    }

    @Override
    public Optional<ProductDetails> findByProductDetailWhereDeletedAndStatus(Long id, String status) {
        return repository.findByProductDetailWhereDeletedAndStatus(id, status);
    }

    @Override
    public ResponseEntity<ResponseObject> saveAll(List<ProductDetailsRequest> lstProductDetails) {
        List<ProductDetails> lst = lstProductDetails.stream()
                .filter(entity -> entity.getId() == null)
                .map(productDetailsDto -> {
                    System.out.println(productDetailsDto.getProduct());
                    ProductDetails entity = productDetailConverter.convertRequestToEntity(productDetailsDto);
                    if (entity != null) {
                        if (entity.getCode() != null) {
                            if (repository.existsByCode(entity.getCode())) {
                                entity.setCode("PDS" + randomStringGenerator.generateRandomString(6));
                            }
                        } else {
                            entity.setCode("PDS" + randomStringGenerator.generateRandomString(6));
                        }

                        entity.setId(null);
                        entity.setDeleted(false);
                        entity.setStatus("0");
                        entity.setCreatedBy("Admin");
                        entity.setCreatedDate(LocalDateTime.now());
                        entity.setLastModifiedDate(LocalDateTime.now());
                        entity.setLastModifiedBy("Admin");
                        entity.setBarcode( randomCodeGenerator.generateRandomBarcode());
                    }
                    return entity;
                })
                .filter(productDetailsDto -> productDetailsDto != null)
                .collect(Collectors.toList());
        if (lst.size() == 0) {
            System.out.println(lst);
            System.out.println("38922349982394--------------------");
            return new ResponseEntity<>(new ResponseObject("Success", "Không Thể Thêm Item", 1, lst), HttpStatus.BAD_REQUEST);
        }
        Integer lstSize = repository.saveAll(lst).size();


        return new ResponseEntity<>(new ResponseObject("Success", "Thêm Mới Thành Công " + lstSize + "Item", 0, lst), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<ResponseObject> updateAll(List<ProductDetailsRequest> lstProductDetails) {


        List<ProductDetails> lst = lstProductDetails.stream()
                .filter(entity -> entity.getId() != null)
                .map(
                        productDetailsDto -> {
                            ProductDetails entity = repository.findById(productDetailsDto.getId()).get();
                            ProductDetails productDetails = entity;
                            entity = productDetailConverter.convertRequestToEntity(productDetailsDto);

                            if (entity != null) {
                                entity.setPromotionDetailsActive(productDetails.getPromotionDetailsActive());
                                entity.setLastModifiedDate(LocalDateTime.now());
                                entity.setLastModifiedBy("Admin");
                                entity.setDeleted(productDetails.getDeleted());
                                entity.setStatus(productDetails.getStatus());
                                entity.setId(productDetailsDto.getId());
                            }
                            return entity;
                        }
                )
                .filter(entity -> entity != null)
                .collect(Collectors.toList());


        Long idProduct = lstProductDetails.get(0).getProduct();
        System.out.println(idProduct+"update delete");
        // Tìm ra danh sách các ProductDetails cần giữ lại
        List<Long> idProductDetailsToKeep = lstProductDetails.stream()
                .map(ProductDetailsRequest::getId)
                .collect(Collectors.toList());
        System.out.println( idProductDetailsToKeep +"idProductDetailsToKeep");
        if (idProductDetailsToKeep.get(0) == null) {
            System.out.println("xóa all productdetails");
            repository.deleteProductDetailsByProductId(idProduct);

        }else {
            // Cập nhật trạng thái deleted cho các ProductDetails không có trong lst
            repository.updateDeletedFlagForNotInIds(idProductDetailsToKeep, idProduct);
        }


        if (lst.size() == 0) {
            return new ResponseEntity<>(new ResponseObject("Success", "Không Thể Update Item", 1, lst), HttpStatus.BAD_REQUEST);
        }


        Integer lstSize = repository.saveAll(lst).size();
        return new ResponseEntity<>(new ResponseObject("Success", "Update Thành Công " + lstSize + " Item", 0, lst), HttpStatus.CREATED);

    }

    @Override
    public Optional<ProductDetails> findByBarCode(String barCode) {
        return repository.findByBarcode(barCode);
    }
}

package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.request.promotion.PromotionRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import com.example.webapp_shop_ecommerce.entity.Promotion;
import com.example.webapp_shop_ecommerce.entity.PromotionDetails;
import com.example.webapp_shop_ecommerce.repositories.IProductDetailsRepository;
import com.example.webapp_shop_ecommerce.repositories.IPromotionDetailsRepository;
import com.example.webapp_shop_ecommerce.repositories.IPromotionRepository;
import com.example.webapp_shop_ecommerce.service.IPromotionDetailsService;
import com.example.webapp_shop_ecommerce.service.IPromotionService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PromotionServiceImpl extends BaseServiceImpl<Promotion, Long, IPromotionRepository> implements IPromotionService {
    @Autowired
    private ModelMapper mapper;

    @Autowired
    private IPromotionDetailsService promotionDetailService;
    @Autowired
    private IProductDetailsRepository productDetailsRepo;
    @Autowired
    private IPromotionDetailsRepository promotionDetailsRepo;
    @Override
    public Page<Promotion> findPromotionByKeyWorkAndDeletedFalse(Pageable pageable, Map<String, String> keyWork) {
        return repository.findPromotionByKeyWorkAndDeletedFalse(pageable, keyWork);
    }

    @Override
    public ResponseEntity<ResponseObject> save(PromotionRequest promotionRequest) {
        Promotion entity = mapper.map(promotionRequest, Promotion.class);
        List<ProductDetails> lstProductDetails = productDetailsRepo.findAllById(promotionRequest.getLstProductDetails());
        entity.setId(null);
        entity.setDeleted(false);
        entity.setCreatedBy("Admin");
        entity.setCreatedDate(LocalDateTime.now());
        entity.setLastModifiedDate(LocalDateTime.now());
        entity.setLastModifiedBy("Admin");

        //check ngay start;
        if (true){
            entity.setStatus("0");
        }

        Promotion promotion = repository.save(entity);

        List<PromotionDetails> lstPromotionDetails = lstProductDetails.stream().map(
                productDetails -> {
                    PromotionDetails promotionDetails = new PromotionDetails();
                    promotionDetails.setPromotion(promotion);
                    promotionDetails.setProductDetails(productDetails);
                    promotionDetails.setId(null);
                    promotionDetails.setDeleted(false);
                    promotionDetails.setCreatedBy("Admin");
                    promotionDetails.setCreatedDate(LocalDateTime.now());
                    promotionDetails.setLastModifiedDate(LocalDateTime.now());
                    promotionDetails.setLastModifiedBy("Admin");

                    PromotionDetails promotionDetailsActive = promotionDetailsRepo.save(promotionDetails);
                    productDetails.setPromotionDetailsActive(promotionDetailsActive);
                    productDetailsRepo.save(productDetails);
                    return promotionDetails;
        }).collect(Collectors.toList());

//        promotionDetailsRepo.saveAll(lstPromotionDetails);

        return new ResponseEntity<>(new ResponseObject("success", "Thành Công", 0, promotionRequest), HttpStatus.OK);

    }

    @Override
    public ResponseEntity<ResponseObject> update(PromotionRequest promotionRequest, Long id){
        Optional<Promotion> otp = repository.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("error", "Không Thấy ID", 1, promotionRequest), HttpStatus.BAD_REQUEST);
        }

        Promotion entity = otp.get();
        entity = mapper.map(promotionRequest, Promotion.class);
        entity.setId(id);
        entity.setLastModifiedDate(LocalDateTime.now());
        entity.setLastModifiedBy("Admin");
        entity.setDeleted(false);
        Promotion promotion = repository.save(entity);
        if (promotion == null){
            return new ResponseEntity<>(new ResponseObject("error", "Thất Bại", 1, promotionRequest), HttpStatus.BAD_REQUEST);
        }


        //delete all PromotionDetails by promotion
// <<<<<<< HEAD
//         promotionDetailsRepo.deleteByPromotion(promotion);

//         List<ProductDetails> lstProductDetails = productDetailsRepo.findAllById(promotionRequest.getLstProductDetails());

//         List<PromotionDetails> lstPromotionDetails = lstProductDetails.stream().map(
//                 productDetails -> {

//                     PromotionDetails promotionDetails = new PromotionDetails();
//                     promotionDetails.setPromotion(promotion);
//                     promotionDetails.setProductDetails(productDetails);
// =======
//        promotionDetailsRepo.deleteByPromotion(promotion);

        promotionDetailsRepo.updateDeletedFlagForNotInIds(promotionRequest.getLstProductDetails());
        promotionDetailsRepo.updateDeletedFalseInIds(promotionRequest.getLstProductDetails());
        List<Long> listId = promotionRequest.getLstProductDetails();
        listId.stream().map(productId -> {
                    PromotionDetails promotionDetails = new PromotionDetails();

                    promotionDetails.setPromotion(promotion);
                    promotionDetails.setProductDetails(productDetailsRepo.findById(productId).get());
// >>>>>>> origin/be_b

                    promotionDetails.setId(null);
                    promotionDetails.setDeleted(false);
                    promotionDetails.setCreatedBy("Admin");
                    promotionDetails.setCreatedDate(LocalDateTime.now());
                    promotionDetails.setLastModifiedDate(LocalDateTime.now());
                    promotionDetails.setLastModifiedBy("Admin");
// <<<<<<< HEAD

//                     PromotionDetails promotionDetailsActive = promotionDetailsRepo.save(promotionDetails);
//                     productDetails.setPromotionDetailsActive(promotionDetailsActive);
//                     productDetailsRepo.save(productDetails);
//                     return promotionDetails;
//                 }).collect(Collectors.toList());
// =======
                    return promotionDetailService.createNew(promotionDetails);
        });
//        promotionDetailsRepo.createnotInIds(promotionRequest.getLstProductDetails(), id);

//        List<ProductDetails> lstProductDetails = productDetailsRepo.findAllById(promotionRequest.getLstProductDetails());
//        List<PromotionDetails> lstPromotionDetails = lstProductDetails.stream().map(
//                productDetails -> {
//                    PromotionDetails promotionDetails = new PromotionDetails();
//                    promotionDetails.setPromotion(promotion);
//                    promotionDetails.setProductDetails(productDetails);
//
//                    promotionDetails.setId(null);
//                    promotionDetails.setDeleted(false);
//                    promotionDetails.setCreatedBy("Admin");
//                    promotionDetails.setCreatedDate(LocalDateTime.now());
//                    promotionDetails.setLastModifiedDate(LocalDateTime.now());
//                    promotionDetails.setLastModifiedBy("Admin");
//
//                    PromotionDetails promotionDetailsActive = promotionDetailsRepo.save(promotionDetails);
//                    productDetails.setPromotionDetailsActive(promotionDetailsActive);
//                    productDetailsRepo.save(productDetails);
//                    return promotionDetails;
//                }).collect(Collectors.toList());
// >>>>>>> origin/be_b
        //save all list PromotionDetails
//        promotionDetailsRepo.saveAll(lstPromotionDetails);
        return new ResponseEntity<>(new ResponseObject("success", "Thành Công", 0, promotionRequest), HttpStatus.OK);

    }
}

package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.request.promotion.PromotionRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import com.example.webapp_shop_ecommerce.entity.Promotion;
import com.example.webapp_shop_ecommerce.entity.PromotionDetails;
import com.example.webapp_shop_ecommerce.infrastructure.enums.TrangThaiGiamGia;
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
        entity.setStatus(TrangThaiGiamGia.SAP_DIEN_RA.getLabel());
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
//
//                    PromotionDetails promotionDetailsActive = promotionDetailsRepo.save(promotionDetails);
//                    productDetails.setPromotionDetailsActive(promotionDetailsActive);
//                    productDetailsRepo.save(productDetails);
                    return promotionDetails;
        }).collect(Collectors.toList());

        promotionDetailsRepo.saveAll(lstPromotionDetails);

        return new ResponseEntity<>(new ResponseObject("success", "Thành Công", 0, promotionRequest), HttpStatus.OK);

    }

    @Override
    public ResponseEntity<ResponseObject> update(PromotionRequest promotionRequest, Long id){
        Optional<Promotion> otp = repository.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("error", "Không thấy giảm giá", 1, promotionRequest), HttpStatus.BAD_REQUEST);
        }

        Promotion entity = otp.get();
        if (!entity.getStatus().equalsIgnoreCase(TrangThaiGiamGia.SAP_DIEN_RA.getLabel())) {
            return new ResponseEntity<>(new ResponseObject("error", "Không thể sửa giảm giá " +
                    (entity.getStatus().equalsIgnoreCase(TrangThaiGiamGia.DANG_DIEN_RA.getLabel()) ? "đang diễn ra" :
                            (entity.getStatus().equalsIgnoreCase(TrangThaiGiamGia.DA_KET_THUC.getLabel()) ? "đã kêt thúc" :
                                    (entity.getStatus().equalsIgnoreCase(TrangThaiGiamGia.DA_HUY.getLabel()) ? "đã hủy" : ""))), 1, promotionRequest), HttpStatus.BAD_REQUEST);
        }

        entity = mapper.map(promotionRequest, Promotion.class);
        entity.setId(id);
        entity.setLastModifiedDate(LocalDateTime.now());
        entity.setLastModifiedBy("Admin");
        entity.setDeleted(false);
        Promotion promotion = repository.save(entity);

        List<PromotionDetails> lstPromotionDetails = promotionDetailsRepo.findPromotionDetailsByPromotion(promotion.getId());

        List<Long> lstProductDetails = lstPromotionDetails.stream().map(promotionDetails -> promotionDetails.getProductDetails().getId()).collect(Collectors.toList());
        List<Long> promotionDetailsCreate = promotionRequest.getLstProductDetails().stream()
                .filter(productDetail -> !lstProductDetails
                        .contains(productDetail))
                .collect(Collectors.toList());
        for (Long productId : promotionDetailsCreate){
            PromotionDetails promotionDetails = new PromotionDetails();
            promotionDetails.setPromotion(promotion);
            promotionDetails.setProductDetails(productDetailsRepo.findById(productId).get());
            promotionDetails.setId(null);
            promotionDetailService.createNew(promotionDetails);
        }


        List<PromotionDetails> promotionDetailsUpdate = lstPromotionDetails.stream()
                .filter(promotionDetail -> promotionRequest.getLstProductDetails().contains(promotionDetail.getProductDetails().getId()))
                .collect(Collectors.toList());
        for (PromotionDetails promotionDetails: promotionDetailsUpdate){
//            promotionDetails.setPromotionValue(promotionDetails.getPromotion().getValue());
            promotionDetails.setDeleted(false);
            promotionDetailService.update(promotionDetails);
        }


        promotionDetailsRepo.updateDeletedFlagForNotInIds(promotionRequest.getLstProductDetails());
//        promotionDetailsRepo.updateDeletedFalseInIds(promotionRequest.getLstProductDetails());


        return new ResponseEntity<>(new ResponseObject("success", "Thành Công", 0, promotionRequest), HttpStatus.OK);

    }

    @Override
    public Optional<Promotion> findByIdAndPromotionDetails(Long id) {
        return repository.findByIdAndPromotionDetails(id);
    }
}

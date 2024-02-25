package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.dto.request.promotion.PromotionRequest;
import com.example.webapp_shop_ecommerce.dto.request.voucher.VoucherRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Address;
import com.example.webapp_shop_ecommerce.entity.Promotion;
import com.example.webapp_shop_ecommerce.entity.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface IVoucherService extends IBaseService<Voucher, Long>{
    Page<Voucher> findVoucherByKeyWorkAndDeletedFalse(Pageable pageable, Map<String,String> keyWork);
    ResponseEntity<ResponseObject> save(VoucherRequest voucherRequest);
    ResponseEntity<ResponseObject> update(VoucherRequest voucherRequest, Long id);

}

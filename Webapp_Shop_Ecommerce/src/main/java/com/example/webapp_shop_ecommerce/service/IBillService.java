package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.dto.request.bill.BillRequest;
import com.example.webapp_shop_ecommerce.dto.request.cart.CartRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Bill;
import org.springframework.http.ResponseEntity;

public interface IBillService extends IBaseService<Bill, Long> {
    ResponseEntity<ResponseObject> buyBillClient(BillRequest billRequest);

}

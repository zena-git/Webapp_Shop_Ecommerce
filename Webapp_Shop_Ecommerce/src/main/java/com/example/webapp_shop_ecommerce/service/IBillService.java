package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.dto.request.bill.BillRequest;
import com.example.webapp_shop_ecommerce.dto.request.billdetails.BillDetailsRequest;
import com.example.webapp_shop_ecommerce.dto.request.cart.CartRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Bill;
import com.example.webapp_shop_ecommerce.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IBillService extends IBaseService<Bill, Long> {
    ResponseEntity<ResponseObject> buyBillClient(BillRequest billRequest);
    ResponseEntity<ResponseObject> buyBillClientGuest(BillRequest billRequest);
    List<Bill> findBillByCustomer();

    List<Bill> findAllTypeAndStatus(String type, String status);



    ResponseEntity<ResponseObject> billCounterNew();
    ResponseEntity<ResponseObject> countersAddProduct(List<BillDetailsRequest> lstBillDetailsDto, Long id);
    ResponseEntity<ResponseObject> billUpdateCustomer(BillRequest billRequest, Long id);
    ResponseEntity<ResponseObject> countersAddProductBarcode( Long id, String barcode );
    ResponseEntity<ResponseObject> chaneQuantityBillDetails(BillDetailsRequest billDto, Long idBillDetail);
    ResponseEntity<ResponseObject> billCounterPay( BillRequest billDto, Long id);

    Page<Bill> findAllDeletedFalseAndStatusAndStatusNot(Pageable page, String status, String statusNot);
}

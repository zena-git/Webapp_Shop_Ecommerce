package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.request.billdetails.BillDetailsRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Bill;
import com.example.webapp_shop_ecommerce.entity.BillDetails;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import com.example.webapp_shop_ecommerce.infrastructure.enums.TrangThai;
import com.example.webapp_shop_ecommerce.infrastructure.enums.TrangThaiBill;
import com.example.webapp_shop_ecommerce.repositories.IProductDetailsRepository;
import com.example.webapp_shop_ecommerce.service.IBillDetailsService;
import com.example.webapp_shop_ecommerce.service.IBillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class ReturnsOrderService {
    @Autowired
    IBillService billService;
    @Autowired
    IBillDetailsService billDetailsService;
    @Autowired
    IProductDetailsRepository productDetailsRepo;
    public ResponseEntity<ResponseObject> returnOrderOne(BillDetailsRequest billDetailsRequest, Long billId, Long billDetailsId) {
        Optional<Bill> optionalBill = billService.findById(billId);
        if (optionalBill.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("erorr", "Không tìm thấy hóa đơn", 0, billDetailsRequest), HttpStatus.BAD_REQUEST);
        }

        Optional<BillDetails> optionalBillDetails = billDetailsService.findById(billDetailsId);
        if (optionalBillDetails.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("erorr", "Không tim thấy hóa đơn chi tiết", 0, billDetailsRequest), HttpStatus.BAD_REQUEST);
        }
        Bill billOtp = optionalBill.get();
        BillDetails billDetailsOtp = optionalBillDetails.get();
        ProductDetails productDetails = optionalBillDetails.get().getProductDetails();

        BillDetails billDetails = new BillDetails();
        billDetails.setBill(billOtp);
        billDetails.setProductDetails(productDetails);
        billDetails.setUnitPrice(billDetailsOtp.getUnitPrice());
        billDetails.setQuantity(billDetailsRequest.getQuantity());
        billDetails.setStatus(TrangThaiBill.TRA_HANG.getLabel());
        billDetails.setDescription(billDetailsRequest.getDescription());

        billDetailsOtp.setQuantity(billDetailsOtp.getQuantity() - billDetailsRequest.getQuantity());
        billDetailsOtp.setStatus(TrangThaiBill.DANG_BAN.getLabel());


        if (billDetailsOtp.getQuantity() == 0) {
            billDetailsService.physicalDelete(billDetailsOtp.getId()); // xol
        }else {
            billDetailsService.update(billDetailsOtp);
        }
        billDetailsService.createNew(billDetails);
        BigDecimal totalMoney = billOtp.getTotalMoney().subtract(new BigDecimal(billDetails.getQuantity()).multiply(billDetails.getUnitPrice()));
        billOtp.setTotalMoney(totalMoney);
        BigDecimal intoMoney = totalMoney.subtract(billOtp.getVoucherMoney()).add(billOtp.getShipMoney());
        billOtp.setIntoMoney(intoMoney);
        billService.update(billOtp);
        return new ResponseEntity<>(new ResponseObject("success", "Trả Hàng Thành Công", 0, billDetailsRequest), HttpStatus.OK);

    }
}

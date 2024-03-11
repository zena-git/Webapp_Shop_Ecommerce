package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.request.bill.BillRequest;
import com.example.webapp_shop_ecommerce.dto.request.cart.CartRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.*;
import com.example.webapp_shop_ecommerce.infrastructure.security.Authentication;
import com.example.webapp_shop_ecommerce.repositories.*;
import com.example.webapp_shop_ecommerce.service.IBillDetailsService;
import com.example.webapp_shop_ecommerce.service.IBillService;
import com.example.webapp_shop_ecommerce.service.ICartDetailsService;
import com.example.webapp_shop_ecommerce.service.IProductDetailsService;
import com.example.webapp_shop_ecommerce.ultiltes.RandomStringGenerator;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BillServiceImpl extends BaseServiceImpl<Bill, Long, IBillRepository> implements IBillService {
    @Autowired
    private IProductDetailsRepository productDetailsRepo;
    @Autowired
    private Authentication authentication;
    @Autowired
    private ICartRepository cartRepo;
    @Autowired
    private ICartDetailsRepository cartDetailsRepo;
    @Autowired
    private IBillRepository billRepo;
    @Autowired
    private IBillDetailsRepository billDetailsSRepo;
    @Autowired
    private RandomStringGenerator randomStringGenerator;
    @Autowired
    private ModelMapper mapper;
    @Override
    public ResponseEntity<ResponseObject> buyBillClient(BillRequest billRequest) {
        Customer customer = authentication.getCustomer();
        List<Long> lstIdCartDetails =  billRequest.getLstCartDetails().stream().map(cartDetails -> cartDetails.getId()).collect(Collectors.toList());;
        if (lstIdCartDetails.size()==0){
            return new ResponseEntity<>(new ResponseObject("error", "Chon it nhat 1 san pham", 1, billRequest), HttpStatus.BAD_REQUEST);
        }
        Bill billDto = mapper.map(billRequest, Bill.class);
        billDto.setId(null);
        billDto.setCodeBill("HD"+ randomStringGenerator.generateRandomString(6));
        billDto.setBillType("Online");
        billDto.setBookingDate(new Date());
        billDto.setDeleted(false);
        billDto.setCreatedBy("Admin");
        billDto.setCreatedDate(LocalDateTime.now());
        billDto.setLastModifiedDate(LocalDateTime.now());
        billDto.setLastModifiedBy("Admin");
        billDto.setCustomer(customer);
        Bill bill = billRepo.save(billDto);
        List<CartDetails> lstCartDetails = cartDetailsRepo.findAllById(lstIdCartDetails);

        List<BillDetails> lstBillDetails = lstCartDetails.stream().map(cartDetails -> {
            BillDetails billDetails = new BillDetails();
            ProductDetails productDetails = cartDetails.getProductDetails();

            billDetails.setBill(bill);
            billDetails.setProductDetails(productDetails);
            billDetails.setUnitPrice(productDetails.getPrice());
            billDetails.setQuantity(cartDetails.getQuantity());
            billDetails.setStatus("Đang Xuất Hàng 0");
            billDetails.setId(null);
            billDetails.setDeleted(false);
            billDetails.setCreatedBy("Admin");
            billDetails.setCreatedDate(LocalDateTime.now());
            billDetails.setLastModifiedDate(LocalDateTime.now());
            billDetails.setLastModifiedBy("Admin");

            productDetails.setQuantity(productDetails.getQuantity() - cartDetails.getQuantity());
            productDetailsRepo.save(productDetails);
            return billDetailsSRepo.save(billDetails);
        }).collect(Collectors.toList());

        cartDetailsRepo.deleteAll(lstCartDetails);

        return new ResponseEntity<>(new ResponseObject("success", "Đặt Hàng Thành Công", 0, billRequest), HttpStatus.CREATED);

    }

    @Override
    public ResponseEntity<ResponseObject> buyBillClientGuest(BillRequest billRequest) {
        if (billRequest.getLstCartDetails().size()==0){
            return new ResponseEntity<>(new ResponseObject("error", "Chon it nhat 1 san pham", 1, billRequest), HttpStatus.BAD_REQUEST);
        }
        Bill billDto = mapper.map(billRequest, Bill.class);
        billDto.setId(null);
        billDto.setCodeBill("HD"+ randomStringGenerator.generateRandomString(6));
        billDto.setBillType("Online");
        billDto.setBookingDate(new Date());
        billDto.setDeleted(false);
        billDto.setCreatedBy("Admin");
        billDto.setCreatedDate(LocalDateTime.now());
        billDto.setLastModifiedDate(LocalDateTime.now());
        billDto.setLastModifiedBy("Admin");
        billDto.setCustomer(null);
        Bill bill = billRepo.save(billDto);

        List<BillDetails> lstBillDetails = billRequest.getLstCartDetails().stream().map(cartDetails -> {
            BillDetails billDetails = new BillDetails();
            ProductDetails productDetails = cartDetails.getProductDetails();
            billDetails.setBill(bill);
            billDetails.setProductDetails(productDetails);
            billDetails.setUnitPrice(productDetails.getPrice());
            billDetails.setQuantity(cartDetails.getQuantity());
            billDetails.setStatus("Đang Xuất Hàng 0");
            billDetails.setId(null);
            billDetails.setDeleted(false);
            billDetails.setCreatedBy("Admin");
            billDetails.setCreatedDate(LocalDateTime.now());
            billDetails.setLastModifiedDate(LocalDateTime.now());
            billDetails.setLastModifiedBy("Admin");

            productDetails.setQuantity(productDetails.getQuantity() - cartDetails.getQuantity());
            productDetailsRepo.save(productDetails);
            return billDetailsSRepo.save(billDetails);
        }).collect(Collectors.toList());
        return new ResponseEntity<>(new ResponseObject("success", "Đặt Hàng Thành Công", 0, billRequest), HttpStatus.CREATED);

    }

    @Override
    public List<Bill> findBillByCustomer() {
        Customer customer = authentication.getCustomer();
        return repository.findBillByCustomer(customer);
    }
}

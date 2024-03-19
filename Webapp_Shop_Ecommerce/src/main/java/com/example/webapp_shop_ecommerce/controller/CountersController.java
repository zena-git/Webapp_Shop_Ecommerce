package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.bill.BillRequest;
import com.example.webapp_shop_ecommerce.dto.request.billdetails.BillDetailsRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.bill.BillCountersResponse;
import com.example.webapp_shop_ecommerce.dto.response.bill.BillResponse;
import com.example.webapp_shop_ecommerce.dto.response.billdetails.BillDetailsCountersResponse;
import com.example.webapp_shop_ecommerce.dto.response.billdetails.BillDetailsResponse;
import com.example.webapp_shop_ecommerce.dto.response.productdetails.ProductDetailsCountersResponse;
import com.example.webapp_shop_ecommerce.dto.response.productdetails.ProductDetailsResponse;
import com.example.webapp_shop_ecommerce.entity.Bill;
import com.example.webapp_shop_ecommerce.entity.BillDetails;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import com.example.webapp_shop_ecommerce.infrastructure.enums.BillType;
import com.example.webapp_shop_ecommerce.infrastructure.enums.TrangThaiBill;
import com.example.webapp_shop_ecommerce.service.IBillDetailsService;
import com.example.webapp_shop_ecommerce.service.IBillService;
import com.example.webapp_shop_ecommerce.service.IProductDetailsService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/counters")
public class CountersController {
    @Autowired
    private ModelMapper mapper;
    @Autowired
    private IBillService billService;

    @Autowired
    private IBillDetailsService billDetailsService;
    @Autowired
    private IProductDetailsService productDetailsService;


    @GetMapping()
    public ResponseEntity<?> findBillCounter() {

        List<Bill> lstPro = billService.findAllTypeAndStatus(BillType.OFFLINE.getLabel(), TrangThaiBill.NEW.getLabel());
        List<BillCountersResponse> lst = lstPro.stream().map(entity -> mapper.map(entity, BillCountersResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findBillCounterId(@PathVariable("id") Long id) {
        Optional<Bill> opt = billService.findById(id);
        if (opt.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        List<BillDetails> lstBillDetails = billDetailsService.findAllByBill(opt.get());
        List<BillDetailsCountersResponse> lst = lstBillDetails.stream().map(entity -> mapper.map(entity, BillDetailsCountersResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<?> billCounterNew() {
        return billService.billCounterNew();
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> billCounterUpdate(@RequestBody BillRequest billDto, @PathVariable("id") Long id) {
        System.out.println("Update ID: " + id);
        Bill bill = null;
        Optional<Bill> otp = billService.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, billDto), HttpStatus.BAD_REQUEST);
        }

        if (otp.isPresent()){
            bill = billService.findById(id).orElseThrow(IllegalArgumentException::new);
            bill = mapper.map(billDto, Bill.class);
            bill.setId(id);
            return billService.update(bill);
        }
        return new ResponseEntity<>(new ResponseObject("Fail", "Không Thế Update", 1, billDto), HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/{id}/payment")
    public ResponseEntity<?> billCounterPay(@RequestBody BillRequest billDto, @PathVariable("id") Long id) {
        System.out.println("Update ID: " + id);
        return billService.billCounterPay(billDto, id);
    }

    @PostMapping("/{idBillDetail}/product")
    public ResponseEntity<?> billAddProduct(@RequestBody List<BillDetailsRequest> lstBillDetailsDto, @PathVariable("idBillDetail") Long id) {
        return billService.countersAddProduct(lstBillDetailsDto, id);
    }

    @PutMapping("/{idBill}/customer")
    public ResponseEntity<?> billUpdateCustomer(@RequestBody BillRequest billRequest, @PathVariable("idBill") Long id) {
        return billService.billUpdateCustomer(billRequest, id);
    }

    @PutMapping("/billDetails/{idBilldetails}")
    public ResponseEntity<?> chaneQuantityBillDetails(@RequestBody BillDetailsRequest billDto, @PathVariable("idBilldetails") Long id) {
        return billService.chaneQuantityBillDetails(billDto, id);
    }
    @DeleteMapping("/billDetails/{idBilldetails}")
    public ResponseEntity<?> deleteBillDetails(@PathVariable("idBilldetails") Long id) {
        return billService.billDeleteBillDetail(id);
    }


    @GetMapping("/{idBill}/product/barcode/{data}")
    public ResponseEntity<?> billAddProductBarcode(@PathVariable("idBill") Long id,@PathVariable("data") String data) {
        return billService.countersAddProductBarcode(id, data);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteBill( @PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return billService.deleteBillToBillDetailAll(id);

    }


    @GetMapping("/products")
    public ResponseEntity<?> getProductDetailsAll(@RequestParam(value = "page", defaultValue = "-1") Integer page,
                                                  @RequestParam(value = "size", defaultValue = "-1") Integer size) {
        Pageable pageable = Pageable.unpaged();
        List<ProductDetails> lstProductDetails = new ArrayList<>();
        if (size < 0) {
            size = 5;
        }
        if (page >= 0) {
            pageable = PageRequest.of(page, size);
        }
        lstProductDetails = productDetailsService.findAllDeletedFalse(pageable).getContent();
        List<ProductDetailsCountersResponse> resultDto = lstProductDetails.stream().map(attr -> mapper.map(attr, ProductDetailsCountersResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

}

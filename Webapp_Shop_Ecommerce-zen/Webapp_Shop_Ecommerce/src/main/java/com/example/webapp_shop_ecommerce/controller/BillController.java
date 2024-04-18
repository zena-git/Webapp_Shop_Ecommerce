package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.bill.BillRequest;
import com.example.webapp_shop_ecommerce.dto.request.billdetails.BillDetailsRequest;
import com.example.webapp_shop_ecommerce.dto.request.historybill.HistoryBillRequest;
import com.example.webapp_shop_ecommerce.dto.request.paymentHistory.PaymentHistoryRequest;
import com.example.webapp_shop_ecommerce.dto.response.bill.BillResponse;
import com.example.webapp_shop_ecommerce.dto.response.bill.BillShowResponse;
import com.example.webapp_shop_ecommerce.dto.response.billdetails.BillDetailsBillResponse;
import com.example.webapp_shop_ecommerce.dto.response.billdetails.BillDetailsCountersResponse;
import com.example.webapp_shop_ecommerce.dto.response.categories.CategoryResponse;
import com.example.webapp_shop_ecommerce.dto.response.productdetails.ProductDetailsResponse;
import com.example.webapp_shop_ecommerce.entity.*;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/bill")
public class BillController {

    @Autowired
    private ModelMapper mapper;
    @Autowired
    private IBillService billService;

    @Autowired
    private IBillDetailsService billDetailsService;


    @GetMapping
    public ResponseEntity<?> findBillAll(
            @RequestParam(value = "page", defaultValue = "-1") Integer page,
            @RequestParam(value = "size", defaultValue = "-1") Integer size,
            @RequestParam(value = "status", defaultValue = "") String status,
            @RequestParam(value = "search", defaultValue = "") String search,
            @RequestParam(value = "billType", defaultValue = "") String billType,
            @RequestParam(value = "endDate", defaultValue = "-1") String endDate,
            @RequestParam(value = "startDate", defaultValue = "-1") String startDate

        ) {
        Pageable pageable = Pageable.unpaged();
        if (size < 0) {
            size = 5;
        }
        if (page >= 0) {
            pageable = PageRequest.of(page, size);
        }
        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;
        if (!Objects.equals(startDate, "-1") && !Objects.equals(endDate, "-1")) {
            System.out.println("có data");
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            startDateTime = LocalDateTime.parse(startDate.trim() + " 00:00:00", formatter);
            endDateTime = LocalDateTime.parse(endDate.trim() + " 23:59:59", formatter);
        }


        //Dong goi praram
        Map<String, Object> keyWork = new HashMap<String, Object>();
        keyWork.put("search", search.trim());
        keyWork.put("status", status.trim());
        keyWork.put("billType", billType.trim());
        keyWork.put("startDate", startDateTime != null ? startDateTime : null);
        keyWork.put("endDate", endDateTime != null ? endDateTime : null);

        List<Bill> lstPro = billService.findAllDeletedFalseAndStatusAndStatusNot(pageable, keyWork, TrangThaiBill.NEW.getLabel()).getContent();
        List<BillResponse> lst = lstPro.stream().map(entity -> mapper.map(entity, BillResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> findObjById(@PathVariable("id") Long id) {
        Optional<Bill> otp = billService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        BillResponse bill = otp.map(pro -> mapper.map(pro, BillResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(bill, HttpStatus.OK);
    }

    @GetMapping("/show/{id}")
    public ResponseEntity<?> findObjByIdAll(@PathVariable("id") Long id) {
        Optional<Bill> otp = billService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        BillShowResponse bill = otp.map(pro -> mapper.map(pro, BillShowResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(bill, HttpStatus.OK);
    }
    @GetMapping("/show/{id}/billdetails/products")
    public ResponseEntity<?> findObjByIdAllProduct(@PathVariable("id") Long id) {
        Optional<Bill> opt = billService.findById(id);
        if (opt.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        List<BillDetails> lstBillDetails = billDetailsService.findAllByBillAndStatus(opt.get(),TrangThaiBill.DANG_BAN.getLabel());
        List<BillDetailsBillResponse> lst = lstBillDetails.stream().map(entity -> mapper.map(entity, BillDetailsBillResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }
    @GetMapping("/show/{id}/billdetails/products/returns")
    public ResponseEntity<?> findObjByIdAllProductReturns(@PathVariable("id") Long id) {
        Optional<Bill> opt = billService.findById(id);
        if (opt.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        List<BillDetails> lstBillDetails = billDetailsService.findAllByBillAndStatus(opt.get(),TrangThaiBill.TRA_HANG.getLabel());
        List<BillDetailsBillResponse> lst = lstBillDetails.stream().map(entity -> mapper.map(entity, BillDetailsBillResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }
    @PostMapping("/show/{id}/billdetails/products")
    public ResponseEntity<?> updateObjByIdAllProduct(@PathVariable("id") Long id) {
        Optional<Bill> opt = billService.findById(id);
        if (opt.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        List<BillDetails> lstBillDetails = billDetailsService.findAllByBill(opt.get());
        List<BillDetailsBillResponse> lst = lstBillDetails.stream().map(entity -> mapper.map(entity, BillDetailsBillResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }
    @PostMapping()
    public ResponseEntity<ResponseObject> saveBill(@RequestBody BillRequest billDto){
        return billService.createNew(mapper.map(billDto, Bill.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteBill( @PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return billService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateBill(@RequestBody BillRequest billDto, @PathVariable("id") Long id){
        System.out.println("Update ID: " + id);
        Bill bill = null;
        Optional<Bill>  otp = billService.findById(id);
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

    @PutMapping("/{id}/address")
    public ResponseEntity<ResponseObject> updateBillAddress(@RequestBody BillRequest billDto, @PathVariable("id") Long id){
        System.out.println("Update ID: " + id);
        Optional<Bill>  otp = billService.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, billDto), HttpStatus.BAD_REQUEST);
        }
        Bill bill = otp.get();

        bill.setReceiverCommune(billDto.getReceiverCommune());
        bill.setReceiverDetails(billDto.getReceiverDetails());
        bill.setReceiverProvince(billDto.getReceiverProvince());
        bill.setReceiverName(billDto.getReceiverName());
        bill.setReceiverPhone(billDto.getReceiverPhone());
        bill.setReceiverDistrict(billDto.getReceiverDistrict());
        bill.setDescription(billDto.getDescription());
        bill.setShipMoney(billDto.getShipMoney());
        bill.setIntoMoney(bill.getTotalMoney().subtract(bill.getVoucherMoney()).add(billDto.getShipMoney()));
        return billService.update(bill);

    }

    @PostMapping("/{idbill}/product")
    public ResponseEntity<?> billAddProduct(@RequestBody List<BillDetailsRequest> lstBillDetailsDto, @PathVariable("idbill") Long id) {
        return billService.billAddProductNew(lstBillDetailsDto, id);
    }

    @PutMapping("/{idBill}/billDetails/{idBilldetails}")
    public ResponseEntity<?> chaneQuantityBillDetails(@RequestBody BillDetailsRequest billDetailsRequest, @PathVariable("idBill") Long idBill, @PathVariable("idBilldetails") Long idBillDetails) {
        return billService.chaneQuantityBillToBillDetails(billDetailsRequest, idBill, idBillDetails);
    }

    @DeleteMapping("/{idBill}/billDetails/{idBilldetails}")
    public ResponseEntity<?> deleteBillDetails(@PathVariable("idBill") Long idBill, @PathVariable("idBilldetails") Long billDeleteBillDetail) {
        return billService.deleteBillToBillDetail(idBill, billDeleteBillDetail);
    }


    @PostMapping("/{idBill}/historyBill")
    public ResponseEntity<?> addHistorybill(@RequestBody HistoryBillRequest historyBillRequest, @PathVariable("idBill") Long idBill) {
        return billService.addHistorybill(historyBillRequest, idBill);
    }
    @PostMapping("/{idBill}/payment")
    public ResponseEntity<?> billPaymentHistory(@RequestBody PaymentHistoryRequest historyBillRequest, @PathVariable("idBill") Long idBill) {
        return billService.billPaymentHistory(historyBillRequest, idBill);
    }

    @PutMapping("/{idBill}/cancelling")
    public ResponseEntity<?> cancellingBill(@PathVariable("idBill") Long idBill) {
        return billService.cancellingBill(idBill);
    }

}

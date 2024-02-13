package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.bill.BillRequest;
import com.example.webapp_shop_ecommerce.dto.response.bill.BillResponse;
import com.example.webapp_shop_ecommerce.dto.response.categories.CategoryResponse;
import com.example.webapp_shop_ecommerce.entity.Bill;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Category;
import com.example.webapp_shop_ecommerce.service.IBillService;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/bill")
public class BillController {

    @Autowired
    private ModelMapper mapper;
    @Autowired
    private IBillService billService;


    @GetMapping
    public ResponseEntity<?> findProductAll(
            @RequestParam(value = "page", defaultValue = "-1") Integer page,
            @RequestParam(value = "size", defaultValue = "-1") Integer size) {
        Pageable pageable = Pageable.unpaged();
        if (size < 0) {
            size = 5;
        }
        if (page >= 0) {
            pageable = PageRequest.of(page, size);
        }
        List<Bill> lstPro = billService.findAllDeletedFalse(pageable).getContent();
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
    @PostMapping()
    public ResponseEntity<ResponseObject> saveProduct(@RequestBody BillRequest billDto){
        return billService.createNew(mapper.map(billDto, Bill.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteProduct( @PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return billService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateProduct(@RequestBody BillRequest billDto, @PathVariable("id") Long id){
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
}

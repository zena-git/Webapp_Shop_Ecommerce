package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.billdetails.BillDetailsRequest;
import com.example.webapp_shop_ecommerce.dto.response.billdetails.BillDetailsResponse;
import com.example.webapp_shop_ecommerce.dto.response.cart.CartResponse;
import com.example.webapp_shop_ecommerce.entity.BillDetails;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Cart;
import com.example.webapp_shop_ecommerce.service.IBillDetailsService;
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
@RequestMapping("/api/v1/billDetails")
public class BillDetailsController {

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private IBillDetailsService billDetailsService;

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
        System.out.println("page=" + page + " size=" + size);
        List<BillDetails> lstPro = billDetailsService.findAllDeletedFalse(pageable).getContent();
        List<BillDetailsResponse> lst = lstPro.stream().map(entity -> mapper.map(entity, BillDetailsResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> findObjById(@PathVariable("id") Long id) {
        Optional<BillDetails> otp = billDetailsService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        BillDetailsResponse billDetail = otp.map(pro -> mapper.map(pro, BillDetailsResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(billDetail, HttpStatus.OK);
    }
    @PostMapping()
    public ResponseEntity<ResponseObject> saveProduct(@RequestBody BillDetailsRequest billDetailsDto){
        return billDetailsService.createNew(mapper.map(billDetailsDto, BillDetails.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteProduct( @PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return billDetailsService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateProduct(@RequestBody BillDetailsRequest billDetailsDto, @PathVariable("id") Long id){
        System.out.println("Update ID: " + id);
        BillDetails billDetails = null;
        Optional<BillDetails>  otp = billDetailsService.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, billDetailsDto), HttpStatus.BAD_REQUEST);
        }
        if (otp.isPresent()){
            billDetails = billDetailsService.findById(id).orElseThrow(IllegalArgumentException::new);
            billDetails = mapper.map(billDetailsDto, BillDetails.class);
            billDetails.setId(id);
            return billDetailsService.update(billDetails);
        }
        return new ResponseEntity<>(new ResponseObject("Fail", "Không Thế Update", 1, billDetailsDto), HttpStatus.BAD_REQUEST);
    }
}

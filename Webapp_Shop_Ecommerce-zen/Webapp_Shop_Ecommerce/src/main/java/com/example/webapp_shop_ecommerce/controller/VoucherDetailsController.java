package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.voucherDetails.VoucherDetailsRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.voucherDetails.VoucherDetailsResponse;
import com.example.webapp_shop_ecommerce.entity.Voucher;
import com.example.webapp_shop_ecommerce.entity.VoucherDetails;
import com.example.webapp_shop_ecommerce.service.IVoucherDetailsService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.webapp_shop_ecommerce.dto.response.voucherDetails.VoucherDetailsCountersResponse;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/voucherDetails")
public class VoucherDetailsController {

    @Autowired
    private ModelMapper mapper;
    @Autowired
    private IVoucherDetailsService voucherDetailsService;

   

    @GetMapping
    public ResponseEntity<?> findAll(
            @RequestParam(value = "page", defaultValue = "-1") Integer page,
            @RequestParam(value = "size", defaultValue = "-1") Integer size) {
        Pageable pageable = Pageable.unpaged();
        if (size < 0) {
            size = 5;
        }

        if (page >= 0) {
            pageable = PageRequest.of(page, size);
        }
        List<VoucherDetails> lstEty = voucherDetailsService.findAllDeletedFalse(pageable).getContent();
        List<VoucherDetailsResponse> lst  = lstEty.stream().map(entity -> mapper.map(entity, VoucherDetailsResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findObjById(@PathVariable("id") Long id) {
        Optional<VoucherDetails> otp = voucherDetailsService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        VoucherDetailsResponse obj = otp.map(pro -> mapper.map(pro, VoucherDetailsResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<ResponseObject> save(@RequestBody VoucherDetailsRequest objDto){
        return voucherDetailsService.createNew(mapper.map(objDto, VoucherDetails.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> delete( @PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return voucherDetailsService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> update(@RequestBody VoucherDetailsRequest objDto, @PathVariable("id") Long id){
        System.out.println("Update ID: " + id);
        VoucherDetails obj = null;
        Optional<VoucherDetails>  otp = voucherDetailsService.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, objDto), HttpStatus.BAD_REQUEST);
        }

        if (otp.isPresent()){
            obj = voucherDetailsService.findById(id).orElseThrow(IllegalArgumentException::new);
            obj = mapper.map(objDto, VoucherDetails.class);
            obj.setId(id);
            return voucherDetailsService.update(obj);

        }

        return new ResponseEntity<>(new ResponseObject("Fail", "Không Thế Update", 1, objDto), HttpStatus.BAD_REQUEST);


    }

    @GetMapping("/customer/{id}")
    public ResponseEntity<?> findAllVoucherByCustomer(@PathVariable("id") Long id) {

        List<VoucherDetails> lstEty = voucherDetailsService.findAllByIdCustomer(id);
        List<VoucherDetailsCountersResponse> lst = lstEty.stream().map(entity -> mapper.map(entity, VoucherDetailsCountersResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);

    }
}

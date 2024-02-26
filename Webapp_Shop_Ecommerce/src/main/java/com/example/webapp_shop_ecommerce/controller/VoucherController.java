package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.voucher.VoucherRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.voucher.VoucherResponse;
import com.example.webapp_shop_ecommerce.entity.Voucher;
import com.example.webapp_shop_ecommerce.service.IVoucherService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/voucher")
public class VoucherController {

    @Autowired
    private ModelMapper mapper;
    @Autowired
    private IVoucherService voucherService;

   

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
        List<Voucher> lstEty = voucherService.findAllDeletedFalse(pageable).getContent();
        List<VoucherResponse> lst  = lstEty.stream().map(entity -> mapper.map(entity, VoucherResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findObjById(@PathVariable("id") Long id) {
        Optional<Voucher> otp = voucherService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        VoucherResponse obj = otp.map(pro -> mapper.map(pro, VoucherResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<ResponseObject> save(@RequestBody VoucherRequest objDto){
        return voucherService.createNew(mapper.map(objDto, Voucher.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> delete( @PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return voucherService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> update(@RequestBody VoucherRequest addressDto, @PathVariable("id") Long id){
        System.out.println("Update ID: " + id);
        Voucher obj = null;
        Optional<Voucher>  otp = voucherService.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, addressDto), HttpStatus.BAD_REQUEST);
        }

        if (otp.isPresent()){
            obj = voucherService.findById(id).orElseThrow(IllegalArgumentException::new);
            obj = mapper.map(addressDto, Voucher.class);
            obj.setId(id);
            return voucherService.update(obj);

        }

        return new ResponseEntity<>(new ResponseObject("Fail", "Không Thế Update", 1, addressDto), HttpStatus.BAD_REQUEST);


    }
}

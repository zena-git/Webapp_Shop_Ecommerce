package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.address.AddressRequest;
import com.example.webapp_shop_ecommerce.dto.response.address.AddressResponse;
import com.example.webapp_shop_ecommerce.entity.Address;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.service.IAddressService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
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

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/address")
public class AddressController {

    @Autowired
    private ModelMapper mapper;
    @Autowired
    private IAddressService addressService;

   

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
        List<Address> lstPro = addressService.findAllDeletedFalse(pageable).getContent();
        List<AddressResponse> lst  = lstPro.stream().map(entity -> mapper.map(entity, AddressResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findObjById(@PathVariable("id") Long id) {
        Optional<Address> otp = addressService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        AddressResponse address = otp.map(pro -> mapper.map(pro, AddressResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(address, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<?> save(@Valid @RequestBody AddressRequest addressDto, BindingResult result){
        if (result.hasErrors()) {
            // Xử lý lỗi validate ở đây
            StringBuilder errors = new StringBuilder();
            for (FieldError error : result.getFieldErrors()) {
                errors.append(error.getDefaultMessage()).append("\n");
            }
            // Xử lý lỗi validate ở đây, ví dụ: trả về ResponseEntity.badRequest()
            return new ResponseEntity<>(new ResponseObject("error", errors.toString(), 1, addressDto), HttpStatus.BAD_REQUEST);
        }
        return addressService.save(addressDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> delete( @PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return addressService.physicalDelete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@Valid @RequestBody AddressRequest addressDto, BindingResult result, @PathVariable("id") Long id){
        System.out.println("Update ID: " + id);
        if (result.hasErrors()) {
            // Xử lý lỗi validate ở đây
            StringBuilder errors = new StringBuilder();
            for (FieldError error : result.getFieldErrors()) {
                errors.append(error.getDefaultMessage()).append("\n");
            }
            // Xử lý lỗi validate ở đây, ví dụ: trả về ResponseEntity.badRequest()
            return new ResponseEntity<>(new ResponseObject("error", errors.toString(), 1, addressDto), HttpStatus.BAD_REQUEST);
        }
        return addressService.update(addressDto,id);


    }
}

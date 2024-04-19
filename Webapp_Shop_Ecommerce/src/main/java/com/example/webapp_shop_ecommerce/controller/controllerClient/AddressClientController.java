package com.example.webapp_shop_ecommerce.controller.controllerClient;


import com.example.webapp_shop_ecommerce.dto.request.address.AddressRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.address.AddressResponse;
import com.example.webapp_shop_ecommerce.entity.Address;
import com.example.webapp_shop_ecommerce.service.IAddressService;
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
@RequestMapping("/api/v2/address")
public class AddressClientController {
    @Autowired
    private ModelMapper mapper;
    @Autowired
    private IAddressService addressService;
    @GetMapping
    public ResponseEntity<?> findAll() {

        List<Address> lstPro = addressService.findAddressByCustomerAndDeletedFalse();
        List<AddressResponse> lst  = lstPro.stream().map(entity -> mapper.map(entity, AddressResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<ResponseObject> save(@RequestBody AddressRequest addressDto){
        return addressService.createNew(mapper.map(addressDto, Address.class));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> update(@RequestBody AddressRequest addressDto, @PathVariable("id") Long id){
        System.out.println("Update ID: " + id);
        Address address = null;
        Optional<Address> otp = addressService.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, addressDto), HttpStatus.BAD_REQUEST);
        }

        if (otp.isPresent()){
            address = addressService.findById(id).orElseThrow(IllegalArgumentException::new);
            address = mapper.map(addressDto, Address.class);
            address.setId(id);
            return addressService.update(address);

        }

        return new ResponseEntity<>(new ResponseObject("Fail", "Không Thế Update", 1, addressDto), HttpStatus.BAD_REQUEST);


    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> delete( @PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return addressService.delete(id);
    }
}

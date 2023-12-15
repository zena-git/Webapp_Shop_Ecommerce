package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.address.AddressDto;
import com.example.webapp_shop_ecommerce.entity.Address;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.service.IAddressService;
import com.example.webapp_shop_ecommerce.service.IBaseService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/v1/address")
public class AddressController {

    @Autowired
    private ModelMapper mapper;
    private final IBaseService<Address, Long> baseService;
    @Autowired
    private IAddressService addressService;

    @Autowired
    public AddressController(IBaseService<Address, Long> baseService) {
        this.baseService = baseService;
    }


    @GetMapping
    public ResponseEntity<List<AddressDto>> findAll(){
        List<AddressDto> lst = new ArrayList<>();
        List<Address> lstPro = baseService.findAllDeletedFalse(Pageable.unpaged()).getContent();
        lst = lstPro.stream().map(entity -> mapper.map(entity, AddressDto.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }


    @PostMapping()
    public ResponseEntity<ResponseObject> save(@RequestBody AddressDto addressDto){
        return baseService.createNew(mapper.map(addressDto, Address.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> delete( @PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return baseService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> update(@RequestBody AddressDto addressDto, @PathVariable("id") Long id){
        System.out.println("Update ID: " + id);
        Address address = null;
        Optional<Address>  otp = baseService.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, addressDto), HttpStatus.BAD_REQUEST);
        }

        if (otp.isPresent()){
            address = baseService.findById(id).orElseThrow(IllegalArgumentException::new);
            address = mapper.map(addressDto, Address.class);
            address.setId(id);
            return baseService.update(address);
        }
        return new ResponseEntity<>(new ResponseObject("Fail", "Không Thế Update", 1, addressDto), HttpStatus.BAD_REQUEST);


    }
}

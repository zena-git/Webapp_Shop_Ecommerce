package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.BillDetailsDto;
import com.example.webapp_shop_ecommerce.entity.BillDetails;
import com.example.webapp_shop_ecommerce.response.ResponseObject;
import com.example.webapp_shop_ecommerce.service.IBaseService;
import com.example.webapp_shop_ecommerce.service.IBillDetailsService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/billDetails")
public class BillDetailsController {

    @Autowired
    private ModelMapper mapper;
    private final IBaseService<BillDetails, Long> baseService;
    @Autowired
    public BillDetailsController(IBaseService<BillDetails, Long> baseService) {
        this.baseService = baseService;
    }

    @Autowired
    private IBillDetailsService billDetailsService;

    @GetMapping
    public ResponseEntity<List<BillDetailsDto>> findProductAll(){
        List<BillDetailsDto> lst = new ArrayList<>();
        List<BillDetails> lstPro = baseService.findAllDeletedFalse(Pageable.unpaged()).getContent();
        lst = lstPro.stream().map(entity -> mapper.map(entity, BillDetailsDto.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<ResponseObject> saveProduct(@RequestBody BillDetailsDto billDetailsDto){
        return baseService.createNew(mapper.map(billDetailsDto, BillDetails.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteProduct( @PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return baseService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateProduct(@RequestBody BillDetailsDto billDetailsDto, @PathVariable("id") Long id){
        System.out.println("Update ID: " + id);
        BillDetails billDetails = null;
        Optional<BillDetails>  otp = baseService.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, billDetailsDto), HttpStatus.BAD_REQUEST);
        }
        if (otp.isPresent()){
            billDetails = baseService.findById(id).orElseThrow(IllegalArgumentException::new);
            billDetails = mapper.map(billDetailsDto, BillDetails.class);
            billDetails.setId(id);
            return baseService.update(billDetails);
        }
        return new ResponseEntity<>(new ResponseObject("Fail", "Không Thế Update", 1, billDetailsDto), HttpStatus.BAD_REQUEST);
    }
}

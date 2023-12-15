package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.bill.BillDto;
import com.example.webapp_shop_ecommerce.entity.Bill;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.service.IBaseService;
import com.example.webapp_shop_ecommerce.service.IBillService;
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
@RequestMapping("/api/v1/bill")
public class BillController {

    @Autowired
    private ModelMapper mapper;
    private final IBaseService<Bill, Long> baseService;
    @Autowired
    private IBillService BillService;
    @Autowired
    public BillController(IBaseService<Bill, Long> baseService) {
        this.baseService = baseService;
    }


    @GetMapping
    public ResponseEntity<List<BillDto>> findProductAll(){
        List<BillDto> lst = new ArrayList<>();
        List<Bill> lstPro = baseService.findAllDeletedFalse(Pageable.unpaged()).getContent();
        lst = lstPro.stream().map(entity -> mapper.map(entity, BillDto.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<ResponseObject> saveProduct(@RequestBody BillDto billDto){
        return baseService.createNew(mapper.map(billDto, Bill.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteProduct( @PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return baseService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateProduct(@RequestBody BillDto billDto, @PathVariable("id") Long id){
        System.out.println("Update ID: " + id);
        Bill bill = null;
        Optional<Bill>  otp = baseService.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, billDto), HttpStatus.BAD_REQUEST);
        }

        if (otp.isPresent()){
            bill = baseService.findById(id).orElseThrow(IllegalArgumentException::new);
            bill = mapper.map(billDto, Bill.class);
            bill.setId(id);
            return baseService.update(bill);
        }
        return new ResponseEntity<>(new ResponseObject("Fail", "Không Thế Update", 1, billDto), HttpStatus.BAD_REQUEST);


    }
}

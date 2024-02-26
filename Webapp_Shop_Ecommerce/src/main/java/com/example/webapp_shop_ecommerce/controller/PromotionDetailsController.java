package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.promotionDetials.PromotionDetailsRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.promotionDetails.PromotionDetailsResponse;
import com.example.webapp_shop_ecommerce.entity.PromotionDetails;
import com.example.webapp_shop_ecommerce.service.IPromotionDetailsService;
import com.example.webapp_shop_ecommerce.service.IPromotionDetailsService;
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
@RequestMapping("/api/v1/promotionDetails")
public class PromotionDetailsController {

    @Autowired
    private ModelMapper mapper;
    @Autowired
    private IPromotionDetailsService PromotionDetailsService;

   

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
        List<PromotionDetails> lstEty = PromotionDetailsService.findAllDeletedFalse(pageable).getContent();
        List<PromotionDetailsResponse> lst  = lstEty.stream().map(entity -> mapper.map(entity, PromotionDetailsResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findObjById(@PathVariable("id") Long id) {
        Optional<PromotionDetails> otp = PromotionDetailsService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        PromotionDetailsResponse obj = otp.map(pro -> mapper.map(pro, PromotionDetailsResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<ResponseObject> save(@RequestBody PromotionDetailsRequest objDto){
        return PromotionDetailsService.createNew(mapper.map(objDto, PromotionDetails.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> delete( @PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return PromotionDetailsService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> update(@RequestBody PromotionDetailsRequest objDto, @PathVariable("id") Long id){
        System.out.println("Update ID: " + id);
        PromotionDetails obj = null;
        Optional<PromotionDetails>  otp = PromotionDetailsService.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, objDto), HttpStatus.BAD_REQUEST);
        }

        if (otp.isPresent()){
            obj = PromotionDetailsService.findById(id).orElseThrow(IllegalArgumentException::new);
            obj = mapper.map(objDto, PromotionDetails.class);
            obj.setId(id);
            return PromotionDetailsService.update(obj);

        }

        return new ResponseEntity<>(new ResponseObject("Fail", "Không Thế Update", 1, objDto), HttpStatus.BAD_REQUEST);


    }
}

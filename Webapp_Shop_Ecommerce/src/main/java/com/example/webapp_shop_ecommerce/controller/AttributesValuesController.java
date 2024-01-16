package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.attributesvalues.AttributesValuesRequest;
import com.example.webapp_shop_ecommerce.dto.response.attributesvalues.AttributesValuesResponse;
import com.example.webapp_shop_ecommerce.dto.response.bill.BillResponse;
import com.example.webapp_shop_ecommerce.entity.AttributesValues;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Bill;
import com.example.webapp_shop_ecommerce.service.IAttributesValueService;
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

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/attributesValues")
public class AttributesValuesController {
    @Autowired
    private ModelMapper mapper;
    @Autowired
    private IAttributesValueService attributesValuesService;
  
    @GetMapping()
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
        List<AttributesValues> result = attributesValuesService.findAllDeletedFalse(pageable).getContent();
        List<AttributesValuesResponse> resultDto = result.stream().map(attr -> mapper.map(attr, AttributesValuesResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> findObjById(@PathVariable("id") Long id) {
        Optional<AttributesValues> otp = attributesValuesService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        AttributesValuesResponse attributesValues = otp.map(pro -> mapper.map(pro, AttributesValuesResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(attributesValues, HttpStatus.OK);
    }
    @PostMapping()
    public ResponseEntity<ResponseObject> add(@RequestBody AttributesValuesRequest attributesValuesDto){
        Optional<AttributesValues> opt = attributesValuesService.findByName(attributesValuesDto.getName());
//        if (opt.isPresent()) {
//            return new ResponseEntity<>(new ResponseObject("Fail", "Tên thuộc tính đã tồn tại", 1, attributesValuesDto), HttpStatus.BAD_REQUEST);
//        }
        AttributesValues attributesValues = mapper.map(attributesValuesDto, AttributesValues.class);
        return attributesValuesService.createNew(attributesValues);

    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> update(@RequestBody AttributesValuesRequest attributesValuesDto, @PathVariable("id") Long id){
        Optional<AttributesValues> opt = attributesValuesService.findById(id);
        if (opt.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Tìm Thấy ID", 1, attributesValuesDto), HttpStatus.BAD_REQUEST);
        }
        if (attributesValuesService.findByName(attributesValuesDto.getName()).isPresent()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Tên thuộc tính đã tồn tại", 1, attributesValuesDto), HttpStatus.BAD_REQUEST);
        }

        if (opt.isPresent()){
            AttributesValues attributesValues = attributesValuesService.findById(id).orElseThrow(IllegalArgumentException::new);
            mapper.map(attributesValues, attributesValuesDto);
            attributesValues.setName(attributesValuesDto.getName());
            attributesValues.setId(id);
            return attributesValuesService.update(attributesValues);
        }
        return new ResponseEntity<>(new ResponseObject("Fail", "Không Thế Update", 1, attributesValuesDto), HttpStatus.BAD_REQUEST);

    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> delete(@PathVariable Long id){

        return attributesValuesService.delete(id);
    }
}

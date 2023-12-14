package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.AttributesValuesDto;
import com.example.webapp_shop_ecommerce.entity.AttributesValues;
import com.example.webapp_shop_ecommerce.response.ResponseObject;
import com.example.webapp_shop_ecommerce.service.IAttributesValueService;
import com.example.webapp_shop_ecommerce.service.IBaseService;
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

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/attributesValues")
public class AttributesValuesController {
    @Autowired
    private ModelMapper mapper;
    private final IBaseService<AttributesValues, Long> baseService;
    @Autowired
    private IAttributesValueService attributesValuesService;
    @Autowired
    public AttributesValuesController(IBaseService<AttributesValues, Long> baseService) {
        this.baseService = baseService;
    }

    @GetMapping()
    public ResponseEntity<List<AttributesValuesDto>> findAll(){
//        List<AttributesValues> result = baseService.findAll(null, Pageable.unpaged()).getContent();
        List<AttributesValues> result = baseService.findAllDeletedFalse( Pageable.unpaged()).getContent();
        List<AttributesValuesDto> resultDto = result.stream().map(attr -> mapper.map(attr, AttributesValuesDto.class)).collect(Collectors.toList());
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<ResponseObject> add(@RequestBody AttributesValuesDto attributesValuesDto){
        Optional<AttributesValues> opt = attributesValuesService.findByName(attributesValuesDto.getName());
//        if (opt.isPresent()) {
//            return new ResponseEntity<>(new ResponseObject("Fail", "Tên thuộc tính đã tồn tại", 1, attributesValuesDto), HttpStatus.BAD_REQUEST);
//        }
        AttributesValues attributesValues = mapper.map(attributesValuesDto, AttributesValues.class);
        return baseService.createNew(attributesValues);

    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> update(@RequestBody AttributesValuesDto attributesValuesDto, @PathVariable("id") Long id){
        Optional<AttributesValues> opt = baseService.findById(id);
        if (opt.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Tìm Thấy ID", 1, attributesValuesDto), HttpStatus.BAD_REQUEST);
        }
        if (attributesValuesService.findByName(attributesValuesDto.getName()).isPresent()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Tên thuộc tính đã tồn tại", 1, attributesValuesDto), HttpStatus.BAD_REQUEST);
        }

        if (opt.isPresent()){
            AttributesValues attributesValues = baseService.findById(id).orElseThrow(IllegalArgumentException::new);
            mapper.map(attributesValues, attributesValuesDto);
            attributesValues.setName(attributesValuesDto.getName());
            attributesValues.setId(id);
            return baseService.update(attributesValues);
        }
        return new ResponseEntity<>(new ResponseObject("Fail", "Không Thế Update", 1, attributesValuesDto), HttpStatus.BAD_REQUEST);

    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> delete(@PathVariable Long id){

        return baseService.delete(id);
    }
}

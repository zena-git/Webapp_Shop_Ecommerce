package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.attributes.AttributesRequest;
import com.example.webapp_shop_ecommerce.dto.response.attributes.AttributesResponse;
import com.example.webapp_shop_ecommerce.dto.response.attributesvalues.AttributesValuesResponse;
import com.example.webapp_shop_ecommerce.entity.Attributes;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.AttributesValues;
import com.example.webapp_shop_ecommerce.service.IBaseService;
import com.example.webapp_shop_ecommerce.service.Impl.AttributesServiceImpl;
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
@RequestMapping("/api/v1/attributes")
public class AttributesController {
    @Autowired
    private ModelMapper mapper;
    @Autowired
    private AttributesServiceImpl attributesService;



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
        List<Attributes> attributes = attributesService.findAllDeletedFalse(pageable).getContent();
        List<AttributesResponse> attributesRequest = attributes.stream().map(attr -> mapper.map(attr, AttributesResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(attributesRequest, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findObjById(@PathVariable("id") Long id) {
        Optional<Attributes> otp = attributesService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        AttributesResponse attributes = otp.map(pro -> mapper.map(pro, AttributesResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(attributes, HttpStatus.OK);
    }
    @PostMapping()
    public ResponseEntity<ResponseObject> add(@RequestBody AttributesRequest attributesRequest){

        Optional<Attributes> opt = attributesService.findByName(attributesRequest.getName());
        if (opt.isPresent()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Tên thuộc tính đã tồn tại", 1, attributesRequest), HttpStatus.BAD_REQUEST);
        }
        Attributes attributes = mapper.map(attributesRequest, Attributes.class);
        return attributesService.createNew(attributes);

    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> update(@RequestBody AttributesRequest attributesRequest, @PathVariable Long id){
        Optional<Attributes> opt = attributesService.findById(id);
        if (opt.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Tìm Thấy ID", 1, attributesRequest), HttpStatus.BAD_REQUEST);
        }

        if (attributesService.findByName(attributesRequest.getName()).isPresent()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Tên thuộc tính đã tồn tại", 1, attributesRequest), HttpStatus.BAD_REQUEST);
        }

        Attributes attributes = opt.get();
        attributes.setName(attributesRequest.getName());
        return attributesService.update(attributes);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> delete(@PathVariable Long id){
        return attributesService.delete(id);
    }


}

package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.attributes.AttributesRequest;
import com.example.webapp_shop_ecommerce.entity.Attributes;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.service.IBaseService;
import com.example.webapp_shop_ecommerce.service.Impl.AttributesServiceImpl;
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
@RequestMapping("/api/v1/attributes")
public class AttributesController {
    @Autowired
    private ModelMapper mapper;
    private final IBaseService<Attributes, Long> attributesService;
    @Autowired
    private AttributesServiceImpl attributesServiceImpl;

    @Autowired
    public AttributesController(IBaseService<Attributes, Long> attributesService) {
        this.attributesService = attributesService;
    }

    @GetMapping
    public ResponseEntity<List<AttributesRequest>> findAll(){

//        List<Attributes> attributes = attributesService.findAll(null, Pageable.unpaged()).getContent();
        List<Attributes> attributes = attributesService.findAllDeletedFalse( Pageable.unpaged()).getContent();
        List<AttributesRequest> attributesRequest = attributes.stream().map(attr -> mapper.map(attr, AttributesRequest.class)).collect(Collectors.toList());
        return new ResponseEntity<>(attributesRequest, HttpStatus.OK);
    }
    @PostMapping()
    public ResponseEntity<ResponseObject> add(@RequestBody AttributesRequest attributesRequest){

        Optional<Attributes> opt = attributesServiceImpl.findByName(attributesRequest.getName());
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

        if (attributesServiceImpl.findByName(attributesRequest.getName()).isPresent()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Tên thuộc tính đã tồn tại", 1, attributesRequest), HttpStatus.BAD_REQUEST);
        }

        //        Attributes attributes = mapper.map(attributesDto, Attributes.class);
        Attributes attributes = opt.get();
//        attributes.setId(id);
        attributes.setName(attributesRequest.getName());
        return attributesService.update(attributes);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> delete(@PathVariable Long id){
        return attributesService.delete(id);
    }


}

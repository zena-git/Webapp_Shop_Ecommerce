package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.brand.BrandRequest;
import com.example.webapp_shop_ecommerce.dto.response.brand.BrandResponse;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Brand;
import com.example.webapp_shop_ecommerce.service.Impl.BrandServiceImpl;
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

@RestController
@RequestMapping("/api/v1/brand")
public class BrandController {
    @Autowired
    private ModelMapper mapper;
    @Autowired
    private BrandServiceImpl brandService;



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
        List<Brand> brand = brandService.findAllDeletedFalse(pageable).getContent();
        List<BrandResponse> result = brand.stream().map(attr -> mapper.map(attr, BrandResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findObjById(@PathVariable("id") Long id) {
        Optional<Brand> otp = brandService.findById(id);
        Boolean check = brandService.existsById(id);
        System.out.println(check);

        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        BrandResponse brand = otp.map(pro -> mapper.map(pro, BrandResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(brand, HttpStatus.OK);
    }
    @PostMapping()
    public ResponseEntity<ResponseObject> add(@RequestBody BrandRequest BrandRequest){

        Optional<Brand> opt = brandService.findByName(BrandRequest.getName());
        if (opt.isPresent()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Tên thuộc tính đã tồn tại", 1, BrandRequest), HttpStatus.BAD_REQUEST);
        }
        Brand brand = mapper.map(BrandRequest, Brand.class);
        return brandService.createNew(brand);

    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> update(@RequestBody BrandRequest BrandRequest, @PathVariable Long id){
        Optional<Brand> opt = brandService.findById(id);
        if (opt.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Tìm Thấy ID", 1, BrandRequest), HttpStatus.BAD_REQUEST);
        }

        if (brandService.findByName(BrandRequest.getName()).isPresent()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Tên thuộc tính đã tồn tại", 1, BrandRequest), HttpStatus.BAD_REQUEST);
        }

        Brand brand = opt.get();
        brand.setName(BrandRequest.getName());
        return brandService.update(brand);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> delete(@PathVariable Long id){
        return brandService.delete(id);
    }


}

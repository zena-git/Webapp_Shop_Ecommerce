package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.color.ColorRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.color.ColorResponse;
import com.example.webapp_shop_ecommerce.entity.Color;
import com.example.webapp_shop_ecommerce.entity.Material;
import com.example.webapp_shop_ecommerce.service.Impl.ColorServiceImpl;
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
@RequestMapping("/api/v1/color")
public class ColorController {
    @Autowired
    private ModelMapper mapper;
    @Autowired
    private ColorServiceImpl colorService;



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
        List<Color> color = colorService.findAllDeletedFalse(pageable).getContent();
        List<ColorResponse> result = color.stream().map(attr -> mapper.map(attr, ColorResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findObjById(@PathVariable("id") Long id) {
        Optional<Color> otp = colorService.findById(id);
        Boolean check = colorService.existsById(id);
        System.out.println(check);

        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        ColorResponse brand = otp.map(pro -> mapper.map(pro, ColorResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(brand, HttpStatus.OK);
    }
    @PostMapping()
    public ResponseEntity<ResponseObject> add(@RequestBody ColorRequest colorRequest){

        Optional<Color> opt = colorService.findByName(colorRequest.getName());
        if (opt.isPresent()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Tên thuộc tính đã tồn tại", 1, colorRequest), HttpStatus.BAD_REQUEST);
        }
        Color color = mapper.map(colorRequest, Color.class);
        return colorService.createNew(color);

    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> update(@RequestBody ColorRequest ColorRequest, @PathVariable Long id){
        Optional<Color> opt = colorService.findById(id);
        if (opt.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Tìm Thấy ID", 1, ColorRequest), HttpStatus.BAD_REQUEST);
        }

        if (colorService.findByName(ColorRequest.getName()).isPresent()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Tên thuộc tính đã tồn tại", 1, ColorRequest), HttpStatus.BAD_REQUEST);
        }

        Color color = opt.get();
        color.setName(ColorRequest.getName());
        return colorService.update(color);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> delete(@PathVariable Long id){
        return colorService.delete(id);
    }


}

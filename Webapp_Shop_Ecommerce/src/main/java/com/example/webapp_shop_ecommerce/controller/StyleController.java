package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.style.StyleRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.style.StyleResponse;
import com.example.webapp_shop_ecommerce.entity.Style;
import com.example.webapp_shop_ecommerce.service.Impl.StyleServiceImpl;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/style")
public class StyleController {
    @Autowired
    private ModelMapper mapper;
    @Autowired
    private StyleServiceImpl styleService;



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
        List<Style> style = styleService.findAllDeletedFalse(pageable).getContent();
        List<StyleResponse> result = style.stream().map(attr -> mapper.map(attr, StyleResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findObjById(@PathVariable("id") Long id) {
        Optional<Style> otp = styleService.findById(id);

        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        StyleResponse style = otp.map(pro -> mapper.map(pro, StyleResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(style, HttpStatus.OK);
    }
    @PostMapping()
    public ResponseEntity<ResponseObject> add(@Valid @RequestBody StyleRequest styleRequest, BindingResult result){
        if (result.hasErrors()) {
            // Xử lý lỗi validate ở đây
            StringBuilder errors = new StringBuilder();
            for (FieldError error : result.getFieldErrors()) {
                errors.append(error.getDefaultMessage()).append("\n");
            }
            // Xử lý lỗi validate ở đây, ví dụ: trả về ResponseEntity.badRequest()
            return new ResponseEntity<>(new ResponseObject("error", errors.toString(), 1, styleRequest), HttpStatus.BAD_REQUEST);
        }
        Optional<Style> opt = styleService.findByName(styleRequest.getName());
        if (opt.isPresent()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Tên thuộc tính đã tồn tại", 1, styleRequest), HttpStatus.BAD_REQUEST);
        }
        Style style = mapper.map(styleRequest, Style.class);
        return styleService.createNew(style);

    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> update(@Valid @RequestBody StyleRequest styleRequest, @PathVariable Long id, BindingResult result){

        if (result.hasErrors()) {
            // Xử lý lỗi validate ở đây
            StringBuilder errors = new StringBuilder();
            for (FieldError error : result.getFieldErrors()) {
                errors.append(error.getDefaultMessage()).append("\n");
            }
            // Xử lý lỗi validate ở đây, ví dụ: trả về ResponseEntity.badRequest()
            return new ResponseEntity<>(new ResponseObject("error", errors.toString(), 1, styleRequest), HttpStatus.BAD_REQUEST);
        }
        Optional<Style> opt = styleService.findById(id);
        if (opt.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Tìm Thấy ID", 1, styleRequest), HttpStatus.BAD_REQUEST);
        }

        if (styleService.findByName(styleRequest.getName()).isPresent()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Tên thuộc tính đã tồn tại", 1, styleRequest), HttpStatus.BAD_REQUEST);
        }

        Style style = opt.get();
        style.setName(styleRequest.getName());
        return styleService.update(style);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> delete(@PathVariable Long id){
        return styleService.delete(id);
    }


}

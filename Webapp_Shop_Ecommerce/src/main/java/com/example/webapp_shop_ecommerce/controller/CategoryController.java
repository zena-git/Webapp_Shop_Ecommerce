package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.categories.CategoryRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.categories.CategoryResponse;
import com.example.webapp_shop_ecommerce.dto.response.customer.CustomerResponse;
import com.example.webapp_shop_ecommerce.entity.Category;
import com.example.webapp_shop_ecommerce.entity.Customer;
import com.example.webapp_shop_ecommerce.service.ICategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/category")
public class CategoryController {

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private ICategoryService categoryService;

    @GetMapping
    public ResponseEntity<?> findCategoryAll(
            @RequestParam(value = "page", defaultValue = "-1") Integer page,
            @RequestParam(value = "size", defaultValue = "-1") Integer size) {
        Pageable pageable = Pageable.unpaged();
        if (size < 0) {
            size = 5;
        }
        if (page >= 0) {
            pageable = PageRequest.of(page, size);
        }
        System.out.println("page=" + page + " size=" + size);
        List<Category> lstPro = categoryService.findAllDeletedFalse(pageable).getContent();
        List<CategoryResponse> resultDto = lstPro.stream().map(pro -> mapper.map(pro, CategoryResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> findObjById(@PathVariable("id") Long id) {
        Optional<Category> otp = categoryService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        CategoryResponse category = otp.map(pro -> mapper.map(pro, CategoryResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }
    @PostMapping()
    public ResponseEntity<ResponseObject> saveCategory(@RequestBody CategoryRequest categoryRequest) {
        Optional<Category> otp = categoryService.findByName(categoryRequest.getName());
        if (otp.isPresent()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Tên sản phẩm đã tồn tại", 1, categoryRequest), HttpStatus.BAD_REQUEST);
        }

        return categoryService.createNew(mapper.map(categoryRequest, Category.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteCategory(@PathVariable("id") Long id) {
        System.out.println("Delete ID: " + id);
        return categoryService.delete(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateCategory(@RequestBody CategoryRequest categoryRequest, @PathVariable("id") Long id) {
        System.out.println("Update ID: " + id);
        Category Category = null;
        Optional<Category> otp = categoryService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, categoryRequest), HttpStatus.BAD_REQUEST);
        }

        if (categoryService.findByName(categoryRequest.getName()).isPresent()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Tên Thể Loại đã tồn tại", 1, categoryRequest), HttpStatus.BAD_REQUEST);
        }
        if (otp.isPresent()) {
            Category = otp.get();
            Category = mapper.map(categoryRequest, Category.class);
//            Category.setCodeCategory(otp.get().getCodeCategory());
            return categoryService.update(Category);
        }
        return new ResponseEntity<>(new ResponseObject("Fail", "Không Thế Update", 1, categoryRequest), HttpStatus.BAD_REQUEST);


    }
}

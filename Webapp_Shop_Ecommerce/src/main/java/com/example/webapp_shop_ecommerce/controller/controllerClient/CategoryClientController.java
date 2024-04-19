package com.example.webapp_shop_ecommerce.controller.controllerClient;

import com.example.webapp_shop_ecommerce.dto.response.categories.CategoryResponse;
import com.example.webapp_shop_ecommerce.entity.Category;
import com.example.webapp_shop_ecommerce.service.ICategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v2/category")
public class CategoryClientController {
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
}

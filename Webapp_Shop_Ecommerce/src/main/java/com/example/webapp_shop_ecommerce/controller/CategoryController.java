package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.CategoryDto;
import com.example.webapp_shop_ecommerce.entity.Category;
import com.example.webapp_shop_ecommerce.response.ResponseObject;
import com.example.webapp_shop_ecommerce.service.IBaseService;
import com.example.webapp_shop_ecommerce.service.ICategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
    private final IBaseService<Category, Long> baseService;
    @Autowired
    private ICategoryService CategoryService;
    @Autowired
    public CategoryController(IBaseService<Category, Long> baseService) {
        this.baseService = baseService;
    }
    @GetMapping
    public ResponseEntity<List<CategoryDto>> findCategoryAll(){
        List<CategoryDto> lst = new ArrayList<>();
        List<Category> lstPro = baseService.findAllDeletedFalse(Pageable.unpaged()).getContent();
        lst = lstPro.stream().map(pro -> mapper.map(pro, CategoryDto.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<ResponseObject> saveCategory(@RequestBody CategoryDto categoryDto){
        Optional<Category> otp = CategoryService.findByName(categoryDto.getName());
        if (otp.isPresent()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Tên sản phẩm đã tồn tại", 1, categoryDto), HttpStatus.BAD_REQUEST);
        }

//        Optional<Category> otp2 = CategoryService.findByCodeCategory(CategoryDto.getCodeCategory());
//        if (otp2.isPresent()){
//            return new ResponseEntity<>(new ResponseObject("Fail", "Code sản phẩm đã tồn tại", 1, CategoryDto), HttpStatus.BAD_REQUEST);
//        }
        return baseService.createNew(mapper.map(categoryDto, Category.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteCategory(@PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return baseService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateCategory(@RequestBody CategoryDto categoryDto, @PathVariable("id") Long id){
        System.out.println("Update ID: " + id);
        Category Category = null;
        Optional<Category>  otp = baseService.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, categoryDto), HttpStatus.BAD_REQUEST);
        }

        if (CategoryService.findByName(categoryDto.getName()).isPresent()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Tên Thể Loại đã tồn tại", 1, categoryDto), HttpStatus.BAD_REQUEST);
        }
        if (otp.isPresent()){
            Category = otp.get();
            Category = mapper.map(categoryDto, Category.class);
//            Category.setCodeCategory(otp.get().getCodeCategory());
            return baseService.update(Category);
        }
        return new ResponseEntity<>(new ResponseObject("Fail", "Không Thế Update", 1, categoryDto), HttpStatus.BAD_REQUEST);


    }
}

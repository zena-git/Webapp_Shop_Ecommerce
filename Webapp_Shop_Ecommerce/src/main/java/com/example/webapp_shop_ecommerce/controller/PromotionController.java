package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.promotion.PromotionRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.promotion.PromotionResponse;
import com.example.webapp_shop_ecommerce.entity.Promotion;
import com.example.webapp_shop_ecommerce.service.IPromotionService;
import com.example.webapp_shop_ecommerce.service.Impl.PromotionServiceImpl;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/promotion")
public class PromotionController {

    @Autowired
    private ModelMapper mapper;
    @Autowired
    private IPromotionService promotionService;
   

    @GetMapping
    public ResponseEntity<?> findAll(
            @RequestParam(value = "page", defaultValue = "-1") Integer page,
            @RequestParam(value = "size", defaultValue = "-1") Integer size,
            @RequestParam(value = "search", defaultValue = "") String search,
            @RequestParam(value = "status", defaultValue = "") String status
            ) {

        Map<String, String> keyWork = new HashMap<String, String>();
        keyWork.put("search", search);
        keyWork.put("status", status);

        Pageable pageable = Pageable.unpaged();
        if (size < 0) {
            size = 5;
        }

        if (page >= 0) {
            pageable = PageRequest.of(page, size);
        }
        List<Promotion> lstEty = promotionService.findPromotionByKeyWorkAndDeletedFalse(pageable,keyWork).getContent();
        List<PromotionResponse> lst  = lstEty.stream().map(entity -> mapper.map(entity, PromotionResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findObjById(@PathVariable("id") Long id) {
        Optional<Promotion> otp = promotionService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        PromotionResponse obj = otp.map(pro -> mapper.map(pro, PromotionResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<ResponseObject> save(@Valid @RequestBody PromotionRequest objDto, BindingResult result){
        if (result.hasErrors()) {
            // Xử lý lỗi validate ở đây
            StringBuilder errors = new StringBuilder();
            for (FieldError error : result.getFieldErrors()) {
                errors.append(error.getDefaultMessage()).append("\n");
            }
            // Xử lý lỗi validate ở đây, ví dụ: trả về ResponseEntity.badRequest()
            return new ResponseEntity<>(new ResponseObject("error", errors.toString(), 1, objDto), HttpStatus.BAD_REQUEST);
        }

        return promotionService.save(objDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> delete( @PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return promotionService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> update(@Valid @RequestBody PromotionRequest objDto, BindingResult result, @PathVariable("id") Long id){
        if (result.hasErrors()) {
            // Xử lý lỗi validate ở đây
            StringBuilder errors = new StringBuilder();
            for (FieldError error : result.getFieldErrors()) {
                errors.append(error.getDefaultMessage()).append("\n");
            }
            // Xử lý lỗi validate ở đây, ví dụ: trả về ResponseEntity.badRequest()
            return new ResponseEntity<>(new ResponseObject("error", errors.toString(), 1, objDto), HttpStatus.BAD_REQUEST);
        }
        return promotionService.update(objDto,id);
    }
}

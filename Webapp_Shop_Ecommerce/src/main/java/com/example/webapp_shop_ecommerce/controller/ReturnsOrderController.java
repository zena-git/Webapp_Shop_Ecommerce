package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.billdetails.BillDetailsRequest;
import com.example.webapp_shop_ecommerce.dto.request.brand.BrandRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.brand.BrandResponse;
import com.example.webapp_shop_ecommerce.entity.Brand;
import com.example.webapp_shop_ecommerce.service.Impl.BrandServiceImpl;
import com.example.webapp_shop_ecommerce.service.Impl.ReturnsOrderService;
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
@RequestMapping("/api/v1/returnsOrder")
public class ReturnsOrderController {
    @Autowired
    private ModelMapper mapper;
    @Autowired
    private ReturnsOrderService returnsOrderService;
    @PostMapping("/bill/{billId}/billDetails/{billDetailsId}")
    public ResponseEntity<?> returnOrder(@RequestBody BillDetailsRequest billDetailsRequest, @PathVariable("billId") Long billId, @PathVariable("billDetailsId") Long billDetailsId) {

        return returnsOrderService.returnOrderOne(billDetailsRequest, billId, billDetailsId);
    }


}

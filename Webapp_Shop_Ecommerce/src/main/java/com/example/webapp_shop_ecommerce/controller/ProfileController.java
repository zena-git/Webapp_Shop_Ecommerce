package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.customer.CustomerRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.customer.CustomerResponse;
import com.example.webapp_shop_ecommerce.dto.response.user.UserResponse;
import com.example.webapp_shop_ecommerce.entity.Customer;
import com.example.webapp_shop_ecommerce.entity.Users;
import com.example.webapp_shop_ecommerce.infrastructure.security.Authentication;
import com.example.webapp_shop_ecommerce.service.ICustomerService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {
    @Autowired
    private Authentication authentication;
    @Autowired
    private ModelMapper mapper;

    @GetMapping()
    public ResponseEntity<?> findAll() {
        Users entity = authentication.getUsers();
         return new ResponseEntity<>(mapper.map(entity, UserResponse.class), HttpStatus.OK);
    }


}

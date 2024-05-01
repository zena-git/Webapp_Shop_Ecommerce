package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.dto.request.authentication.AuthenticationRegisterRequest;
import com.example.webapp_shop_ecommerce.dto.request.authentication.AuthenticationRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Users;
import org.springframework.http.ResponseEntity;

public interface IAuthenticationService {

    ResponseEntity<ResponseObject> authenticateAdmin(AuthenticationRequest request);
    ResponseEntity<ResponseObject> authenticateClient(AuthenticationRequest request);
    ResponseEntity<?> authenticateClientRegister(AuthenticationRegisterRequest request);
}

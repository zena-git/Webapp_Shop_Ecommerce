package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.authentication.AuthenticationRequest;
import com.example.webapp_shop_ecommerce.dto.response.authentication.AuthenticationResponse;
import com.example.webapp_shop_ecommerce.service.IAuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    @Autowired
    IAuthenticationService authenticationService;
    @PostMapping("/login")
    ResponseEntity<?> authenticate(@RequestBody AuthenticationRequest request) {
        return authenticationService.authenticateAdmin(request);
    }
}

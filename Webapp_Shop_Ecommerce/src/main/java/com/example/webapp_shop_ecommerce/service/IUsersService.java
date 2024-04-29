package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.dto.request.User.UserRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Users;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IUsersService extends IBaseService<Users, Long> {
    List<Users> findAllByDeletedAll();
    ResponseEntity<?> save(UserRequest request);

}

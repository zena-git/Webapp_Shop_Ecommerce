package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.entity.Users;

import java.util.List;

public interface IUsersService extends IBaseService<Users, Long> {
    List<Users> findAllByDeletedAll();
}

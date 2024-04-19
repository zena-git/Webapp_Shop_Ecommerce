package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.entity.Users;
import com.example.webapp_shop_ecommerce.repositories.IUsersRepository;
import com.example.webapp_shop_ecommerce.service.IUsersService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsersServiceImpl extends BaseServiceImpl<Users, Long, IUsersRepository> implements IUsersService {
    @Override
    public List<Users> findAllByDeletedAll() {
        return repository.findAllByDeletedAll();
    }
}

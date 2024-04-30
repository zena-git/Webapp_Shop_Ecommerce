package com.example.webapp_shop_ecommerce.infrastructure.security;

import com.example.webapp_shop_ecommerce.entity.Customer;
import com.example.webapp_shop_ecommerce.entity.Users;
import com.example.webapp_shop_ecommerce.repositories.ICustomerRepository;
import com.example.webapp_shop_ecommerce.repositories.IUsersRepository;
import com.example.webapp_shop_ecommerce.service.ICustomerService;
import com.example.webapp_shop_ecommerce.service.IUsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class Authentication {
    @Autowired
    ICustomerRepository customerRepository;

    @Autowired
    IUsersRepository usersRepository;
    public Customer getCustomer() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("--------------------------------");
        System.out.println(authentication);
        try {
            return customerRepository.findById(Long.valueOf(authentication.getName())).orElse(null);
        } catch (NumberFormatException e) {
            // Handle the case where authentication.getName() is not a valid Long
            return customerRepository.findById(Long.valueOf("1")).get();
        }
    }

    public Users getUsers() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication instanceof AnonymousAuthenticationToken)) {
            Users users = Users.builder().fullName("Admin system").build();
            return users;
        }
        try {
            return usersRepository.findById(Long.valueOf(authentication.getName())).orElse(Users.builder().fullName("Admin system").build());
        } catch (NumberFormatException e) {
            // Handle the case where authentication.getName() is not a valid Long
            return Users.builder().fullName("Admin system").build();
        }
    }
}

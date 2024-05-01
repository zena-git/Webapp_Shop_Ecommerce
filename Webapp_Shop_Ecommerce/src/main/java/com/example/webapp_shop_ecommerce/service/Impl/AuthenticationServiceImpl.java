package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.request.authentication.AuthenticationRegisterRequest;
import com.example.webapp_shop_ecommerce.dto.request.authentication.AuthenticationRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.authentication.AuthenticationResponse;
import com.example.webapp_shop_ecommerce.entity.Customer;
import com.example.webapp_shop_ecommerce.entity.Users;
import com.example.webapp_shop_ecommerce.jwt.JwtTokenProvider;
import com.example.webapp_shop_ecommerce.repositories.ICustomerRepository;
import com.example.webapp_shop_ecommerce.repositories.IUsersRepository;
import com.example.webapp_shop_ecommerce.service.IAuthenticationService;
import com.example.webapp_shop_ecommerce.service.ICustomerService;
import com.example.webapp_shop_ecommerce.service.IUsersService;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticationServiceImpl implements IAuthenticationService {

    @Autowired
    private JwtTokenProvider tokenProvider;
    @Autowired
    private IUsersRepository usersRepo;
    @Autowired
    private ICustomerRepository customerRepo;
    @Autowired
    ICustomerService customerService;
    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public ResponseEntity<ResponseObject> authenticateAdmin(AuthenticationRequest request) {
        Optional<Users> usersOptional = usersRepo.findByEmail(request.getEmail());
        if (usersOptional.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy Tài Khoản", 1, request), HttpStatus.BAD_REQUEST);
        }
        Users user = usersOptional.get();
        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated){
            return new ResponseEntity<>(new ResponseObject("error", "Mật khẩu không chính xác", 1, request), HttpStatus.BAD_REQUEST);
        }
        String token = tokenProvider.generateTokenUsers(user);

        return new ResponseEntity<>(new ResponseObject("success", "Thành công", 1, new AuthenticationResponse(token, authenticated)), HttpStatus.OK);

    }

    @Override
    public ResponseEntity<ResponseObject> authenticateClient(AuthenticationRequest request) {
        Optional<Customer> customerOptional = customerRepo.findByEmail(request.getEmail());
        if (customerOptional.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy Tài Khoản", 1, request), HttpStatus.BAD_REQUEST);
        }
        Customer customer = customerOptional.get();
        boolean authenticated = passwordEncoder.matches(request.getPassword(), customer.getPassword());
        System.out.println(authenticated);
        if (!authenticated){
            return new ResponseEntity<>(new ResponseObject("error", "Mật khẩu không chính xác", 1, request), HttpStatus.BAD_REQUEST);
        }
        String token = tokenProvider.generateTokenCustomer(customer);

        return new ResponseEntity<>(new ResponseObject("success", "Thành công", 1, new AuthenticationResponse(token, authenticated)), HttpStatus.OK);

    }

    @Override
    public ResponseEntity<?> authenticateClientRegister(AuthenticationRegisterRequest request) {
        if (customerRepo.existsByEmail(request.getEmail())){
            return new ResponseEntity<>(new ResponseObject("error", "Email đã có trong hệ thống. Hãy sử dụng email khác", 1, request), HttpStatus.BAD_REQUEST);
        }
        if (customerRepo.existsByPhone(request.getPhone())){
            return new ResponseEntity<>(new ResponseObject("error", "SĐT này đã có trong hệ thống.. Hãy sử dụng sđt khác", 1, request), HttpStatus.BAD_REQUEST);
        }

        return customerService.registerClient(request);
    }


}

package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.request.address.AddressRequest;
import com.example.webapp_shop_ecommerce.dto.request.authentication.AuthenticationRegisterRequest;
import com.example.webapp_shop_ecommerce.dto.request.customer.CustomerRequest;
import com.example.webapp_shop_ecommerce.dto.request.mail.MailInputDTO;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Address;
import com.example.webapp_shop_ecommerce.entity.Customer;
import com.example.webapp_shop_ecommerce.infrastructure.security.Authentication;
import com.example.webapp_shop_ecommerce.repositories.ICustomerRepository;
import com.example.webapp_shop_ecommerce.service.IClientService;
import com.example.webapp_shop_ecommerce.service.ICustomerService;
import com.example.webapp_shop_ecommerce.ultiltes.RandomStringGenerator;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

@Service
public class CustomnerServiceImpl extends BaseServiceImpl<Customer, Long, ICustomerRepository> implements ICustomerService {


    @Autowired
    private IClientService mailClientService;

    @Autowired
    private RandomStringGenerator randomStringGenerator;

    @Autowired
    private ModelMapper mapper;
    @Autowired
    private Authentication authentication;
    @Override
    public List<Customer> findByNameAndPhone(String keyWord) {
        return repository.findByNameAndPhone(keyWord);
    }

    @Override
    public Optional<Customer> findCustomerByIdAndAddressNotDeleted(Long id) {
        return repository.findCustomerByIdAndAddressNotDeleted(id);
    }

    @Override
    public  Optional<Customer> findByPhone(String phone){
        return repository.findCustomerByPhone(phone);
    }

    @Override
    public  Optional<Customer> findByEmail(String email){
        return repository.findCustomerByEmail(email);
    }

    @Override
    public Boolean updatePassword(Long id, String newPassword) {
        try {
            repository.updateCustomerPassword(id, newPassword);
            return true;
        }catch (Exception ex){
            return false;
        }
    }

    @Override
    public ResponseEntity<?> save(CustomerRequest request) {
        String password = randomStringGenerator.generateRandomString(6);

        // Lưu dữ liệu và thực hiện gửi email song song
        CompletableFuture<ResponseEntity<?>> saveTask = CompletableFuture.supplyAsync(() -> {
            Customer customer = new Customer();
            customer = mapper.map(request, Customer.class);
            customer.setDeleted(false);
            customer.setCreatedDate(LocalDateTime.now());
            customer.setLastModifiedDate(LocalDateTime.now());
            customer.setCreatedBy(authentication.getUsers().getFullName());
            customer.setLastModifiedBy(authentication.getUsers().getFullName());
            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
            customer.setPassword(passwordEncoder.encode(password));
            Customer customerReturn =  repository.save(customer);

//            Set<AddressRequest> lstAddressRequest = request.getLstAddress();
//            lstAddressRequest.forEach(addressRequest -> {
//                Address address = mapper.map(addressRequest, Address.class);
//                address.setId(null);
//                address.setCustomer(customerReturn);
//                addressService.createNew(address);
//            });

            return new ResponseEntity<>(new ResponseObject("success","Thêm Mới Thành công",0, request), HttpStatus.OK);
        });

        // Khi tiến trình lưu dữ liệu hoàn thành, thực hiện gửi email
        saveTask.thenAccept(resultEntity -> {
            if (resultEntity.getStatusCode() == HttpStatus.OK) {
                CompletableFuture.runAsync(() -> {
                    if (request.getEmail() != null) {
                        MailInputDTO mailInput = new MailInputDTO();
                        mailInput.setEmail(request.getEmail());
                        mailInput.setPassword(password);
                        mailInput.setName(request.getFullName());
                        mailClientService.create(mailInput);
                    }
                });
            }
        });

        return saveTask.join();
    }

    @Override
    public ResponseEntity<?> registerClient(AuthenticationRegisterRequest request) {
        // Lưu dữ liệu và thực hiện gửi email song song
        CompletableFuture<ResponseEntity<?>> saveTask = CompletableFuture.supplyAsync(() -> {
            Customer customer = new Customer();
            customer.setEmail(request.getEmail());
            customer.setPhone(request.getPhone());
            customer.setFullName(request.getCustomerName());
            customer.setBirthday(request.getBirthday());
            customer.setGender(request.getGender());
            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
            customer.setPassword(passwordEncoder.encode(request.getPassword()));
            createNew(customer);
            return new ResponseEntity<>(new ResponseObject("success","Tạo Tài Khoản Thành công",0, request), HttpStatus.OK);
        });

        // Khi tiến trình lưu dữ liệu hoàn thành, thực hiện gửi email
        saveTask.thenAccept(resultEntity -> {
            if (resultEntity.getStatusCode() == HttpStatus.OK) {
                CompletableFuture.runAsync(() -> {
                    if (request.getEmail() != null) {
                        MailInputDTO mailInput = new MailInputDTO();
                        mailInput.setEmail(request.getEmail());
                        mailInput.setPassword(request.getPassword());
                        mailInput.setName(request.getCustomerName());
                        mailClientService.create(mailInput);
                    }
                });
            }
        });

        return saveTask.join();
    }
}

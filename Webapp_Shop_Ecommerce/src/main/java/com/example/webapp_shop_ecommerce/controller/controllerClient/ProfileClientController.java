package com.example.webapp_shop_ecommerce.controller.controllerClient;

import com.example.webapp_shop_ecommerce.dto.request.customer.CustomerRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.bill.BillResponse;
import com.example.webapp_shop_ecommerce.dto.response.customer.CustomerResponse;
import com.example.webapp_shop_ecommerce.entity.Customer;
import com.example.webapp_shop_ecommerce.infrastructure.security.Authentication;
import com.example.webapp_shop_ecommerce.service.ICustomerService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v2/profile")
public class ProfileClientController {
    @Autowired
    private Authentication authentication;
    @Autowired
    private ModelMapper mapper;
    @Autowired
    private ICustomerService customerService;
    @GetMapping()
    public ResponseEntity<?> findAll() {
        Customer customer = authentication.getCustomer();
         return new ResponseEntity<>(mapper.map(customer, CustomerResponse.class), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@RequestBody CustomerRequest customerDto, @PathVariable("id") Long id){
        System.out.println("Update ID: " + id);
        Customer customer = null;
        Optional<Customer> otp = customerService.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, customerDto), HttpStatus.BAD_REQUEST);
        }

        if (otp.isPresent()){
            customer = customerService.findById(id).orElseThrow(IllegalArgumentException::new);
            customer = mapper.map(customerDto, Customer.class);
            customer.setId(id);
            return customerService.update(customer);
        }
        return new ResponseEntity<>(new ResponseObject("Fail", "Không Thế Update", 1, customerDto), HttpStatus.BAD_REQUEST);


    }
}

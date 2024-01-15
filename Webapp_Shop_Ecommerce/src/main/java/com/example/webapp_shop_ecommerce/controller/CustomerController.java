package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.customer.CustomerRequest;
import com.example.webapp_shop_ecommerce.entity.Customer;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.service.ICustomerService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/customer")
public class CustomerController {

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private ICustomerService customerService;

    @GetMapping
    public ResponseEntity<List<CustomerRequest>> findProductAll(){
        List<CustomerRequest> lst = new ArrayList<>();
        List<Customer> lstPro = customerService.findAllDeletedFalse(Pageable.unpaged()).getContent();
        lst = lstPro.stream().map(cto -> mapper.map(cto, CustomerRequest.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<ResponseObject> saveProduct(@RequestBody CustomerRequest CustomerDto){
        return customerService.createNew(mapper.map(CustomerDto, Customer.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteProduct( @PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return customerService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateProduct(@RequestBody CustomerRequest customerDto, @PathVariable("id") Long id){
        System.out.println("Update ID: " + id);
        Customer customer = null;
        Optional<Customer>  otp = customerService.findById(id);
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

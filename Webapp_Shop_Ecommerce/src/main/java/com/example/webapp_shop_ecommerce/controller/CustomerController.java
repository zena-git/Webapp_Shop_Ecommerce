package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.customer.CustomerRequest;
import com.example.webapp_shop_ecommerce.dto.request.mail.MailInputDTO;
import com.example.webapp_shop_ecommerce.dto.response.customer.CustomerAddressResponse;
import com.example.webapp_shop_ecommerce.dto.response.customer.CustomerResponse;
import com.example.webapp_shop_ecommerce.dto.response.historybill.HistoryBillResponse;
import com.example.webapp_shop_ecommerce.entity.Customer;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.HistoryBill;
import com.example.webapp_shop_ecommerce.repositories.ICustomerRepository;
import com.example.webapp_shop_ecommerce.service.IClientService;
import com.example.webapp_shop_ecommerce.service.ICustomerService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/customer")
public class CustomerController {

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private ICustomerService customerService;

    @Autowired
    private ICustomerRepository customerRepo;

    @GetMapping
    public ResponseEntity<?> findProductAll(@RequestParam(value = "page", defaultValue = "-1") Integer page,
                                            @RequestParam(value = "size", defaultValue = "-1") Integer size){
        Pageable pageable = Pageable.unpaged();
        if (size < 0) {
            size = 5;
        }
        if (page >= 0) {
            pageable = PageRequest.of(page, size);
        }
        System.out.println("page=" + page + " size=" + size);
        List<Customer> lstPro = customerService.findAllDeletedFalse(pageable).getContent();
        List<CustomerResponse> resultDto = lstPro.stream().map(cto -> mapper.map(cto, CustomerResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
    @GetMapping("/search")
    public ResponseEntity<?> findCustomerSearch(@RequestParam(value = "keyWord", defaultValue = "") String keyWord ){

        List<Customer> lstPro = customerService.findByNameAndPhone(keyWord);
        List<CustomerResponse> resultDto = lstPro.stream().map(cto -> mapper.map(cto, CustomerResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findObjById(@PathVariable("id") Long id) {
        Optional<Customer> otp = customerService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        CustomerAddressResponse customer = otp.map(pro -> mapper.map(pro, CustomerAddressResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }
    @PostMapping()
    public ResponseEntity<?> saveProduct(@Valid @RequestBody CustomerRequest CustomerDto, BindingResult result){

        if (result.hasErrors()) {
            // Xử lý lỗi validate ở đây
            StringBuilder errors = new StringBuilder();
            for (FieldError error : result.getFieldErrors()) {
                errors.append(error.getDefaultMessage()).append("\n");
            }
            // Xử lý lỗi validate ở đây, ví dụ: trả về ResponseEntity.badRequest()
            return new ResponseEntity<>(new ResponseObject("error", errors.toString(), 1, CustomerDto), HttpStatus.BAD_REQUEST);
        }
        if (customerRepo.existsByEmail(CustomerDto.getEmail())) {
            return new ResponseEntity<>(new ResponseObject("error", "Email đã có trong hệ thống. Hãy sử dụng email khác", 1, CustomerDto), HttpStatus.BAD_REQUEST);
        }
        if (customerRepo.existsByPhone(CustomerDto.getPhone())) {
            return new ResponseEntity<>(new ResponseObject("error", "Số điện thoại đã có trong hệ thống. Hãy sử dụng số điện thoại khác", 1, CustomerDto), HttpStatus.BAD_REQUEST);
        }

        return customerService.save(CustomerDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct( @PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return customerService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@Valid @RequestBody CustomerRequest customerDto, BindingResult result, @PathVariable("id") Long id){
        if (result.hasErrors()) {
            // Xử lý lỗi validate ở đây
            StringBuilder errors = new StringBuilder();
            for (FieldError error : result.getFieldErrors()) {
                errors.append(error.getDefaultMessage()).append("\n");
            }
            // Xử lý lỗi validate ở đây, ví dụ: trả về ResponseEntity.badRequest()
            return new ResponseEntity<>(new ResponseObject("error", errors.toString(), 1, customerDto), HttpStatus.BAD_REQUEST);
        }
        if (customerRepo.existsByEmail(customerDto.getEmail())) {
            return new ResponseEntity<>(new ResponseObject("error", "Email đã có trong hệ thống. Hãy sử dụng email khác", 1, customerDto), HttpStatus.BAD_REQUEST);
        }
        if (customerRepo.existsByPhone(customerDto.getPhone())) {
            return new ResponseEntity<>(new ResponseObject("error", "Số điện thoại đã có trong hệ thống. Hãy sử dụng số điện thoại khác", 1, customerDto), HttpStatus.BAD_REQUEST);
        }
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

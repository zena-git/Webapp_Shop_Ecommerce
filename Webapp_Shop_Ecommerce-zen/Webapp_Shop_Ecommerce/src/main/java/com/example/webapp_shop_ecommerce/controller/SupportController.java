package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.User.UserRequest;
import com.example.webapp_shop_ecommerce.dto.request.address.AddressRequest;
import com.example.webapp_shop_ecommerce.dto.request.mail.MailInputDTO;
import com.example.webapp_shop_ecommerce.dto.request.message.ResetPasswordRequest;
import com.example.webapp_shop_ecommerce.dto.request.promotion.PromotionRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.color.ColorResponse;
import com.example.webapp_shop_ecommerce.dto.response.promotion.PromotionResponse;
import com.example.webapp_shop_ecommerce.dto.response.user.UserResponse;
import com.example.webapp_shop_ecommerce.entity.Color;
import com.example.webapp_shop_ecommerce.entity.Customer;
import com.example.webapp_shop_ecommerce.entity.Promotion;
import com.example.webapp_shop_ecommerce.entity.Users;
import com.example.webapp_shop_ecommerce.service.*;
import com.example.webapp_shop_ecommerce.service.Impl.MailServiceImpl;
import com.example.webapp_shop_ecommerce.service.Impl.OTPServiceImpl;
import com.example.webapp_shop_ecommerce.service.Impl.SupportSevice;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v3/")
public class SupportController {
    @Autowired
    SupportSevice supportSevice;
    @Autowired
    IUsersService usersService;
    @Autowired
    private ModelMapper mapper;

    @Autowired
    private OTPServiceImpl messageService;

    @Autowired
    private ICustomerService customerService;

    @DeleteMapping("/address/delete/{id}")
    public ResponseEntity<ResponseObject> deleteAddress(@PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return supportSevice.deleteAddress(id);
    }

    @PostMapping("/address")
    public ResponseEntity<ResponseObject> saveOrUpdate(@RequestBody AddressRequest addressRequest){
        return supportSevice.saveOrUpdate(addressRequest);
    }

    @DeleteMapping("/user/delete/{id}")
    public ResponseEntity<ResponseObject> deleteUser(@PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return supportSevice.deleteUser(id);
    }

    @GetMapping("/customer/filter")
    public ResponseEntity<?> filterCustomers(@RequestParam(value = "type", defaultValue = "1") Integer type){
        return supportSevice.filterCustomers(type);
    }

    @GetMapping("/promotion/data")
    public ResponseEntity<?> findPromotionById(@RequestParam("id") Long id) {

        return supportSevice.findPromotionById(id);
    }

    @GetMapping("/promotion/deleted")
    public ResponseEntity<?> findPromotionByDelete(@RequestParam(value = "type", defaultValue = "true") Boolean type ) {
        return supportSevice.findAllByDeleted(type);
    }

    @PutMapping("/promotion/recover")
    public ResponseEntity<?> recoverPromotion(@RequestParam(value = "id", defaultValue = "") Long id ) {
        return supportSevice.recoverPromotion(id);
    }

    @GetMapping("/voucher/deleted")
    public ResponseEntity<?> findVoucherByDelete(@RequestParam(value = "type", defaultValue = "true") Boolean type ) {
        return supportSevice.findAllVoucherByDeleted(type);
    }

    @PutMapping("/voucher/recover")
    public ResponseEntity<?> recoverVoucher(@RequestParam(value = "id", defaultValue = "") Long id ) {
        return supportSevice.recoverVoucher(id);
    }

    @GetMapping("/user")
    public ResponseEntity<?> findAllUser() {
        List<Users> lst = usersService.findAllByDeletedAll();
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @PostMapping("/user")
    public ResponseEntity<?> saveUser(@RequestBody UserRequest request) {
        return supportSevice.saveOrUpdateUser(request);
    }

    @PutMapping("/user/update")
    public ResponseEntity<?> updateUser(@RequestBody UserRequest request) {
        return supportSevice.saveOrUpdateUser(request);
    }


    @GetMapping("/user/deleted")
    public ResponseEntity<?> findUserByDelete(@RequestParam(value = "type", defaultValue = "true") Boolean type ) {
        return supportSevice.findAllByDeletedUsers(type);
    }

    @PostMapping("/user/recover")
    public ResponseEntity<?> recoverUser(@RequestParam(value = "id", defaultValue = "") Long id ) {
        return supportSevice.recoverUser(id);
    }

    @PostMapping("/promotion/update")
    public ResponseEntity<?> promotionUpadte(@RequestBody PromotionRequest request) {
        return supportSevice.promotionUpadte(request);
    }

    @PostMapping("/customer/resetpassword")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request){
        Optional<Customer> otp = customerService.findByPhone(request.getPhoneNumber());
        if(!otp.isEmpty()){
            return new ResponseEntity<>(customerService.updatePassword(otp.get().getId(), request.getNewPassword()), HttpStatus.OK);

        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/customer/recoverpassword")
    public ResponseEntity<?> recoverPassword(@RequestBody ResetPasswordRequest request){

        return new ResponseEntity<>(messageService.sendNewPassword(request), HttpStatus.OK);
    }
}

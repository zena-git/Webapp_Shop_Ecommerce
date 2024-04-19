package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.request.User.UserRequest;
import com.example.webapp_shop_ecommerce.dto.request.address.AddressRequest;
import com.example.webapp_shop_ecommerce.dto.request.promotion.PromotionRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.customer.CustomerResponse;
import com.example.webapp_shop_ecommerce.dto.response.productdetails.ProductDetailsResponse;
import com.example.webapp_shop_ecommerce.dto.response.productdetails.ProductDetailsSupportResponse;
import com.example.webapp_shop_ecommerce.dto.response.products.ProductResponse;
import com.example.webapp_shop_ecommerce.dto.response.promotion.PromotionSupportResponse;
import com.example.webapp_shop_ecommerce.dto.response.user.UserResponse;
import com.example.webapp_shop_ecommerce.dto.response.voucher.VoucherResponse;
import com.example.webapp_shop_ecommerce.entity.*;
import com.example.webapp_shop_ecommerce.infrastructure.enums.TrangThaiBill;
import com.example.webapp_shop_ecommerce.repositories.*;
import com.example.webapp_shop_ecommerce.service.*;
import org.apache.catalina.User;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SupportSevice {

    @Autowired
    IAddressService addressService;
    @Autowired
    IAddressRepository addressRepo;
    @Autowired
    ICustomerRepository customerRepo;

    @Autowired
    IPromotionService promotionService;

    @Autowired
    IVoucherService voucherService;

    @Autowired
    IPromotionDetailsService promotionDetailsService;

    @Autowired
    IProductDetailsService productDetailsService;

    @Autowired
    IUsersService usersService;

    @Autowired
    IUsersRepository usersRepo;

    @Autowired
    IPromotionRepository promotionRepo;

    @Autowired
    IVoucherRepository voucherRepo;

    @Autowired
    IPromotionDetailsRepository promotionDetailsRepo;

    @Autowired
    private ModelMapper mapper;

    public ResponseEntity<ResponseObject> deleteAddress(Long id){
        return addressService.physicalDelete(id);
    }

    public ResponseEntity<ResponseObject> deleteUser(Long id){
        return usersService.delete(id);
    }


    public ResponseEntity<ResponseObject> saveOrUpdate(AddressRequest request){

        Optional<Address> addressOtp = addressService.findById(request.getId());
        Address address = addressOtp.orElse(null);
        address = mapper.map(request, Address.class);

        Optional<Customer> optCustomer = customerRepo.findById(request.getCustomer());

        if (addressOtp.isPresent()){
            address.setLastModifiedDate(LocalDateTime.now());
            address.setLastModifiedBy("Admin");
            address.setDeleted(addressOtp.get().getDeleted());
            address.setCustomer(addressOtp.get().getCustomer());
        }else {
            if (optCustomer.isEmpty()){
                return new ResponseEntity<>(new ResponseObject("error","Không tìm thấy customer",0, request), HttpStatus.BAD_REQUEST);
            }
            address.setCustomer(optCustomer.orElseGet(null));
            address.setCreatedBy("Admin");
            address.setLastModifiedDate(LocalDateTime.now());
            address.setLastModifiedBy("Admin");
            address.setCreatedDate(LocalDateTime.now());
            address.setDeleted(false);
        }
        address.setId(request.getId());
        Address addressReturn = addressRepo.save(address);
        if (request.getId() !=null){
            return new ResponseEntity<>(new ResponseObject("success","Cập nhật thành công",0, addressReturn), HttpStatus.OK);
        }else {
            return new ResponseEntity<>(new ResponseObject("success","Thêm mới thành công",0, addressReturn), HttpStatus.OK);
        }
    }

    public ResponseEntity<?> filterCustomers(Integer type){
//        Calendar calendar = Calendar.getInstance();
//        calendar.add(Calendar.MONTH, -1);
//        int previousMonth = calendar.get(Calendar.MONTH) + 1;

        Calendar calendar = Calendar.getInstance();

        // Lấy tháng hiện tại
        Integer currentMonth = calendar.get(Calendar.MONTH) + 1;

        List<Customer> lstCustomer = new ArrayList<>();
        if (type == 1){
            lstCustomer = customerRepo.findAllCustomerCreated(currentMonth);
        }else {
            lstCustomer = customerRepo.findAllCustomersWithInvoiceCreated(currentMonth,TrangThaiBill.HOAN_THANH.getLabel() );
        }
        List<CustomerResponse> resultDto  = lstCustomer.stream().map(customer -> mapper.map(customer, CustomerResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    public ResponseEntity<?> findPromotionById(Long id){
        Optional<Promotion> otp = promotionService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        PromotionSupportResponse obj = otp.map(pro -> mapper.map(pro, PromotionSupportResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    public ResponseEntity<?> findAllByDeleted(Boolean tyle){
        List<Promotion> lstPromotion = promotionRepo.findAllByDeleted(tyle);
        List<PromotionSupportResponse> resultDto  = lstPromotion.stream().map(promotion -> mapper.map(promotion, PromotionSupportResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    public ResponseEntity<?> findAllVoucherByDeleted(Boolean tyle){
        List<Voucher> lstPromotion = voucherRepo.findAllByDeleted(tyle);
        List<VoucherResponse> resultDto  = lstPromotion.stream().map(promotion -> mapper.map(promotion, VoucherResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    public ResponseEntity<?> recoverPromotion(Long id ){
        Optional<Promotion> otp = promotionRepo.findByIdDeleted(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        promotionRepo.updateRecover(id);
        return new ResponseEntity<>(new ResponseObject("success","Thành công",0, id), HttpStatus.OK);
    }

    public ResponseEntity<?> recoverVoucher(Long id ){
        Voucher otp = voucherRepo.findDeletedId(id);
        System.out.println(otp.toString());
        if (otp == null) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        voucherRepo.updateRecover(id);
        return new ResponseEntity<>(new ResponseObject("success","Thành công",0, id), HttpStatus.OK);
    }


    public ResponseEntity<?> saveOrUpdateUser(UserRequest request){
        Optional<Users> userOtp = usersService.findById(request.getId());
        Users user = userOtp.orElse(new Users());
        user = mapper.map(request, Users.class);
        if (userOtp.isPresent()){
            user.setId(userOtp.get().getId());
            user.setUsersRole(userOtp.get().getUsersRole());
            usersService.update(user);
            return new ResponseEntity<>(new ResponseObject("success","Cập nhật thành công",0, request), HttpStatus.OK);
        }else {
            usersService.createNew(user);
            return new ResponseEntity<>(new ResponseObject("success","Thêm thành công",0, request), HttpStatus.OK);
        }
    }


    public ResponseEntity<?> findAllByDeletedUsers(Boolean tyle){
        List<Users> lstUser = usersRepo.findAllByDeleted(tyle);
        List<UserResponse> resultDto  = lstUser.stream().map(user -> mapper.map(user, UserResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    public ResponseEntity<?> recoverUser(Long id ){
        Optional<Users> otp = usersRepo.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        usersRepo.updateRecover(id);
        return new ResponseEntity<>(new ResponseObject("success","Thành công",0, id), HttpStatus.OK);
    }

    public ResponseEntity<?> promotionUpadte(PromotionRequest request){
        Optional<Promotion> otpPromotion = promotionService.findById(request.getId());
        if(otpPromotion.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + request, 1, null), HttpStatus.BAD_REQUEST);
        }
        Promotion promotion = otpPromotion.get();
        List<Long> lstProductDetails = request.getLstProductDetails();

        if (lstProductDetails.size() == 0) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không có product detail" + request, 1, null), HttpStatus.BAD_REQUEST);
        }

        Set<PromotionDetails> lstPromotionDetails = otpPromotion.get().getLstPromotionDetails();
        //lấu ra promotiondetail không có trong lstproductdetails
        List<Long> lstPromotionDetailDelete = lstPromotionDetails.stream()
                .filter(promotionDetails -> !lstProductDetails.contains(promotionDetails.getProductDetails().getId()))
                .map(promotionDetails -> promotionDetails.getId()).collect(Collectors.toList());

        //Lấy ra productdetail không có trong lstPromotionDetails
        List<Long> productDetailsNotInPromotion = lstProductDetails.stream()
                .filter(productId -> lstPromotionDetails.stream()
                        .noneMatch(promotionDetails -> promotionDetails.getProductDetails().getId() == productId))
                .collect(Collectors.toList());

        //lay ra lstpromotionDetails có product và promotion
        List<PromotionDetails> promotionsDetailWithProductDetails = lstPromotionDetails.stream()
                .filter(promotionDetails -> lstProductDetails.contains(promotionDetails.getProductDetails().getId()))
                .collect(Collectors.toList());

        //Xoa khong cos trong lstproduc
        for(Long id : lstPromotionDetailDelete ){
            System.out.println("lstPromotionDetailDelete"+ id);
            promotionDetailsService.delete(id);
        }
        //tao promotionDetail mới
        for (Long id : productDetailsNotInPromotion){
            Optional<ProductDetails> otpProductDetails = productDetailsService.findById(id);
            if (otpProductDetails.isEmpty()){
                return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy sản phẩm " + id, 1, null), HttpStatus.BAD_REQUEST);
            }
            PromotionDetails promotionDetails = PromotionDetails.builder().promotion(promotion).productDetails(otpProductDetails.get()).build();
            promotionDetailsService.createNew(promotionDetails);
        }

        //update promotionDetails = false
        for (PromotionDetails promotionDetails:  promotionsDetailWithProductDetails){
            promotionDetailsRepo.updateDeletedFalseById(promotionDetails.getId());
        }

        promotion = mapper.map(request, Promotion.class);
        promotionService.update(promotion);
        return new ResponseEntity<>(new ResponseObject("success","Thành công",0, request), HttpStatus.OK);

    }
    public ResponseEntity<?> abc(AddressRequest request){
        return null;
    }

}

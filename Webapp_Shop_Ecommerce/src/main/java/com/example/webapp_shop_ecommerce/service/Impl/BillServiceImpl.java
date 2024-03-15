package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.request.bill.BillRequest;
import com.example.webapp_shop_ecommerce.dto.request.billdetails.BillDetailsRequest;
import com.example.webapp_shop_ecommerce.dto.request.cart.CartRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.*;
import com.example.webapp_shop_ecommerce.infrastructure.enums.TrangThaiBill;
import com.example.webapp_shop_ecommerce.infrastructure.security.Authentication;
import com.example.webapp_shop_ecommerce.repositories.*;
import com.example.webapp_shop_ecommerce.service.IBillDetailsService;
import com.example.webapp_shop_ecommerce.service.IBillService;
import com.example.webapp_shop_ecommerce.service.ICartDetailsService;
import com.example.webapp_shop_ecommerce.service.IProductDetailsService;
import com.example.webapp_shop_ecommerce.ultiltes.RandomStringGenerator;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.webapp_shop_ecommerce.infrastructure.enums.BillType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BillServiceImpl extends BaseServiceImpl<Bill, Long, IBillRepository> implements IBillService {
    @Autowired
    private IProductDetailsRepository productDetailsRepo;
    @Autowired
    private Authentication authentication;
    @Autowired
    private ICartRepository cartRepo;
    @Autowired
    private ICartDetailsRepository cartDetailsRepo;
    @Autowired
    private IBillRepository billRepo;
    @Autowired
    private IBillDetailsRepository billDetailsRepo;
    @Autowired
    private RandomStringGenerator randomStringGenerator;
    @Autowired
    private ModelMapper mapper;
    @Autowired
    private IBillDetailsService billDetailsService;
    @Autowired
    private IProductDetailsService productDetailsService;

    @Override
    public ResponseEntity<ResponseObject> buyBillClient(BillRequest billRequest) {
        Customer customer = authentication.getCustomer();
        List<Long> lstIdCartDetails =  billRequest.getLstCartDetails().stream().map(cartDetails -> cartDetails.getId()).collect(Collectors.toList());;
        if (lstIdCartDetails.size()==0){
            return new ResponseEntity<>(new ResponseObject("error", "Chon it nhat 1 san pham", 1, billRequest), HttpStatus.BAD_REQUEST);
        }
        Bill billDto = mapper.map(billRequest, Bill.class);
        billDto.setId(null);
        billDto.setCodeBill("HD"+ randomStringGenerator.generateRandomString(6));
        billDto.setBillType("Online");
        billDto.setBookingDate(new Date());
        billDto.setDeleted(false);
        billDto.setCreatedBy("Admin");
        billDto.setCreatedDate(LocalDateTime.now());
        billDto.setLastModifiedDate(LocalDateTime.now());
        billDto.setLastModifiedBy("Admin");
        billDto.setCustomer(customer);
        Bill bill = billRepo.save(billDto);
        List<CartDetails> lstCartDetails = cartDetailsRepo.findAllById(lstIdCartDetails);

        List<BillDetails> lstBillDetails = lstCartDetails.stream().map(cartDetails -> {
            BillDetails billDetails = new BillDetails();
            ProductDetails productDetails = cartDetails.getProductDetails();

            billDetails.setBill(bill);
            billDetails.setProductDetails(productDetails);
            billDetails.setUnitPrice(productDetails.getPrice());
            billDetails.setQuantity(cartDetails.getQuantity());
            billDetails.setStatus("Đang Xuất Hàng 0");
            billDetails.setId(null);
            billDetails.setDeleted(false);
            billDetails.setCreatedBy("Admin");
            billDetails.setCreatedDate(LocalDateTime.now());
            billDetails.setLastModifiedDate(LocalDateTime.now());
            billDetails.setLastModifiedBy("Admin");

            productDetails.setQuantity(productDetails.getQuantity() - cartDetails.getQuantity());
            productDetailsRepo.save(productDetails);
            return billDetailsRepo.save(billDetails);
        }).collect(Collectors.toList());

        cartDetailsRepo.deleteAll(lstCartDetails);

        return new ResponseEntity<>(new ResponseObject("success", "Đặt Hàng Thành Công", 0, billRequest), HttpStatus.CREATED);

    }

    @Override
    public ResponseEntity<ResponseObject> buyBillClientGuest(BillRequest billRequest) {
        if (billRequest.getLstCartDetails().size()==0){
            return new ResponseEntity<>(new ResponseObject("error", "Chon it nhat 1 san pham", 1, billRequest), HttpStatus.BAD_REQUEST);
        }
        Bill billDto = mapper.map(billRequest, Bill.class);
        billDto.setId(null);
        billDto.setCodeBill("HD"+ randomStringGenerator.generateRandomString(6));
        billDto.setBillType("Online");
        billDto.setBookingDate(new Date());
        billDto.setDeleted(false);
        billDto.setCreatedBy("Admin");
        billDto.setCreatedDate(LocalDateTime.now());
        billDto.setLastModifiedDate(LocalDateTime.now());
        billDto.setLastModifiedBy("Admin");
        billDto.setCustomer(null);
        Bill bill = billRepo.save(billDto);

        List<BillDetails> lstBillDetails = billRequest.getLstCartDetails().stream().map(cartDetails -> {
            BillDetails billDetails = new BillDetails();
            ProductDetails productDetails = cartDetails.getProductDetails();
            billDetails.setBill(bill);
            billDetails.setProductDetails(productDetails);
            billDetails.setUnitPrice(productDetails.getPrice());
            billDetails.setQuantity(cartDetails.getQuantity());
            billDetails.setStatus("Đang Xuất Hàng 0");
            billDetails.setId(null);
            billDetails.setDeleted(false);
            billDetails.setCreatedBy("Admin");
            billDetails.setCreatedDate(LocalDateTime.now());
            billDetails.setLastModifiedDate(LocalDateTime.now());
            billDetails.setLastModifiedBy("Admin");

            productDetails.setQuantity(productDetails.getQuantity() - cartDetails.getQuantity());
            productDetailsRepo.save(productDetails);
            return billDetailsRepo.save(billDetails);
        }).collect(Collectors.toList());
        return new ResponseEntity<>(new ResponseObject("success", "Đặt Hàng Thành Công", 0, billRequest), HttpStatus.CREATED);

    }

    @Override
    public List<Bill> findBillByCustomer() {
        Customer customer = authentication.getCustomer();
        return repository.findBillByCustomer(customer);
    }

    @Override
    public List<Bill> findAllTypeAndStatus(String type, String status) {
        return repository.findAllTypeAndStatus(type, status);
    }

    @Override
    public ResponseEntity<ResponseObject> billCounterNew() {
        Bill entity = new Bill();
        entity.setBillType(BillType.OFFLINE.getLabel());
        entity.setStatus(TrangThaiBill.NEW.getLabel());
        entity.setId(null);
        entity.setDeleted(false);
        entity.setCreatedBy("Admin");
        entity.setCreatedDate(LocalDateTime.now());
        entity.setLastModifiedDate(LocalDateTime.now());
        entity.setLastModifiedBy("Admin");
        Integer count = billRepo.countBillsByTypeAndStatus(BillType.OFFLINE.getLabel(), TrangThaiBill.NEW.getLabel());
        // Kiểm tra nếu count là null hoặc lớn hơn hoặc bằng 5
        if (count != null && count >= 5) {
            return new ResponseEntity<>(new ResponseObject("error", "Không Được Tạo Quá 5 Hóa Đơn ", 0, entity), HttpStatus.BAD_REQUEST);
        }
        System.out.println("Hóa Đơn Đã cớ+ " +count);
        billRepo.save(entity);
        return new ResponseEntity<>(new ResponseObject("success", "Tạo Hóa Đơn Thành Công", 0, entity), HttpStatus.CREATED);

    }

    @Override
    public ResponseEntity<ResponseObject> countersAddProduct(List<BillDetailsRequest> lstBillDetailsDto, Long id) {
        Optional<Bill> billOpt = billRepo.findById(id);
        if (billOpt.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy Id Hóa Đơn", 1, id), HttpStatus.BAD_REQUEST);
        }
        if (lstBillDetailsDto.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("error", "Chọn ít nhất 1 sản phẩm", 1, null), HttpStatus.BAD_REQUEST);
        }

        for (BillDetailsRequest billDetailsDto : lstBillDetailsDto) {
            Optional<ProductDetails> productDetailOpt = productDetailsRepo.findById(billDetailsDto.getProductDetails());
            if (productDetailOpt.isEmpty()) {
                return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy Sản Phẩm", 1, null), HttpStatus.BAD_REQUEST);
            }

            Bill bill = billOpt.get();
            ProductDetails productDetails = productDetailOpt.get();

            Optional<BillDetails> billDetailsOpt = billDetailsRepo.findByBillAndProductDetails(bill,productDetails);
            if (billDetailsOpt.isPresent()) {
                BillDetails billDetails = billDetailsOpt.get();
                billDetails.setQuantity(billDetails.getQuantity() + billDetailsDto.getQuantity());
                billDetailsRepo.save(billDetails);

                productDetails.setQuantity(productDetails.getQuantity() - billDetailsDto.getQuantity());
                productDetailsService.update(productDetails);
            } else {
                BillDetails billDetails = mapper.map(billDetailsDto, BillDetails.class);
                billDetails.setBill(bill);
                billDetails.setProductDetails(productDetails);
                billDetails.setUnitPrice(productDetails.getPrice()); // Cần xác định giá của sản phẩm từ đâu
                billDetails.setStatus(TrangThaiBill.DANG_BAN.getLabel());
                billDetailsService.createNew(billDetails);

                productDetails.setQuantity(productDetails.getQuantity() - billDetailsDto.getQuantity());
                productDetailsService.update(productDetails);
            }
        }

        return new ResponseEntity<>(new ResponseObject("success", "Thêm Sản Phẩm Thành Công", 0, lstBillDetailsDto), HttpStatus.CREATED);


    }

    @Override
    public ResponseEntity<ResponseObject> countersAddProductBarcode(Long id, String barcode) {
        Optional<Bill> otp = billRepo.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy Id Hóa Đơn", 0, id), HttpStatus.BAD_REQUEST);
        }
        Optional<ProductDetails> productDetailOtp = productDetailsRepo.findByBarcode(barcode);
        if (productDetailOtp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy Sản Phẩm", 1, barcode), HttpStatus.BAD_REQUEST);
        }

        Bill bill = otp.get();
        ProductDetails productDetails = productDetailOtp.get();

        Optional<BillDetails> billDetailsOpt = billDetailsRepo.findByProductDetails(productDetails);
        if (billDetailsOpt.isPresent()){
            BillDetails billDetails = billDetailsOpt.get();
            billDetails.setQuantity(billDetails.getQuantity() + 1);
            billDetailsRepo.save(billDetails);

            productDetails.setQuantity(productDetails.getQuantity() - billDetails.getQuantity());
            productDetailsService.update(productDetails);
        }else {
            BillDetails billDetails =  new BillDetails();
            billDetails.setBill(bill);
            billDetails.setProductDetails(productDetails);
            billDetails.setUnitPrice(billDetails.getUnitPrice());
            billDetails.setStatus(TrangThaiBill.DANG_BAN.getLabel());
            billDetailsService.createNew(billDetails);

            productDetails.setQuantity(productDetails.getQuantity() - 1);
            productDetailsService.update(productDetails);
        }

        return new ResponseEntity<>(new ResponseObject("success", "Thêm Sản Phẩm Thành Công", 0, barcode), HttpStatus.CREATED);

    }

    @Override
    public ResponseEntity<ResponseObject> chaneQuantityBillDetails(BillDetailsRequest billDto, Long idBillDetail) {
    Optional<BillDetails> opt = billDetailsRepo.findById(idBillDetail);
    if (opt.isEmpty()){
        return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy IdBilDetails Hóa Đơn", 0, idBillDetail), HttpStatus.BAD_REQUEST);
    }
    BillDetails billDetails = opt.get();
    billDetails.setQuantity(billDto.getQuantity());
    billDetailsRepo.save(billDetails);
    return new ResponseEntity<>(new ResponseObject("success", "Cập Nhật Số Lượng Thành Công", 0, billDto), HttpStatus.CREATED);
    }

}

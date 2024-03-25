package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.request.bill.BillRequest;
import com.example.webapp_shop_ecommerce.dto.request.billdetails.BillDetailsRequest;
import com.example.webapp_shop_ecommerce.dto.request.historybill.HistoryBillRequest;
import com.example.webapp_shop_ecommerce.dto.request.paymentHistory.PaymentHistoryRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.*;
import com.example.webapp_shop_ecommerce.infrastructure.enums.BillType;
import com.example.webapp_shop_ecommerce.infrastructure.enums.TrangThaiBill;
import com.example.webapp_shop_ecommerce.infrastructure.security.Authentication;
import com.example.webapp_shop_ecommerce.repositories.*;
import com.example.webapp_shop_ecommerce.service.*;
import com.example.webapp_shop_ecommerce.ultiltes.InvoiceGenerator;
import com.example.webapp_shop_ecommerce.ultiltes.RandomStringGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
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
    @Autowired
    private ICustomerRepository customerRepo;
    @Autowired
    private IVoucherDetailsRepository voucherDetailsRepo;
    @Autowired
    private InvoiceGenerator invoiceGenerator;
    @Autowired
    private IHistoryBillService historyBillService;

    @Autowired
    private IPaymentHistoryService paymentHistoryService;

    @Override
    public ResponseEntity<ResponseObject> buyBillClient(BillRequest billRequest) {
        Customer customer = authentication.getCustomer();
        List<Long> lstIdCartDetails = billRequest.getLstCartDetails().stream().map(cartDetails -> cartDetails.getId()).collect(Collectors.toList());
        ;
        if (lstIdCartDetails.size() == 0) {
            return new ResponseEntity<>(new ResponseObject("error", "Chon it nhat 1 san pham", 1, billRequest), HttpStatus.BAD_REQUEST);
        }
        Bill billDto = mapper.map(billRequest, Bill.class);
        billDto.setId(null);
        billDto.setCodeBill(invoiceGenerator.generateInvoiceNumber());
        billDto.setBillType(BillType.ONLINE.getLabel());
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
            billDetails.setStatus(TrangThaiBill.DANG_BAN.getLabel());
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
        if (billRequest.getLstCartDetails().size() == 0) {
            return new ResponseEntity<>(new ResponseObject("error", "Chon it nhat 1 san pham", 1, billRequest), HttpStatus.BAD_REQUEST);
        }
        Bill billDto = mapper.map(billRequest, Bill.class);
        billDto.setId(null);
        billDto.setCodeBill(invoiceGenerator.generateInvoiceNumber());
        billDto.setBillType(BillType.ONLINE.getLabel());
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
            billDetails.setStatus(TrangThaiBill.DANG_BAN.getLabel());
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
        entity.setCodeBill(invoiceGenerator.generateInvoiceNumber());
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
        System.out.println("Hóa Đơn Đã cớ+ " + count);
        Bill bill = billRepo.save(entity);
        historyBillService.addHistoryBill(bill, TrangThaiBill.TAO_DON_HANG.getLabel(), "");
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

            Optional<BillDetails> billDetailsOpt = billDetailsRepo.findByBillAndProductDetails(bill, productDetails);


            if (productDetails.getQuantity() < billDetailsDto.getQuantity()) {
                return new ResponseEntity<>(new ResponseObject("error", "Số Lượng Sản Phẩm Không Đủ", 1, null), HttpStatus.BAD_REQUEST);
            }

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
    public ResponseEntity<ResponseObject> billUpdateCustomer(BillRequest billRequest, Long id) {
        Optional<Bill> otp = billRepo.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy Id Hóa Đơn", 0, id), HttpStatus.BAD_REQUEST);
        }
        Bill bill = otp.get();
        if (billRequest.getCustomer() == null) {
            bill.setCustomer(null);
        } else {
            Optional<Customer> customerOpt = customerRepo.findById(billRequest.getCustomer());
            if (customerOpt.isPresent()) {
                bill.setCustomer(customerOpt.get());
            } else {
                bill.setCustomer(null);
                return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy Khách Hàng", 0, id), HttpStatus.BAD_REQUEST);
            }
        }
        update(bill);
        return new ResponseEntity<>(new ResponseObject("success", "Chọn Khách Hàng Thành Công", 0, billRequest), HttpStatus.CREATED);

    }

    @Override
    public ResponseEntity<ResponseObject> countersAddProductBarcode(Long id, String barcode) {
        Optional<Bill> otp = billRepo.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy Id Hóa Đơn", 0, id), HttpStatus.BAD_REQUEST);
        }
        Optional<ProductDetails> productDetailOtp = productDetailsRepo.findByBarcode(barcode);
        if (productDetailOtp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy Sản Phẩm", 1, barcode), HttpStatus.BAD_REQUEST);
        }

        Bill bill = otp.get();
        ProductDetails productDetails = productDetailOtp.get();

        Optional<BillDetails> billDetailsOpt = billDetailsRepo.findByBillAndProductDetails(bill, productDetails);
        if (billDetailsOpt.isPresent()) {
            BillDetails billDetails = billDetailsOpt.get();
            billDetails.setQuantity(billDetails.getQuantity() + 1);
            billDetailsRepo.save(billDetails);

            productDetails.setQuantity(productDetails.getQuantity() - billDetails.getQuantity());
            productDetailsService.update(productDetails);
        } else {
            BillDetails billDetails = new BillDetails();
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
        if (opt.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy IdBilDetails Hóa Đơn", 0, idBillDetail), HttpStatus.BAD_REQUEST);
        }

        Optional<ProductDetails> optProductDetails = productDetailsService.findById(opt.get().getProductDetails().getId());
        if (optProductDetails.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy Sản Phẩm Trong Giỏ Hàng", 0, idBillDetail), HttpStatus.BAD_REQUEST);
        }

        if (billDto.getQuantity() < 1) {
            return new ResponseEntity<>(new ResponseObject("error", "Số Lượng Phải Lớn Hơn 0", 1, null), HttpStatus.BAD_REQUEST);
        }

        ProductDetails productDetails = optProductDetails.get();
        if (productDetails.getQuantity() < billDto.getQuantity()) {
            return new ResponseEntity<>(new ResponseObject("error", "Số Lượng Sản Phẩm Không Đủ", 1, null), HttpStatus.BAD_REQUEST);
        }


        productDetails.setQuantity(productDetails.getQuantity() + opt.get().getQuantity() - billDto.getQuantity());
        productDetailsRepo.save(productDetails);
        BillDetails billDetails = opt.get();
        billDetails.setQuantity(billDto.getQuantity());
        billDetailsRepo.save(billDetails);
        return new ResponseEntity<>(new ResponseObject("success", "Cập Nhật Số Lượng Thành Công", 0, billDto), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<ResponseObject> billCounterPay(BillRequest billDto, Long id) {

        Optional<Bill> otp = findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy Hóa Đơn", 1, billDto), HttpStatus.BAD_REQUEST);
        }
        Bill bill = otp.get();

        List<BillDetails> lstBillDetail = billDetailsRepo.findAllByBill(bill);
        if (lstBillDetail.size() == 0) {
            return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy Sản Phẩm Trong Giỏ Hàng", 0, id), HttpStatus.BAD_REQUEST);
        }

        bill = mapper.map(billDto, Bill.class);
        bill.setId(id);
        bill.setBookingDate(new Date());
        bill.setPaymentDate(new Date());
        bill.setBillType(otp.get().getBillType());
        bill.setCodeBill(otp.get().getCodeBill());
        bill.setCustomer(otp.get().getCustomer());
        bill.setUser(otp.get().getUser());

        update(bill);
        if (billDto.getStatus().equalsIgnoreCase(TrangThaiBill.CHO_GIAO.getLabel())){
            historyBillService.addHistoryBill(bill,TrangThaiBill.CHO_GIAO.getLabel(), "");
        }
        if (billDto.getStatus().equalsIgnoreCase(TrangThaiBill.CHO_XAC_NHAN.getLabel())){
            historyBillService.addHistoryBill(bill,TrangThaiBill.CHO_XAC_NHAN.getLabel(), "");
        }
        if (billDto.getStatus().equalsIgnoreCase(TrangThaiBill.HOAN_THANH.getLabel())){
            historyBillService.addHistoryBill(bill,TrangThaiBill.HOAN_THANH.getLabel(), "");
        }
        return new ResponseEntity<>(new ResponseObject("success", "Thanh Toán Thành Công", 0, billDto), HttpStatus.CREATED);

    }

    @Override
    public ResponseEntity<ResponseObject> billDeleteBillDetail(Long idBillDetail) {

        Optional<BillDetails> opt = billDetailsRepo.findById(idBillDetail);
        if (opt.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy BilDetails Hóa Đơn", 0, idBillDetail), HttpStatus.BAD_REQUEST);
        }
        BillDetails billDetails = opt.get();
        Optional<ProductDetails> productDetailsOtp = productDetailsRepo.findById(billDetails.getProductDetails().getId());

        if (productDetailsOtp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy Sản Phẩm Trong Giỏ", 0, idBillDetail), HttpStatus.BAD_REQUEST);
        }

        ProductDetails productDetails = productDetailsOtp.get();
        productDetails.setQuantity(productDetails.getQuantity() + billDetails.getQuantity());
        productDetailsRepo.save(productDetails);

        billDetailsRepo.delete(billDetails);
//        updateChangeMoneyBill()

        return new ResponseEntity<>(new ResponseObject("success", "Xóa Sản Phẩm Khỏi Giỏ Hàng Thành Công", 0, idBillDetail), HttpStatus.CREATED);

    }

    @Override
    public ResponseEntity<ResponseObject> deleteBillToBillDetailAll(Long idBill) {
        Optional<Bill> otp = findById(idBill);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy Hóa Đơn", 1, idBill), HttpStatus.BAD_REQUEST);
        }
        List<BillDetails> lstBillDetails = billDetailsRepo.findAllByBill(otp.get());
        for (BillDetails billDetails : lstBillDetails) {
            billDeleteBillDetail(billDetails.getId());
        }

        //Xóa VOuchẻ dang đc mapping vs bil
        List<VoucherDetails> lstVouchers = voucherDetailsRepo.findByIdBill(otp.get().getId());
        lstVouchers.stream().map(voucherDetails -> {
            voucherDetailsRepo.delete(voucherDetails);
            return voucherDetails;
        }).collect(Collectors.toList());


        physicalDelete(idBill);
        return new ResponseEntity<>(new ResponseObject("success", "Đã Xóa Hóa Đơn Thành Công", 0, otp.get()), HttpStatus.OK);
    }

    @Override
    public Page<Bill> findAllDeletedFalseAndStatusAndStatusNot(Pageable page, Map<String, Object> keyWork, String statusNot) {
        return repository.findAllDeletedFalseAndStatusAndStatusNot(page, keyWork, statusNot);
    }

    @Override
    public Boolean updateChangeMoneyBill(Long idBill) {

        Optional<Bill> opt = findById(idBill);
        if (opt.isEmpty()) {
            return false;
        }
        Bill bill = opt.get();
        List<BillDetails> lstBillDetails = billDetailsService.findAllByBill(bill);
        if (lstBillDetails.size() == 0) {
            return false;
        }



        System.out.println(bill.getReceiverProvince() + " " + bill.getReceiverDistrict() + " " + bill.getReceiverCommune());

        RestTemplate restTemplate = new RestTemplate();
        String urlProvince = "https://online-gateway.ghn.vn/shiip/public-api/master-data/province";
        String urlDistrict = "https://online-gateway.ghn.vn/shiip/public-api/master-data/district";
        String urlWard = "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward";
        String urlService = "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services";
        String urlMoneyShip = "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";
        HttpHeaders headers = new HttpHeaders();
        headers.set("token", "dfe1e7cf-e582-11ee-b290-0e922fc774da");
        headers.set("shop_id", "4962936");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        CompletableFuture<String> provinceFuture = CompletableFuture.supplyAsync(() -> {
                    String responseBodyProvince = restTemplate.exchange(urlProvince, HttpMethod.GET, entity, String.class).getBody();
                    ObjectMapper objectMapper = new ObjectMapper();
                    try {
                        JsonNode jsonNode = objectMapper.readTree(responseBodyProvince);
                        JsonNode dataNodeProvince = jsonNode.get("data");
                        if (dataNodeProvince.isArray()) {
                            for (JsonNode provinceNode : dataNodeProvince) {
                                if (provinceNode.get("ProvinceName").asText().equalsIgnoreCase(bill.getReceiverProvince())) {
                                    System.out.println(provinceNode.get("ProvinceID").asText());
                                    System.out.println(provinceNode.get("ProvinceName").asText());
                                    return provinceNode.get("ProvinceID").asText();
                                }
                            }
                        }
                    } catch (JsonProcessingException e) {
                        e.printStackTrace();
                    }
                    return null;
                }
        );


        CompletableFuture<String> districtFuture = provinceFuture.thenCompose(province -> {
            return CompletableFuture.supplyAsync(() -> {
                if(province ==null){
                    return null;
                }
                UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(urlDistrict)
                        .queryParam("province_id", province);
                String urlDistrictParam = builder.toUriString();
                System.out.println(urlDistrictParam);
                ResponseEntity<String> responseDistrict = restTemplate.exchange(urlDistrictParam, HttpMethod.GET, entity, String.class);
                String responseBodyDistrict = responseDistrict.getBody();
                // Phân tích cú pháp JSON
                ObjectMapper objectMapperDistrict = new ObjectMapper();
                try {
                    JsonNode jsonNode = objectMapperDistrict.readTree(responseBodyDistrict);
                    JsonNode dataNodeDistrict = jsonNode.get("data");
                    if (dataNodeDistrict.isArray()) {
                        for (JsonNode districtNode : dataNodeDistrict) {
                            if (districtNode.get("DistrictName").asText().equalsIgnoreCase(bill.getReceiverDistrict())) {
                                return districtNode.get("DistrictID").asText();
                            }
                        }
                    }
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }

                return null;
            });
        });

        CompletableFuture<String> wardFuture = districtFuture.thenCompose(district -> {
            return CompletableFuture.supplyAsync(() -> {
                if(district==null){
                    return null;
                }
                //lấy wardId
                UriComponentsBuilder builderWard = UriComponentsBuilder.fromHttpUrl(urlWard)
                        .queryParam("district_id", district);
                String urlWardParam = builderWard.toUriString();
                System.out.println(urlWardParam);
                ResponseEntity<String> responseWard = restTemplate.exchange(urlWardParam, HttpMethod.GET, entity, String.class);
                String responseBodyWard = responseWard.getBody();
                // Phân tích cú pháp JSON
                ObjectMapper objectMapperWard = new ObjectMapper();
                try {
                    JsonNode jsonNode = objectMapperWard.readTree(responseBodyWard);
                    JsonNode dataNodeWard = jsonNode.get("data");
                    if (dataNodeWard.isArray()) {
                        for (JsonNode wardNode : dataNodeWard) {
                            if (wardNode.get("WardName").asText().equalsIgnoreCase(bill.getReceiverCommune())) {
                               return wardNode.get("WardCode").asText();
                            }
                        }
                    }
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }

                return null;
            });
        });



        String provinceId = provinceFuture.join();
        String districtId = districtFuture.join();
        String wardId = wardFuture.join();
        Integer insuranceValue = 10000;
        String serviceId = "53321";
        String fromDistrictId = "3440";
        Integer weightProduct = 1000;
        String coupon = null;
        Integer moneyShip = 0;

        if (provinceId==null && districtId ==null ) {
            return false;
        }

        insuranceValue = lstBillDetails.stream()
                .map(currentProduct -> currentProduct.getUnitPrice().multiply(BigDecimal.valueOf(currentProduct.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add).intValue();

        weightProduct = lstBillDetails.stream()
                .mapToInt(currentProduct -> currentProduct.getProductDetails().getWeight() * currentProduct.getQuantity())
                .sum();

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(urlService)
                .queryParam("to_district", districtId).queryParam("shop_id", 4962936).queryParam("from_district", 3440);
        String urlServiceParam = builder.toUriString();
        System.out.println(urlServiceParam);
        ResponseEntity<String> responseService = restTemplate.exchange(urlServiceParam, HttpMethod.GET, entity, String.class);
        String responseBodyService = responseService.getBody();
        // Phân tích cú pháp JSON
        ObjectMapper objectMapperService = new ObjectMapper();
        try {
            JsonNode jsonNode = objectMapperService.readTree(responseBodyService);
            JsonNode dataNodeService = jsonNode.get("data");
            if (dataNodeService.isArray()) {
                System.out.println(dataNodeService);
                serviceId = dataNodeService.get(0).get("service_id").asText(); //lay serviceId
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }


        //Lấy Phí SHip
        UriComponentsBuilder builderMoneyShip = UriComponentsBuilder.fromHttpUrl(urlMoneyShip)
                .queryParam("service_id", serviceId).queryParam("insurance_value", insuranceValue).queryParam("coupon", coupon).queryParam("from_district_id",fromDistrictId )
                .queryParam("to_district_id", districtId).queryParam("to_ward_code", wardId).queryParam("weight", weightProduct);
        String urlMoneyParam = builderMoneyShip.toUriString();
        System.out.println(urlMoneyParam);
        ResponseEntity<String> responseMoneyShip = restTemplate.exchange(urlMoneyParam, HttpMethod.GET, entity, String.class);
        String responseBodyMoneyShip = responseMoneyShip.getBody();
        // Phân tích cú pháp JSON
        ObjectMapper objectMapperMoneyShip = new ObjectMapper();
        try {
            JsonNode jsonNode = objectMapperMoneyShip.readTree(responseBodyMoneyShip);
            JsonNode dataNodeMoneyShip = jsonNode.get("data");
            System.out.println(dataNodeMoneyShip.get("total").asText());
            moneyShip = Integer.parseInt(dataNodeMoneyShip.get("total").asText());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        bill.setShipMoney(BigDecimal.valueOf(moneyShip));

        BigDecimal intoMoney = BigDecimal.valueOf(insuranceValue)
                .subtract(bill.getVoucherMoney())
                .add(BigDecimal.valueOf(moneyShip));
        bill.setIntoMoney(intoMoney);
        bill.setTotalMoney(BigDecimal.valueOf(insuranceValue));
        update(bill);
        return true;
    }

    @Override
    public ResponseEntity<ResponseObject> billAddProductNew(List<BillDetailsRequest> lstBillDetailsDto, Long id) {
        ResponseEntity<ResponseObject> result = countersAddProduct(lstBillDetailsDto, id);
        updateChangeMoneyBill(id);
        return result;
    }

    @Override
    public ResponseEntity<ResponseObject> chaneQuantityBillToBillDetails(BillDetailsRequest billDetailsRequest, Long idBill, Long idBillDetail) {
        ResponseEntity<ResponseObject> result = chaneQuantityBillDetails(billDetailsRequest, idBillDetail);
        updateChangeMoneyBill(idBill);
        return result;
    }

    @Override
    public ResponseEntity<ResponseObject> deleteBillToBillDetail(Long idBill, Long idBillDetail) {
        ResponseEntity<ResponseObject> result = billDeleteBillDetail(idBillDetail);
        updateChangeMoneyBill(idBill);
        return result;
    }

    @Override
    public ResponseEntity<ResponseObject> addHistorybill(HistoryBillRequest historyBillRequest, Long idBill) {
        Optional<Bill> optionalBill = billRepo.findById(idBill);
        if (optionalBill.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy Hóa Đơn", 1, idBill), HttpStatus.BAD_REQUEST);
        }
        Bill bill = optionalBill.get();
        HistoryBill historyBill = mapper.map(historyBillRequest, HistoryBill.class);
        historyBill.setBill(bill);
        for (TrangThaiBill trangThai : TrangThaiBill.values()) {
            if (trangThai.name().equals(historyBillRequest.getType()) || trangThai.getLabel().equals(historyBillRequest.getType())) {
                historyBill.setType(trangThai.getLabel());
                bill.setStatus(trangThai.getLabel());
                break;
            }
        }
        update(bill);
        historyBillService.createNew(historyBill);
        return new ResponseEntity<>(new ResponseObject("seccess", "Thay Đổi Trạng Thái Thành Công", 0, historyBillRequest), HttpStatus.OK);

    }

    @Override
    public ResponseEntity<ResponseObject> billPaymentHistory(PaymentHistoryRequest paymentHistoryRequest, Long idBill) {
        Optional<Bill> optionalBill = billRepo.findById(idBill);
        if (optionalBill.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy Hóa Đơn", 1, idBill), HttpStatus.BAD_REQUEST);
        }

        PaymentHistory paymentHistory = mapper.map(paymentHistoryRequest, PaymentHistory.class);
        paymentHistory.setBill(optionalBill.get());
        HistoryBill historyBill = new HistoryBill();
        historyBill.setBill(optionalBill.get());
        historyBill.setType(TrangThaiBill.DA_THANH_TOAN.getLabel());
        historyBillService.createNew(historyBill);
        paymentHistoryService.createNew(paymentHistory);
        return new ResponseEntity<>(new ResponseObject("seccess", "Xác Nhận Thanh Toán Thành Công", 0, paymentHistoryRequest), HttpStatus.OK);

    }

}

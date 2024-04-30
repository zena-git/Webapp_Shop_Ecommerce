package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.request.User.UserRequest;
import com.example.webapp_shop_ecommerce.dto.request.address.AddressRequest;
import com.example.webapp_shop_ecommerce.dto.request.customer.CustomerSupportRequest;
import com.example.webapp_shop_ecommerce.dto.request.mail.MailInputDTO;
import com.example.webapp_shop_ecommerce.dto.request.promotion.PromotionRequest;
import com.example.webapp_shop_ecommerce.dto.request.voucher.VoucherRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.customer.CustomerResponse;
import com.example.webapp_shop_ecommerce.dto.response.print.Print;
import com.example.webapp_shop_ecommerce.dto.response.productdetails.ProductDetailsResponse;
import com.example.webapp_shop_ecommerce.dto.response.productdetails.ProductDetailsSupportResponse;
import com.example.webapp_shop_ecommerce.dto.response.products.ProductResponse;
import com.example.webapp_shop_ecommerce.dto.response.promotion.PromotionSupportResponse;
import com.example.webapp_shop_ecommerce.dto.response.user.UserResponse;
import com.example.webapp_shop_ecommerce.dto.response.voucher.VoucherResponse;
import com.example.webapp_shop_ecommerce.entity.*;
import com.example.webapp_shop_ecommerce.infrastructure.enums.TrangThaiBill;
import com.example.webapp_shop_ecommerce.infrastructure.enums.TrangThaiGiamGia;
import com.example.webapp_shop_ecommerce.repositories.*;
import com.example.webapp_shop_ecommerce.service.*;

import com.example.webapp_shop_ecommerce.ultiltes.RandomStringGenerator;
import com.itextpdf.text.pdf.BaseFont;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.w3c.tidy.Tidy;
import org.apache.catalina.User;
import org.apache.commons.math3.analysis.function.Add;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.xhtmlrenderer.pdf.ITextFontResolver;
import org.xhtmlrenderer.pdf.ITextRenderer;
import static com.itextpdf.text.pdf.BaseFont.IDENTITY_H;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.print.*;
import java.io.*;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class SupportSevice {
    private static final String UTF_8 = "UTF-8";
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
    IProductDetailsRepository productDetailsRepo;
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
    IVoucherDetailsRepository voucherDetailsRepo;

    @Autowired
    ICustomerService customerService;
    @Autowired
    private ModelMapper mapper;

    @Autowired
    private IBillService billService;

    @Autowired
    private SpringTemplateEngine templateEngine;

    @Autowired
    private IClientService mailClientService;

    @Autowired
    private RandomStringGenerator randomStringGenerator;

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
        Optional<Promotion> otp = promotionService.findByIdAndPromotionDetails(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        PromotionSupportResponse obj = otp.map(pro -> mapper.map(pro, PromotionSupportResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    public ResponseEntity<?> findAllCustomerByDeleted(Boolean tyle){
        List<Customer> lstPromotion = customerRepo.findAllCustomerByDeleted(tyle);
        List<CustomerResponse> resultDto  = lstPromotion.stream().map(promotion -> mapper.map(promotion, CustomerResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    public ResponseEntity<?> findAllByDeleted(Boolean tyle){
        List<Promotion> lstPromotion = promotionRepo.findAllByDeleted(tyle);
        List<PromotionSupportResponse> resultDto  = lstPromotion.stream().map(promotion -> mapper.map(promotion, PromotionSupportResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    public ResponseEntity<?> findAllVoucherByDisabled(){
        List<Voucher> lstPromotion = voucherRepo.findAllByDeleted(false);
        List<VoucherResponse> resultDto  = lstPromotion.stream().map(promotion -> mapper.map(promotion, VoucherResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    public ResponseEntity<?> disableVoucher(Long id){
        Optional<Voucher> otp = voucherRepo.findById(id);
        System.out.println(otp.toString());
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        voucherRepo.disableVoucher(id, TrangThaiGiamGia.DA_HUY.getLabel());
        return new ResponseEntity<>(new ResponseObject("success","Thành công",0, id), HttpStatus.OK);
    }

    public ResponseEntity<?> disablePromotion(Long id){
        Optional<Promotion> otp = promotionRepo.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        promotionRepo.disablePromotion(id, TrangThaiGiamGia.DA_HUY.getLabel());
        productDetailsRepo.updateProductDetailsPromotionActiveToNullByPromotion(id);
        return new ResponseEntity<>(new ResponseObject("success","Thành công",0, id), HttpStatus.OK);
    }


    public ResponseEntity<?> recoverCustomer(Long id ){
        Optional<Customer> otp = customerRepo.findByIdDeleted(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        customerRepo.updateRecover(id);
        return new ResponseEntity<>(new ResponseObject("success","Thành công",0, id), HttpStatus.OK);
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
        String password = randomStringGenerator.generateRandomString(6);
        Users user = userOtp.orElse(new Users());
        user = mapper.map(request, Users.class);
        if (userOtp.isPresent()){
            user.setId(userOtp.get().getId());
            user.setUsersRole(userOtp.get().getUsersRole());
            usersService.update(user);
            return new ResponseEntity<>(new ResponseObject("success","Cập nhật thành công",0, request), HttpStatus.OK);
        }else {
            // Lưu dữ liệu và thực hiện gửi email song song
            CompletableFuture<ResponseEntity<?>> saveTask = CompletableFuture.supplyAsync(() -> {
                Users entity = new Users();
                entity = mapper.map(request, Users.class);
                PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
                entity.setPassword(passwordEncoder.encode(password));
                usersService.createNew(entity);
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

    public ResponseEntity<?> saveOrUpdateCustomer( CustomerSupportRequest customerDto, Long ...idCustomer){
        String password = randomStringGenerator.generateRandomString(6);
        if (idCustomer.length <= 0){
            // Lưu dữ liệu và thực hiện gửi email song song

            Optional<Customer> validatePhone = customerService.findByPhone(customerDto.getPhone());
            if(customerDto.getEmail() != null){
                Optional<Customer> validateEmail = customerService.findByEmail(customerDto.getEmail());
                if(validateEmail.isPresent()){
                    return new ResponseEntity<>(new ResponseObject("error","Email đã tồn tại",0, customerDto), HttpStatus.BAD_REQUEST);
                }
            }

            if(validatePhone.isPresent()){
                return new ResponseEntity<>(new ResponseObject("error","Số điện thoại đã tồn tại",0, customerDto), HttpStatus.BAD_REQUEST);
            }

            CompletableFuture<ResponseEntity<?>> saveTask = CompletableFuture.supplyAsync(() -> {
                Customer customer = new Customer();
                customer = mapper.map(customerDto, Customer.class);
                customer.setDeleted(false);
                customer.setCreatedDate(LocalDateTime.now());
                customer.setLastModifiedDate(LocalDateTime.now());
                customer.setCreatedBy("Admin");
                customer.setLastModifiedBy("Admin");
                PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
                customer.setPassword(passwordEncoder.encode(password));
                Customer customerReturn =  customerRepo.save(customer);

                Set<AddressRequest> lstAddressRequest = customerDto.getLstAddress();
                lstAddressRequest.forEach(addressRequest -> {
                    Address address = mapper.map(addressRequest, Address.class);
                    address.setId(null);
                    address.setCustomer(customerReturn);
                    addressService.createNew(address);
                });

                return new ResponseEntity<>(new ResponseObject("success","Thêm Mới Thành công",0, customerDto), HttpStatus.OK);
            });

            // Khi tiến trình lưu dữ liệu hoàn thành, thực hiện gửi email
            saveTask.thenAccept(resultEntity -> {
                if (resultEntity.getStatusCode() == HttpStatus.OK) {
                    CompletableFuture.runAsync(() -> {
                        if (customerDto.getEmail() != null) {
                            MailInputDTO mailInput = new MailInputDTO();
                            mailInput.setEmail(customerDto.getEmail());
                            mailInput.setPassword(password);
                            mailInput.setName(customerDto.getFullName());
                            mailClientService.create(mailInput);
                        }
                    });
                }
            });

            return saveTask.join();
        }else {
            Optional<Customer> customerOtp = customerRepo.findById(idCustomer[0]);
            if (customerOtp.isEmpty()){
                return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy khách hàng " + idCustomer[0], 1, null), HttpStatus.BAD_REQUEST);
            }
            Customer customer = customerOtp.get();
            if(!customer.getPhone().equals(customerDto.getPhone())){
                Optional<Customer> validatePhone = customerService.findByPhone(customerDto.getPhone());
                if(validatePhone.isPresent()){
                    return new ResponseEntity<>(new ResponseObject("error","Số điện thoại đã tồn tại",0, customerDto), HttpStatus.BAD_REQUEST);
                }
            }
            if(!customer.getEmail().equals(customerDto.getEmail())){
                Optional<Customer> validateEmail = customerService.findByEmail(customerDto.getEmail());
                if(validateEmail.isPresent()){
                    return new ResponseEntity<>(new ResponseObject("error","Email đã tồn tại",0, customerDto), HttpStatus.BAD_REQUEST);
                }
            }
            Set<AddressRequest> lstAddressRequest = customerDto.getLstAddress();
            Set<Address> lstAddress =  customer.getLstAddress();

            //Lst càn giữ
            List<Long> lstAddressId = lstAddressRequest.stream()
                    .filter(addressRequest -> addressRequest.getId() != null)
                    .map(AddressRequest::getId)
                    .collect(Collectors.toList());
            List<Long> lstAddressDelete = lstAddress.stream()
                    .filter(address -> !lstAddressId.contains(address.getId()))
                    .map(address -> {
                        return address.getId();
                    }).collect(Collectors.toList());
             addressRepo.deleteAllById(lstAddressDelete);

            lstAddressRequest.stream().map(address ->{

                if (address.getId() != null){
                    Optional<Address> otpAddress = addressRepo.findById(address.getId());
                    if (otpAddress.isEmpty()){
                        return null;
                    }
                    Address entity = mapper.map(address, Address.class);
                    entity.setId(address.getId());
                    entity.setCustomer(customerOtp.get());
                    addressService.update(entity);
                    return entity;
                }
                Address entity = mapper.map(address, Address.class);
                entity.setId(null);
                entity.setCustomer(customerOtp.get());
                addressService.createNew(entity);
                return entity;
            }).collect(Collectors.toList());

            customer = mapper.map(customerDto, Customer.class);
            customer.setId(customerOtp.get().getId());
            customerService.update(customer);
            return new ResponseEntity<>(new ResponseObject("success","Cập Nhật Thành công",0, customerDto), HttpStatus.OK);

        }

    }

    private byte[] generatePdfFromHtml(String html) throws Exception {
        ITextRenderer renderer = new ITextRenderer();
        renderer.setDocumentFromString(html);
        // Phải sử dụng Flying Saucer để hiển thị các font phức tạp trong PDF
        renderer.getFontResolver().addFont("./font/Roboto-Light.ttf", IDENTITY_H, true);
        renderer.layout();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        renderer.createPDF(outputStream);
        renderer.finishPDF();
        return outputStream.toByteArray();
    }

//    public void printDocument(String path) {
//        // Here you're opening the file.
//        File file = new File(path);
//        PdfDocument document = PdfDocument.open(new FileDataProvider(file));
//        // Getting an instance of `PrinterJob` and the default `PageFormat`.
//        PrinterJob printerJob = PrinterJob.getPrinterJob();
//        PageFormat pageFormat = printerJob.defaultPage();
//
//        // Removing the default margins.
//        Paper paperFormat = pageFormat.getPaper();
//        paperFormat.setImageableArea(0, 0, paperFormat.getWidth(), paperFormat.getHeight());
//        pageFormat.setPaper(paperFormat);
//
//        // A `Book` is a Java structure representing multiple printable pages.
//        Book printableBook = new Book();
//
//        // Each page you wish to print must be added to the `Book` as a printable object.
//        // You can specify a width and height for `renderPage()` to get your desired DPI when printing.
//        for (int i = 0; i < document.getPageCount(); i++) {
//            BufferedImage render = document.getPage(i).renderPage();
//            printableBook.append(new Print(render), pageFormat);
//        }
//
//        printerJob.setPageable(printableBook);
//
//        // Here you can choose to display a print dialog before the actual print call.
//        // You're using the default dialog from `PrinterJob`.
//        if (printerJob.printDialog()) {
//            try {
//                printerJob.print();
//            } catch (PrinterException prt) {
//                prt.printStackTrace();
//            }
//        }
//    }

    public byte[]  PrintInvoice(String billCode) throws Exception {
        SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm - dd/MM/yyyy");
        Map<String, Object> props = new HashMap<>();
        Bill b = billService.findBillByCode(billCode).get();
        props.put("invoiceDate", dateFormat.format(new Date()).toString());
        props.put("invoiceNumber", "1233");
        props.put("bill", b);
        if(b.getCustomer() != null){
            props.put("customer", b.getCustomer());
        }else{
            Customer customer = new Customer();
            customer.setFullName("Guest");
            props.put("customer", customer);
        }
        props.put("receiverName", b.getReceiverName());
        props.put("receiverPhone", b.getReceiverPhone());
        props.put("billDetails", b.getLstBillDetails());

        Set<BillDetails> billDetails = b.getLstBillDetails();

        BigDecimal totalNetTotal = billDetails.stream()
                .map(billDetail -> billDetail.getUnitPrice().multiply(BigDecimal.valueOf(billDetail.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDiscount = billDetails.stream()
                .map(BillDetails::getDiscount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);


        props.put("NetTotal", totalNetTotal);

        props.put("Discount", totalDiscount);
        props.put("Total", totalNetTotal.add(totalDiscount.negate()));

        Context context = new Context();
        context.setVariables(props);
        String html = templateEngine.process("invoice", context);
        byte[] pdfBytes = generatePdfFromHtml(html);
        return pdfBytes;
    }

    private String convertToXhtml(String html) throws UnsupportedEncodingException {
        Tidy tidy = new Tidy();
        tidy.setInputEncoding(UTF_8);
        tidy.setOutputEncoding(UTF_8);
        tidy.setXHTML(true);
        ByteArrayInputStream inputStream = new ByteArrayInputStream(html.getBytes(StandardCharsets.UTF_8));
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        tidy.parseDOM(inputStream, outputStream);
        return outputStream.toString(StandardCharsets.UTF_8);
    }

//    public ResponseEntity<?> saveOrUpdateCustomer( CustomerSupportRequest customerDto, Long ...idCustomer){
//        if (idCustomer.length <= 0){
//            Customer customer = new Customer();
//            customer = mapper.map(customerDto, Customer.class);
//            customer.setDeleted(false);
//            customer.setCreatedDate(LocalDateTime.now());
//            customer.setLastModifiedDate(LocalDateTime.now());
//            customer.setCreatedBy("Admin");
//            customer.setLastModifiedBy("Admin");
//            Customer customerReturn =  customerRepo.save(customer);
//            Set<AddressRequest> lstAddressRequest = customerDto.getLstAddress();
//            lstAddressRequest.stream().map(addressRequest -> {
//                Address address = mapper.map(addressRequest, Address.class);
//                address.setId(null);
//                address.setCustomer(customerReturn);
//                addressService.createNew(address);
//                return addressRequest;
//            }).collect(Collectors.toList());
//            return new ResponseEntity<>(new ResponseObject("success","Thêm Mới Thành công",0, customerDto), HttpStatus.OK);
//        }else {
//            Optional<Customer> customerOtp = customerRepo.findById(idCustomer[0]);
//            if (customerOtp.isEmpty()){
//                return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy khách hàng " + idCustomer[0], 1, null), HttpStatus.BAD_REQUEST);
//            }
//            Customer customer = customerOtp.get();
//            Set<AddressRequest> lstAddressRequest = customerDto.getLstAddress();
//            Set<Address> lstAddress =  customer.getLstAddress();
//
//            //Lst càn giữ
//            List<Long> lstAddressId = lstAddressRequest.stream()
//                    .filter(addressRequest -> addressRequest.getId() != null)
//                    .map(AddressRequest::getId)
//                    .collect(Collectors.toList());
//            List<Long> lstAddressDelete = lstAddress.stream()
//                    .filter(address -> !lstAddressId.contains(address.getId()))
//                    .map(address -> {
//                        return address.getId();
//                    }).collect(Collectors.toList());
//             addressRepo.deleteAllById(lstAddressDelete);
//
//            lstAddressRequest.stream().map(address ->{
//
//                if (address.getId() != null){
//                    Optional<Address> otpAddress = addressRepo.findById(address.getId());
//                    if (otpAddress.isEmpty()){
//                        return null;
//                    }
//                    Address entity = mapper.map(address, Address.class);
//                    entity.setId(address.getId());
//                    entity.setCustomer(customerOtp.get());
//                    addressService.update(entity);
//                    return entity;
//                }
//                Address entity = mapper.map(address, Address.class);
//                entity.setId(null);
//                entity.setCustomer(customerOtp.get());
//                addressService.createNew(entity);
//                return entity;
//            }).collect(Collectors.toList());
//
//            customer = mapper.map(customerDto, Customer.class);
//            customer.setId(customerOtp.get().getId());
//            customerService.update(customer);
//            return new ResponseEntity<>(new ResponseObject("success","Cập Nhật Thành công",0, customerDto), HttpStatus.OK);
//
//        }
//
//    }

}

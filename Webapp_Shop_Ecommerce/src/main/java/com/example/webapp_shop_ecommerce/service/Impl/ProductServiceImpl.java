package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.request.productdetails.ProductDetailsRequest;
import com.example.webapp_shop_ecommerce.dto.request.products.ProductRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Product;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import com.example.webapp_shop_ecommerce.infrastructure.converter.ProductConverter;
import com.example.webapp_shop_ecommerce.infrastructure.security.Authentication;
import com.example.webapp_shop_ecommerce.repositories.IProductDetailsRepository;
import com.example.webapp_shop_ecommerce.repositories.IProductRepository;
import com.example.webapp_shop_ecommerce.service.IProductDetailsService;
import com.example.webapp_shop_ecommerce.service.IProductService;
import com.example.webapp_shop_ecommerce.ultiltes.GenBarcode;
import com.example.webapp_shop_ecommerce.ultiltes.RandomStringGenerator;
import com.example.webapp_shop_ecommerce.ultiltes.exportExcel.ExportProduct;
import com.example.webapp_shop_ecommerce.ultiltes.exportExcel.ImportProduct;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import org.apache.commons.io.FilenameUtils;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;


@Service
public class ProductServiceImpl extends BaseServiceImpl<Product, Long, IProductRepository> implements IProductService {

    @Autowired
    IProductDetailsService productDetailsService;
    @Autowired
    ProductConverter productConverter;
    @Autowired
    IProductRepository productRepo;

    @Autowired
    IProductDetailsRepository productDetailsRepo;
    @Autowired
    ExportProduct exportProduct;
    @Autowired
    private Authentication authentication;
    @Autowired
    ImportProduct importProduct;
    @Autowired
    GenBarcode genBarcode;
    @Autowired
    RandomStringGenerator randomStringGenerator;
    @Override
    public Optional<Product> findByName(String name) {
        return repository.findByName(name);
    }

    @Override
    public Optional<Product> findByProductDetailByIdProduct(Long idProduct) {

        return repository.findProductDetailsById(idProduct);
    }

    @Override
    public List<Product> findProductByName(String name) {
        return repository.findProductByName(name);
    }

    @Override
    public ResponseEntity<ResponseObject> saveOrUpdate(ProductRequest request, Long... idProduct) {
        Product entity = new Product();
        if (entity != null && idProduct.length <= 0) {
            //create
            Optional<Product> otp = findByName(request.getName());
            if (otp.isPresent()) {
                return new ResponseEntity<>(new ResponseObject("error", "Tên sản phẩm đã tồn tại", 1, request), HttpStatus.BAD_REQUEST);
            }
            entity = productConverter.convertRequestToEntity(request);
            if (entity==null) {
                return new ResponseEntity<>(new ResponseObject("error", "Không được để trống hoặc null", 1, request), HttpStatus.BAD_REQUEST);
            }

            if (entity.getCode() !=null){
                if (repository.existsByCode(entity.getCode())){
                    return new ResponseEntity<>(new ResponseObject("error", "Mã đã có trong hệ thống", 1, request), HttpStatus.BAD_REQUEST);
                }
            }else {
                entity.setCode("PD"+randomStringGenerator.generateRandomString(6));
            }

            entity.setId(null);
            entity.setDeleted(false);
            entity.setStatus("0");
            entity.setCreatedBy(authentication.getUsers().getFullName());
            entity.setCreatedDate(LocalDateTime.now());
            entity.setLastModifiedBy(authentication.getUsers().getFullName());
            entity.setLastModifiedDate(LocalDateTime.now());
        } else {
            Long id = idProduct[0];
            System.out.println("Update ID: " +id);
            Optional<Product> otp = productRepo.findById(id);
            if (otp.isEmpty()) {
                return new ResponseEntity<>(new ResponseObject("error", "Không Thấy ID", 1, request), HttpStatus.BAD_REQUEST);
            }
            entity = otp.orElse(null);
            entity = productConverter.convertRequestToEntity(request);
            entity.setId(id);
            entity.setLastModifiedBy(authentication.getUsers().getFullName());
            entity.setStatus("0");
            entity.setLastModifiedDate(LocalDateTime.now());
            entity.setDeleted(false);
        }
        Product product = productRepo.save(entity);
        if (product != null) {
            //Tạo product details new
            List<ProductDetailsRequest> lst = request.getLstProductDetails().stream()
                    .map(productDetailDto -> {
                        productDetailDto.setProduct(product.getId());
                        return productDetailDto;
                    })
                    .collect(Collectors.toList());
//            List<ProductDetailsRequest> lstProductDetailsNoId = lst.stream().filter(productDetailsDto -> productDetailsDto.getId() == null).collect(Collectors.toList());
//            List<ProductDetailsRequest> lstProductDetailsIsId = lst.stream().filter(productDetailsDto -> productDetailsDto.getId() != null).collect(Collectors.toList());
           if (lst.size() > 0) {
               //update xóa bỏ rôi moi dc luu
               productDetailsService.updateAll(lst);
               productDetailsService.saveAll(lst);
           }
        }
        return new ResponseEntity<>(new ResponseObject("success", "Thành Công", 0, request), HttpStatus.CREATED);

    }

    @Override
    public ResponseEntity<ResponseObject> save(ProductRequest request) {
        Product entity = new Product();

            //create
            Optional<Product> otp = findByName(request.getName());
            if (otp.isPresent()) {
                return new ResponseEntity<>(new ResponseObject("error", "Tên sản phẩm đã tồn tại", 1, request), HttpStatus.BAD_REQUEST);
            }
            entity = productConverter.convertRequestToEntity(request);
            if (entity==null) {
                return new ResponseEntity<>(new ResponseObject("error", "Không được để trống hoặc null", 1, request), HttpStatus.BAD_REQUEST);
            }

            if (entity.getCode() !=null){
                if (repository.existsByCode(entity.getCode())){
                    return new ResponseEntity<>(new ResponseObject("error", "Mã đã có trong hệ thống", 1, request), HttpStatus.BAD_REQUEST);
                }
            }else {
                entity.setCode("PD"+randomStringGenerator.generateRandomString(6));
            }

            entity.setId(null);
            entity.setDeleted(false);
            entity.setStatus("0");
            entity.setCreatedBy(authentication.getUsers().getFullName());
            entity.setCreatedDate(LocalDateTime.now());
            entity.setLastModifiedBy(authentication.getUsers().getFullName());
            entity.setLastModifiedDate(LocalDateTime.now());
        Product product = productRepo.save(entity);
        if (product != null) {
            //Tạo product details new
            List<ProductDetailsRequest> lst = request.getLstProductDetails().stream()
                    .map(productDetailDto -> {
                        productDetailDto.setProduct(product.getId());
                        return productDetailDto;
                    })
                    .collect(Collectors.toList());
//            List<ProductDetailsRequest> lstProductDetailsNoId = lst.stream().filter(productDetailsDto -> productDetailsDto.getId() == null).collect(Collectors.toList());
//            List<ProductDetailsRequest> lstProductDetailsIsId = lst.stream().filter(productDetailsDto -> productDetailsDto.getId() != null).collect(Collectors.toList());
            if (lst.size() > 0) {
                productDetailsService.saveAll(lst);
            }
        }
        return new ResponseEntity<>(new ResponseObject("success", "Thành Công", 0, request), HttpStatus.CREATED);

    }

    @Override
    public Page<Product> findProductsAndDetailsNotDeleted(Pageable pageable, Map<String,String> keyWork) {

        return repository.findProductsAndDetailsNotDeleted(pageable,keyWork);
    }

    @Override
    public Page<Product> findProductsClientAndDetailsNotDeleted(Pageable pageable, Map<String, String> keyWork) {
        return repository.findProductsClientAndDetailsNotDeleted(pageable,keyWork);
    }

    @Override
    public Optional<Product> findProductByIdAndDetailsNotDeleted(Long id,Map<String,String> keyWork) {
        Optional<Product> otp = repository.findProductByIdAndDetailsNotDeleted(id,keyWork);
        if (otp.isEmpty()) {
            keyWork = Map.of(
                    "size", "",
                    "color", "",
                    "min", "0",
                    "max", "9999999999999999999999"
            );
            otp = repository.findProductByIdAndDetailsNotDeleted(id,keyWork);
            if (otp.isPresent()){{
                Product product = otp.orElse(new Product());
                Set<ProductDetails> newDetails = new HashSet<>();
                product.setLstProductDetails(newDetails);
                otp = Optional.ofNullable(product);
            }}
        }
        return otp;
    }
    private boolean isValidNumber(String str) {
        try {
            Long.parseLong(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
    @Override
    public ResponseEntity<Resource> generateBarcodes(List<String> dataList) throws IOException {
        if (dataList == null || dataList.isEmpty()) {
            // Handle the case where no data is provided
            return ResponseEntity.badRequest().body(new ByteArrayResource("No data provided for barcodes generation".getBytes()));
        }
        // Kiểm tra xem tất cả các phần tử trong ids có phải là số (Long) không
        if (dataList.stream().anyMatch(id -> id == null || !isValidNumber(id))) {
            return ResponseEntity.badRequest().body(new ByteArrayResource("ID không hợp lệ".getBytes()));
        }

        List<Long> idNumbers = dataList.stream().map(Long::valueOf).toList();
        List<ProductDetails> lst = productDetailsRepo.findAllById(idNumbers);
        ByteArrayOutputStream baos = genBarcode.genBarcode(lst);
        // Wrap the byte array in a ByteArrayResource
        ByteArrayResource resource = new ByteArrayResource(baos.toByteArray());
        // Trả về tệp ZIP
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header("Content-Disposition", "attachment; filename=barcodes.zip")
                .body(resource);
    }

    @Override
    public ResponseEntity<Resource> exportExcel(List<String> dataList) throws IOException {
        if (dataList == null || dataList.isEmpty()) {
            // Handle the case where no data is provided
            return ResponseEntity.badRequest().body(new ByteArrayResource("No data provided for barcodes generation".getBytes()));
        }
        // Kiểm tra xem tất cả các phần tử trong ids có phải là số (Long) không
        if (dataList.stream().anyMatch(id -> id == null || !isValidNumber(id))) {
            return ResponseEntity.badRequest().body(new ByteArrayResource("ID khong hop le".getBytes()));
        }

        List<Long> idNumbers = dataList.stream().map(Long::valueOf).toList();
        List<Product> lst = productRepo.findAllProductDetailsById(idNumbers);

        if (lst.size() == 0) {
            return ResponseEntity.badRequest().body(new ByteArrayResource("Khong tim thay ID Product hop le".getBytes()));
        }

        Workbook workbook = exportProduct.writeExcel(lst);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);

        // Get the current date and time
        Date currentDate = new Date();
        // Create a formatter for the desired date and time format
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
        // Format the current date and time
        String dateTime = dateFormat.format(currentDate);


        // Thiết lập header của response
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment","DataProduct_"+ dateTime+".xlsx");

        // Tạo một đối tượng Resource từ mảng byte của ByteArrayOutputStream
        ByteArrayResource resource = new ByteArrayResource(outputStream.toByteArray());

        // Trả về tệp Excel dưới dạng Resource
        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);

    }

    @Override
    public ResponseEntity<?> importExcel(MultipartFile file) throws IOException {
        if (file == null) {
            return new ResponseEntity<>(new ResponseObject("error", "File không tồn tại", 0, null), HttpStatus.BAD_REQUEST);
        }

        // Kiểm tra phần mở rộng của tệp
        String fileName = file.getOriginalFilename();
        System.out.println(fileName);
        // Lấy phần mở rộng của tên tệp
        String fileExtension = FilenameUtils.getExtension(file.getOriginalFilename());

        // Kiểm tra nếu phần mở rộng là xls hoặc xlsx (tệp Excel)
        if (!"xls".equalsIgnoreCase(fileExtension) && !"xlsx".equalsIgnoreCase(fileExtension)) {
            return new ResponseEntity<>(new ResponseObject("error", "Tệp không phải là tệp Excel", 0, null), HttpStatus.BAD_REQUEST);
        }

        Map<String, Integer> output = importProduct.readExcel(file);
        StringBuilder outputString = new StringBuilder();
        outputString.append("Import thêm mới " + output.get("productCreate") + " sản phẩm, " + output.get("productDetailsCreate") + " chi tiết sản phẩm");
        outputString.append("\n");
        outputString.append("Import cập nhật " + output.get("productUpdate") + " sản phẩm, " + output.get("productDetailsUpdate") + " chi tiết sản phẩm");
        outputString.append("\n");
        outputString.append("Import lỗi " + output.get("error") + " bản ghi");
        return new ResponseEntity<>(new ResponseObject("success", outputString.toString(), 0, null), HttpStatus.OK);

    }

    @Override
    public ResponseEntity<ResponseObject> updateStatus(ProductRequest request, Long idProduct) {
        if (request.getStatus() == null) {
            return new ResponseEntity<>(new ResponseObject("error", "Trạng Thái Không Đươc Để Trống", 1, request), HttpStatus.BAD_REQUEST);
        }
        repository.updateStatus(request.getStatus(), idProduct);
        return new ResponseEntity<>(new ResponseObject("success", "Cập Nhật Trạng Thái Thành Công", 0, request), HttpStatus.OK);
    }

    @Override
    public Page<Product> findProductsDeleted(Pageable pageable) {
        return repository.findProductsDeleted(pageable);
    }

    @Override
    public ResponseEntity<ResponseObject> productRecover(Long idProduct) {
        if (idProduct == null) {
            return new ResponseEntity<>(new ResponseObject("error", "ID không hợp lệ", 1, null), HttpStatus.BAD_REQUEST);
        }
        repository.productRecover(idProduct);
        return new ResponseEntity<>(new ResponseObject("success", "Cập Nhật Trạng Thái Thành Công", 0, idProduct), HttpStatus.OK);

    }

    @Override
    public List<Product> findProductsAndDetailsNotDeleted() {
        return repository.findProductsAndDetailsNotDeleted();
    }

}

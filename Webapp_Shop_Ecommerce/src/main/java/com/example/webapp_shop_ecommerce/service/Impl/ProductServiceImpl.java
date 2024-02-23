package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.request.productdetails.ProductDetailsRequest;
import com.example.webapp_shop_ecommerce.dto.request.products.ProductRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Product;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import com.example.webapp_shop_ecommerce.infrastructure.converter.ProductConverter;
import com.example.webapp_shop_ecommerce.repositories.IProductDetailsRepository;
import com.example.webapp_shop_ecommerce.repositories.IProductRepository;
import com.example.webapp_shop_ecommerce.service.IProductDetailsService;
import com.example.webapp_shop_ecommerce.service.IProductService;
import com.example.webapp_shop_ecommerce.ultiltes.GenBarcode;
import com.example.webapp_shop_ecommerce.ultiltes.exportExcel.ExportProduct;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
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

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
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
    GenBarcode genBarcode;

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
                return new ResponseEntity<>(new ResponseObject("Fail", "Tên sản phẩm đã tồn tại", 1, request), HttpStatus.BAD_REQUEST);
            }
            entity = productConverter.convertRequestToEntity(request);
            if (entity==null) {
                return new ResponseEntity<>(new ResponseObject("Fail", "Không được để trống hoặc null", 1, request), HttpStatus.BAD_REQUEST);
            }

            entity.setId(null);
            entity.setDeleted(false);
            entity.setCreatedBy("Admin");
            entity.setCreatedDate(LocalDateTime.now());
            entity.setLastModifiedBy("Admin");
            entity.setLastModifiedDate(LocalDateTime.now());
        } else {

            System.out.println("Update ID: " + idProduct[0]);
            Optional<Product> otp = productRepo.findById(idProduct[0]);
            if (otp.isEmpty()) {
                return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, request), HttpStatus.BAD_REQUEST);
            }
            entity = otp.orElse(null);
            entity = productConverter.convertRequestToEntity(request);
            entity.setId(idProduct[0]);
            entity.setLastModifiedBy("Admin");
            entity.setLastModifiedDate(LocalDateTime.now());
            entity.setDeleted(false);
        }
        Product product = productRepo.save(entity);
        if (product != null) {
            //Update thi xoa mem all detail dang co
            if (idProduct.length > 0) {
                productDetailsService.updateProductDetailsByProductId(idProduct[0]);
            }
            //Tạo product details new
            List<ProductDetailsRequest> lst = request.getLstProductDetails().stream()
                    .map(productDetailDto -> {
                        productDetailDto.setProduct(product.getId());
                        return productDetailDto;
                    })
                    .collect(Collectors.toList());
            System.out.println(lst);
            productDetailsService.saveAll(lst);
        }
        return new ResponseEntity<>(new ResponseObject("Success", "Thêm Mới Thành Công", 0, request), HttpStatus.CREATED);

    }

    @Override
    public Page<Product> findProductsAndDetailsNotDeleted(Pageable pageable,String name) {
        return repository.findProductsAndDetailsNotDeleted(pageable,name);
    }

    @Override
    public Optional<Product> findProductByIdAndDetailsNotDeleted(Long id) {


        return repository.findProductByIdAndDetailsNotDeleted(id);
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
            return ResponseEntity.badRequest().body(new ByteArrayResource("ID không hợp lệ".getBytes()));
        }

        List<Long> idNumbers = dataList.stream().map(Long::valueOf).toList();
        List<Product> lst = productRepo.findAllById(idNumbers);

        if (lst.size() == 0) {
            return ResponseEntity.badRequest().body(new ByteArrayResource("Không hợp lệ".getBytes()));
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

}

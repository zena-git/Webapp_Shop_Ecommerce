package com.example.webapp_shop_ecommerce.ultiltes.exportExcel;

import com.example.webapp_shop_ecommerce.entity.*;
import com.example.webapp_shop_ecommerce.entity.Color;
import com.example.webapp_shop_ecommerce.repositories.*;
import com.example.webapp_shop_ecommerce.service.*;
import com.example.webapp_shop_ecommerce.ultiltes.RandomCodeGenerator;
import com.example.webapp_shop_ecommerce.ultiltes.RandomStringGenerator;
import org.apache.poi.ss.formula.atp.Switch;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class ImportProduct {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");


    @Autowired
    ICategoryService categoryService;

    @Autowired
    IMaterialService materialService;

    @Autowired
    IBrandService brandService;

    @Autowired
    IStyleService styleService;

    @Autowired
    ISizeService sizeService;

    @Autowired
    IColorService colorService;

    @Autowired
    IProductRepository productRepo;

    @Autowired
    IProductDetailsRepository productDetailsRepo;

    @Autowired
    IProductDetailsService productDetailsService;

    @Autowired
    IColorRepository colorRepo;
    @Autowired
    ISizeRepository sizeRepo;

    @Autowired
    IMaterialRepository materialRepo;

    @Autowired
    IBrandRepository brandRepo;

    @Autowired
    IStyleRepository styleRepo;

    @Autowired
    ICategoryRepository categoryRepo;

    @Autowired
    RandomStringGenerator randomStringGenerator;

    @Autowired
    RandomCodeGenerator randomCodeGenerator;
    public Map<String, Integer> readExcel(MultipartFile file) throws IOException {
        Integer productCreate = 0;
        Integer productUpdate = 0;
        Integer productDetailsCreate = 0;
        Integer productDetailsUpdate = 0;
        Integer error = 0;
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        int numberOfSheets = workbook.getNumberOfSheets();
        for (int i = 0; i < numberOfSheets; i++) {
            Sheet sheet = workbook.getSheetAt(i);
            setSheetToTextFormat(sheet);
            Map<String, Integer> output = processSheet(sheet);
            productCreate += output.get("productCreate");
            productUpdate += output.get("productUpdate");
            productDetailsCreate += output.get("productDetailsCreate");
            productDetailsUpdate += output.get("productDetailsUpdate");
            error += output.get("error");
        }
        Map<String, Integer> output = new HashMap<String,Integer>();
        output.put("productCreate", productCreate);
        output.put("productUpdate", productUpdate);
        output.put("productDetailsCreate", productDetailsCreate);
        output.put("productDetailsUpdate", productDetailsUpdate);
        output.put("error", error);
        return output;
    }

    private Map<String, Integer> processSheet(Sheet sheet) {
        Map<String, Integer> output = new HashMap<String,Integer>();
        Integer productCreate = 0;
        Integer productUpdate = 0;
        Integer productDetailsCreate = 0;
        Integer productDetailsUpdate = 0;
        Integer error = 0;

        Iterator<Row> rowIterator = sheet.iterator();
        Product product = readHeader(rowIterator);
        if (product == null) {
            output.put("error", ++error);
            output.put("productCreate", productCreate);
            output.put("productUpdate", productUpdate);
            output.put("productDetailsCreate", productDetailsCreate);
            output.put("productDetailsUpdate", productDetailsUpdate);
            return output;
        }
        rowIterator = sheet.iterator(); // Reset rowIterator to the beginning
        List<ProductDetails> lstProductDetails = readBody(rowIterator).stream().filter(productDetails ->
                productDetails.getColor() !=null || productDetails.getSize() != null ||
                        productDetails.getQuantity() != null || productDetails.getPrice() != null ||
                        productDetails.getWeight() != null
        ).collect(Collectors.toList());

        for (ProductDetails productDetails : lstProductDetails){
            System.out.println(productDetails.toString());
        }
        Optional<Product> productOpt = productRepo.findByCode(product.getCode());

        if (productOpt.isPresent()) {
            Product productDb = productOpt.get();
            productDb.setName(product.getName());
            productDb.setBrand(product.getBrand());
            productDb.setCategory(product.getCategory());
            productDb.setMaterial(product.getMaterial());
            productDb.setStyle(product.getStyle());
            productDb.setDescription(product.getDescription());
            productDb.setStatus(product.getStatus());
            productDb.setImageUrl(product.getImageUrl());
            Product productReturn = productRepo.save(productDb);
            productUpdate++;

            for (ProductDetails productDetails : lstProductDetails) {
                Optional<ProductDetails> productDetailsOpt = productDetailsRepo.findByProductDetailByProductAndSizeAndColor(productDb.getId(), productDetails.getColor().getId(), productDetails.getSize().getId());
                if (productDetailsOpt.isPresent()){
                    ProductDetails entity =  productDetailsOpt.get();
                    entity.setQuantity(entity.getQuantity() + productDetails.getQuantity());
                     productDetailsService.update(entity);
                     productDetailsUpdate++;

                }else{
                    productDetails.setProduct(productReturn);
                    productDetails.setStatus("0");
                    if (productDetailsRepo.existsByCode(productDetails.getCode())) {
                        productDetails.setCode("PD"+randomStringGenerator.generateRandomString(6));
                    }
                    if (productDetailsRepo.existsByBarcode(productDetails.getBarcode())) {
                        productDetails.setBarcode(randomCodeGenerator.generateRandomBarcode());
                    }

                    productDetailsService.createNew(productDetails);
                    productDetailsCreate++;
                }
            }
        }else {

            product.setDeleted(false);
            product.setCreatedBy("System");
            product.setCreatedDate(LocalDateTime.now());
            product.setLastModifiedBy("System");
            product.setLastModifiedDate(LocalDateTime.now());
            if (lstProductDetails.size() == 0){
                error++;
            }else {
                Product productReturn = productRepo.save(product);
                productCreate++;
                for (ProductDetails productDetails :lstProductDetails){
                    Optional<ProductDetails> productDetailsOpt = productDetailsRepo.findByProductDetailByProductAndSizeAndColor(productReturn.getId(), productDetails.getColor().getId(), productDetails.getSize().getId());
                    if (productDetailsOpt.isPresent()){
                        ProductDetails entity =  productDetailsOpt.get();
                        entity.setQuantity(entity.getQuantity() + productDetails.getQuantity());
                        productDetailsService.update(entity);
                        productDetailsUpdate++;

                    }else{
                        if (productDetailsRepo.existsByCode(productDetails.getCode())) {
                            productDetails.setCode("PD"+randomStringGenerator.generateRandomString(6));
                        }
                        if (productDetailsRepo.existsByBarcode(productDetails.getBarcode())) {
                            productDetails.setBarcode(randomCodeGenerator.generateRandomBarcode());
                        }
                        productDetails.setProduct(productReturn);
                        productDetailsService.createNew(productDetails);
                        productDetailsCreate++;
                    }



                }
            }


        }

        output.put("error", error);
        output.put("productCreate", productCreate);
        output.put("productUpdate", productUpdate);
        output.put("productDetailsCreate", productDetailsCreate);
        output.put("productDetailsUpdate", productDetailsUpdate);
        return output;
    }

    private Product readHeader(Iterator<Row> rowIterator){
        final int rowCode = 0;
        final int rowName = 1;
        final int rowImage = 2;
        final int rowCategory = 3;
        final int rowBrand = 4;
        final int rowMaterial = 5;
        final int rowStyle = 6;
        final int rowDescription = 7;
        final int rowStatus = 8;
        final int rowCreatedBy = 9;
        final int rowCreatedDate = 10;
        final int rowLastModifiedBy = 11;
        final int rowLastModifiedDate  = 12;

        Product product = new Product();
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            // Xử lý từng hàng trong sheet ở đây
            Iterator<Cell> cellIterator = row.cellIterator();
            // Biến đếm cột, bắt đầu từ 0
            int columnCount = 0;
            while (cellIterator.hasNext()) {
                Cell cell = cellIterator.next();
                // Nếu đang xét cột thứ hai
                if (columnCount == 1) {
                    Object cellValue = getCellValue(cell);
                    if (cellValue == null || cellValue.toString().isEmpty()) {
                        continue;
                    }
                    int rowIndex = cell.getRowIndex();
                    switch (rowIndex) {
                        case rowCode:
                            String code = Objects.toString(cellValue, "null");
                            if (code == null && code.isEmpty()) {
                               return null;
                            }
                            product.setCode(code);
                            break;
                        case rowName:
                            String name = Objects.toString(cellValue, "null");
                            if (name == null && name.isEmpty()) {
                                return null;
                            }
                            product.setName(name);
                            break;
                        case rowImage:
                            String image = Objects.toString(cellValue, "null");
                            if (image == null && image.isEmpty()) {
                                return null;
                            }
                            product.setImageUrl(image);
                            break;
                        case rowCategory:
                            String valueCategory = Objects.toString(cellValue, "null");
                            if (valueCategory == null && valueCategory.isEmpty()) {
                                return null;
                            }
                            Category category = null;
                            Optional<Category> categoryOpt = categoryRepo.findByName(valueCategory);
                            if (categoryOpt.isEmpty()) {
                                Category entity = new Category();
                                entity.setName(valueCategory);
                                entity.setDeleted(false);
                                entity.setCreatedDate(LocalDateTime.now());
                                entity.setCreatedBy("System");
                                entity.setLastModifiedDate(LocalDateTime.now());
                                entity.setLastModifiedBy("System");
                                category = categoryRepo.save(entity);
                            }else {
                                category = categoryOpt.get();
                            }
                            product.setCategory(category);
                            break;
                        case rowBrand:
                            String valueBrand = Objects.toString(cellValue, "null");
                            if (valueBrand == null && valueBrand.isEmpty()) {
                                return null;
                            }
                            Brand brand = null;
                            Optional<Brand> brandOpt = brandRepo.findByName(valueBrand);
                            if (brandOpt.isEmpty()) {
                                Brand entity = new Brand();
                                entity.setName(valueBrand);
                                entity.setDeleted(false);
                                entity.setCreatedDate(LocalDateTime.now());
                                entity.setCreatedBy("System");
                                entity.setLastModifiedDate(LocalDateTime.now());
                                entity.setLastModifiedBy("System");
                                brand = brandRepo.save(entity);
                            }else {
                                brand = brandOpt.get();
                            }
                            product.setBrand(brand);
                            break;
                        case rowMaterial:
                            String valueMaterial = Objects.toString(cellValue, "null");
                            if (valueMaterial == null && valueMaterial.isEmpty()) {
                                return null;
                            }
                            Material material = null;
                            Optional<Material> materialOpt = materialRepo.findByName(valueMaterial);
                            if (materialOpt.isEmpty()) {
                                Material entity = new Material();
                                entity.setName(valueMaterial);
                                entity.setDeleted(false);
                                entity.setCreatedDate(LocalDateTime.now());
                                entity.setCreatedBy("System");
                                entity.setLastModifiedDate(LocalDateTime.now());
                                entity.setLastModifiedBy("System");
                                material = materialRepo.save(entity);
                            }else {
                                material = materialOpt.get();
                            }
                            product.setMaterial(material);
                            break;
                        case rowStyle:
                            String valueStyle = Objects.toString(cellValue, "null");
                            if (valueStyle == null && valueStyle.isEmpty()) {
                                return null;
                            }
                            Style style = null;
                            Optional<Style> styleOpt = styleRepo.findByName(valueStyle);
                            if (styleOpt.isEmpty()) {
                                Style entity = new Style();
                                entity.setName(valueStyle);
                                entity.setDeleted(false);
                                entity.setCreatedDate(LocalDateTime.now());
                                entity.setCreatedBy("System");
                                entity.setLastModifiedDate(LocalDateTime.now());
                                entity.setLastModifiedBy("System");
                                style = styleRepo.save(entity);
                            }else {
                                style = styleOpt.get();
                            }
                            product.setStyle(style);
                            break;
                        case rowDescription:
                            String description = Objects.toString(cellValue, "null");
                            if (description == null && description.isEmpty()) {
                                return null;
                            }
                            product.setDescription(description);
                            break;
                        case rowStatus:
                            String status = Objects.toString(cellValue, "null");
                            if (status == null && status.isEmpty()) {
                                return null;
                            }
                            product.setStatus(status.equalsIgnoreCase("Đang Bán")?"0":"1");
                            break;
                            default:
                            break;
                    }
                }

                // Tăng biến đếm cột lên 1 sau mỗi lần lặp
                columnCount++;
            }
        }
        return product;
    }

    private  List<ProductDetails> readBody(Iterator<Row> rowIterator){
        final int columnCode = 0;
        final int columnBarcode = 1;
        final int columnImage = 2;
        final int columnSize = 3;
        final int columnColor = 4;
        final int columnPrice = 5;
        final int columnQuantity = 6;
        final int columnWeight = 7;
        final int columnStatus = 8;
        final int columnCreatedBy = 9;
        final int columnCreatedDate = 10;
        final int columnLastModifiedBy = 11;
        final int columnLastModifiedDate  = 12;

        List<ProductDetails> lstProductDetails = new ArrayList<>();
        int currentRow = 0;
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            currentRow++;

            // Skip rows until row 16
            if (currentRow < 16) {
                continue;
            }
            // Xử lý từng hàng trong sheet ở đây
            Iterator<Cell> cellIterator = row.cellIterator();
            ProductDetails productDetails = new ProductDetails();
            while (cellIterator.hasNext()) {
                Cell cell = cellIterator.next();
                cell.setCellType(CellType.STRING);
                Object cellValue = getCellValue(cell);
                if (cellValue == null || cellValue.toString().isEmpty()) {
                    continue;
                }
                    int columnIndex = cell.getColumnIndex();
                    switch (columnIndex) {
                        case columnCode:
                            String code = Objects.toString(cellValue, "null");
                            if (code == null && code.isEmpty()) {
                                continue;
                            }
                            productDetails.setCode(code);
                            break;
                        case columnBarcode:
                            String barcode = Objects.toString(cellValue, "null");
                            if (barcode == null && barcode.isEmpty()) {
                                continue;
                            }
                            productDetails.setBarcode(barcode);
                            break;
                        case columnImage:
                            String image = Objects.toString(cellValue, "null");
//                            if (image == null && image.isEmpty()) {
//                                continue;
//                            }
                            productDetails.setImageUrl(image);
                            break;
                        case columnSize:
                            String valueSize = Objects.toString(cellValue, "null");
                            if (valueSize == null && valueSize.isEmpty()) {
                                continue;
                            }
                            Size size = null;
                            Optional<Size> sizeOpt = sizeService.findByName(valueSize);
                            if (sizeOpt.isEmpty()) {
                                Size entity = new Size();
                                entity.setName(valueSize);
                                entity.setDeleted(false);
                                entity.setCreatedDate(LocalDateTime.now());
                                entity.setCreatedBy("System");
                                entity.setLastModifiedDate(LocalDateTime.now());
                                entity.setLastModifiedBy("System");
                                size = sizeRepo.save(entity);
                            }else {
                                size = sizeOpt.get();
                            }
                            productDetails.setSize(size);
                            break;
                        case columnColor:
                            String valueColor = Objects.toString(cellValue, "null");
                            if (valueColor == null && valueColor.isEmpty()) {
                                continue;
                            }
                            Color color = null;
                            Optional<Color> colorOpt = colorService.findByName(valueColor);
                            if (colorOpt.isEmpty()) {
                                Color entity = new Color();
                                entity.setName(valueColor);
                                entity.setDeleted(false);
                                entity.setCreatedDate(LocalDateTime.now());
                                entity.setCreatedBy("System");
                                entity.setLastModifiedDate(LocalDateTime.now());
                                entity.setLastModifiedBy("System");
                                color = colorRepo.save(entity);
                            }else {
                                color = colorOpt.get();
                            }

                            productDetails.setColor(color);
                            break;
                        case columnPrice:
                            String price = Objects.toString(cellValue, "null");
                            if (price == null && price.isEmpty()) {
                                continue;
                            }
                            try {
                                productDetails.setPrice(new BigDecimal(price));
                            } catch (NumberFormatException e) {
                                productDetails.setPrice(BigDecimal.ZERO);
                            }
                            break;
                        case columnQuantity:
                            String quantity = Objects.toString(cellValue, "null");
                            if (quantity == null && quantity.isEmpty()) {
                                continue;
                            }
                            try {
                                productDetails.setQuantity(Integer.valueOf(quantity));
                            } catch (NumberFormatException e) {
                                productDetails.setQuantity(0);
                            }
                            break;
                        case columnWeight:
                            String weight = Objects.toString(cellValue, "null");
                            if (weight == null && weight.isEmpty()) {
                                continue;
                            }
                            try {
                                productDetails.setWeight(Integer.parseInt(weight));

                                System.out.println("weight: " + productDetails.getWeight());
                                System.out.println("weight: " + productDetails.getWeight());

                            } catch (NumberFormatException e) {
                                productDetails.setWeight(0);
                            }
                            break;

                        default:
                            break;
                    }
                }

            lstProductDetails.add(productDetails);
        }
        return lstProductDetails;
    }
    private void setSheetToTextFormat(Sheet sheet) {
        Workbook workbook = sheet.getWorkbook();
        CreationHelper createHelper = workbook.getCreationHelper();
        CellStyle textStyle = workbook.createCellStyle();
        textStyle.setDataFormat(createHelper.createDataFormat().getFormat("@"));

        // Lặp qua tất cả các dòng và cột trên sheet
        for (Row row : sheet) {
            for (Cell cell : row) {
                cell.setCellStyle(textStyle);
            }
        }
    }
    // Get cell value
    private static Object getCellValue(Cell cell) {
        Object cellValue = null;

        switch (cell.getCellType()) {
            case BOOLEAN:
                cellValue = cell.getBooleanCellValue();
                break;
            case FORMULA:
                Workbook workbook = cell.getSheet().getWorkbook();
                FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();
                CellValue formulaCellValue = evaluator.evaluate(cell);
                switch (formulaCellValue.getCellType()) {
                    case BOOLEAN:
                        cellValue = formulaCellValue.getBooleanValue();
                        break;
                    case NUMERIC:
                        cellValue = formulaCellValue.getNumberValue();
                        break;
                    case STRING:
                        cellValue = formulaCellValue.getStringValue();
                        break;
                    default:
                        cellValue = cell.getStringCellValue();
                        break;
                }
                break;
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    cellValue = cell.getDateCellValue();
                } else {
                    cellValue = cell.getNumericCellValue();
                }
                break;
            case STRING:
                cellValue = cell.getStringCellValue();
                break;
            case BLANK:
                cellValue = "";
                break;
            case ERROR:
                cellValue = cell.getErrorCellValue();
                break;
            default:
                cellValue = cell.getStringCellValue();
                break;
        }

        return cellValue;
    }
}



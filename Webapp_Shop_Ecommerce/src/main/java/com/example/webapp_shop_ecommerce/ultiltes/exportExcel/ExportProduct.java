package com.example.webapp_shop_ecommerce.ultiltes.exportExcel;

import com.example.webapp_shop_ecommerce.entity.Brand;
import com.example.webapp_shop_ecommerce.entity.Category;
import com.example.webapp_shop_ecommerce.entity.Product;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import com.example.webapp_shop_ecommerce.repositories.IProductRepository;
import com.example.webapp_shop_ecommerce.service.IProductService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;

@Component
public class ExportProduct {


    public Workbook writeExcel(List<Product> list){
        Workbook workbook = new XSSFWorkbook();
        for (Product product : list){
            Sheet sheet = writeSheet(workbook, product.getName());
            Integer rowIndex = writeSheetHeader(sheet, product);

            rowIndex++;
            rowIndex = writeHeaderBody(sheet, rowIndex);

            rowIndex++;
            for (ProductDetails productDetails : product.getLstProductDetails()){
                writeBookBody(sheet,rowIndex, productDetails);
            }

//            int numberOfColumn = sheet.getRow(0).getPhysicalNumberOfCells();
            int numberOfColumn = 20;
            autosizeColumn(sheet, numberOfColumn);
        }

        return workbook;
    }

    private Sheet writeSheet(Workbook workbook, String name){
        return workbook.createSheet(name);
    }

    private Integer writeSheetHeader(Sheet sheet,Product product) {
        int rowId = 0;
        int rowCode = 1;
        int rowName = 2;
        int rowImage = 3;
        int rowCategory = 4;
        int rowBrand = 5;
        int rowMaterial = 6;
        int rowStyle = 7;
        int rowDescription = 8;
        int rowStatus = 9;
        int rowCreatedBy = 10;
        int rowCreatedDate = 11;
        int rowLastModifiedBy = 12;
        int rowLastModifiedDate  = 13;

        String[] rowTiles = {"Id", "Code", "Name", "ImageUrl", "Category", "Brand","Material","Style",
                "Description", "Status", "CreatedBy", "CreatedDate", "LastModifiedBy", "LastModifiedDate"};

        // Mảng để lưu trữ các hàng
        Row[] rows = new Row[14];
        //style
        CellStyle cellStyle = createStyleHeader(sheet);
        CellStyle cellStyle2 = createStyleContent(sheet);

        //Tao row
        for (int i = 0; i < rows.length; i++) {
            rows[i] = sheet.createRow(i);
            Cell cell =rows[i].createCell(0);
            cell.setCellStyle(cellStyle);
            cell.setCellValue(rowTiles[i]);
        }

        rows[rowId].createCell(1).setCellValue(Objects.toString(product.getId(), "N/A"));
        rows[rowId].getCell(1).setCellStyle(cellStyle2);

        rows[rowCode].createCell(1).setCellValue(Objects.toString(product.getCode(), "N/A"));
        rows[rowCode].getCell(1).setCellStyle(cellStyle2);

        rows[rowName].createCell(1).setCellValue(Objects.toString(product.getName(), "N/A"));
        rows[rowName].getCell(1).setCellStyle(cellStyle2);

        rows[rowImage].createCell(1).setCellValue(Objects.toString(product.getImageUrl(), "N/A"));
        rows[rowImage].getCell(1).setCellStyle(cellStyle2);

        rows[rowCategory].createCell(1).setCellValue( Objects.toString(product.getCategory().getName(), "N/A"));
        rows[rowCategory].getCell(1).setCellStyle(cellStyle2);

        rows[rowBrand].createCell(1).setCellValue(Objects.toString(product.getBrand().getName(), "N/A"));
        rows[rowBrand].getCell(1).setCellStyle(cellStyle2);

        rows[rowMaterial].createCell(1).setCellValue(Objects.toString(product.getMaterial().getName(), "N/A"));
        rows[rowMaterial].getCell(1).setCellStyle(cellStyle2);

        rows[rowStyle].createCell(1).setCellValue(Objects.toString(product.getStyle().getName(), "N/A") );
        rows[rowStyle].getCell(1).setCellStyle(cellStyle2);

        rows[rowDescription].createCell(1).setCellValue(Objects.toString(product.getDescription(), "N/A"));
        rows[rowDescription].getCell(1).setCellStyle(cellStyle2);

        rows[rowStatus].createCell(1).setCellValue(Objects.toString(product.getStatus(), "N/A") );
        rows[rowStatus].getCell(1).setCellStyle(cellStyle2);

        rows[rowCreatedBy].createCell(1).setCellValue(Objects.toString(product.getCreatedBy(), "N/A") );
        rows[rowCreatedBy].getCell(1).setCellStyle(cellStyle2);

        rows[rowCreatedDate].createCell(1).setCellValue(Objects.toString(product.getCreatedDate(), "N/A"));
        rows[rowCreatedDate].getCell(1).setCellStyle(cellStyle2);

        rows[rowLastModifiedBy].createCell(1).setCellValue( Objects.toString(product.getLastModifiedBy(), "N/A"));
        rows[rowLastModifiedBy].getCell(1).setCellStyle(cellStyle2);

        rows[rowLastModifiedDate].createCell(1).setCellValue(Objects.toString(product.getLastModifiedDate(), "N/A") );
        rows[rowLastModifiedDate].getCell(1).setCellStyle(cellStyle2);

        return rows.length ;
    }

    private Integer writeHeaderBody(Sheet sheet, int rowIndex) {
        CellStyle cellStyle = createStyleHeader(sheet);

        Row row = sheet.createRow(rowIndex);
        Cell cell = row.createCell(0);
        cell.setCellStyle(cellStyle);
        cell.setCellValue("Chi Tiet san pham");

        String[] rowTiles = {"Code","Barcode", "ImageUrl", "Price","Quantity","Size","Color","Status",
                "CreatedBy", "CreatedDate", "LastModifiedBy", "LastModifiedDate"};
        rowIndex++;
        Row headerRow = sheet.createRow(rowIndex);
        int columnIndex = 0;
        for (String title : rowTiles) {
            Cell c = headerRow.createCell(columnIndex++);
            c.setCellStyle(cellStyle);
            c.setCellValue(title);
        }

        return rowIndex;
    }
    private void writeBookBody(Sheet sheet,Integer rowIndex, ProductDetails productDetail) {
        Row row = sheet.createRow(rowIndex);
        CellStyle cellStyle = createStyleHeader(sheet);
        Cell cell = row.createCell(0);
        cell.setCellStyle(cellStyle);
        cell.setCellValue(Objects.toString(productDetail.getCode(), "N/A"));

        cell = row.createCell(1);
        cell.setCellStyle(cellStyle);
        cell.setCellValue(Objects.toString(productDetail.getBarcode(), "N/A"));

        cell = row.createCell(2);
        cell.setCellStyle(cellStyle);
        cell.setCellValue(Objects.toString(productDetail.getImageUrl(), "N/A"));

        cell = row.createCell(3);
        cell.setCellStyle(cellStyle);
        cell.setCellValue(Objects.toString(productDetail.getPrice(), "N/A"));

        cell = row.createCell(4);
        cell.setCellStyle(cellStyle);
        cell.setCellValue(Objects.toString(productDetail.getQuantity(), "N/A"));

        cell = row.createCell(5);
        cell.setCellStyle(cellStyle);
        cell.setCellValue( Objects.toString(productDetail.getSize().getName(), "N/A"));

        cell = row.createCell(6);
        cell.setCellStyle(cellStyle);
        cell.setCellValue(Objects.toString(productDetail.getColor().getName(), "N/A"));

        cell = row.createCell(7);
        cell.setCellStyle(cellStyle);
        cell.setCellValue(Objects.toString(productDetail.getStatus(), "N/A"));

        cell = row.createCell(8);
        cell.setCellStyle(cellStyle);
        cell.setCellValue(Objects.toString(productDetail.getCreatedBy(), "N/A"));

        cell = row.createCell(9);
        cell.setCellStyle(cellStyle);
        cell.setCellValue(Objects.toString(productDetail.getCreatedDate(), "N/A"));

        cell = row.createCell(10);
        cell.setCellStyle(cellStyle);
        cell.setCellValue(Objects.toString(productDetail.getLastModifiedBy(), "N/A"));

        cell = row.createCell(11);
        cell.setCellStyle(cellStyle);
        cell.setCellValue(Objects.toString(productDetail.getLastModifiedDate(), "N/A"));
    }

    private CellStyle createStyleHeader(Sheet sheet) {
        // Create font
        Font font = sheet.getWorkbook().createFont();
        // font.setFontName("Times New Roman");
        font.setBold(true);
        font.setFontHeightInPoints((short) 12); // font size
        font.setColor(IndexedColors.BLACK.getIndex()); // text color

        // Create CellStyle
        CellStyle cellStyle = sheet.getWorkbook().createCellStyle();
        cellStyle.setFont(font);

        //Format ngay giơ
        CreationHelper createHelper = sheet.getWorkbook().getCreationHelper();
        // Set a custom date format, for example, "dd/MM/yyyy HH:mm:ss"
        cellStyle.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy HH:mm:ss"));

        // Set left alignment
        cellStyle.setAlignment(HorizontalAlignment.LEFT);

//        cellStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
//        cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
//        cellStyle.setBorderBottom(BorderStyle.THIN);
        return cellStyle;
    }

    private CellStyle createStyleContent(Sheet sheet) {
        // Create font
        Font font = sheet.getWorkbook().createFont();
        // font.setFontName("Times New Roman");
        font.setBold(true);
        font.setFontHeightInPoints((short) 12); // font size
        font.setColor(IndexedColors.BLACK.getIndex()); // text color

        // Create CellStyle
        CellStyle cellStyle = sheet.getWorkbook().createCellStyle();
        cellStyle.setFont(font);

        //Format ngay giơ
        CreationHelper createHelper = sheet.getWorkbook().getCreationHelper();
        // Set a custom date format, for example, "dd/MM/yyyy HH:mm:ss"
        cellStyle.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy HH:mm:ss"));


        // Set left alignment
        cellStyle.setAlignment(HorizontalAlignment.CENTER);

//        cellStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
//        cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
//        cellStyle.setBorderBottom(BorderStyle.THIN);
        return cellStyle;
    }

    private static void autosizeColumn(Sheet sheet, int lastColumn) {
        for (int columnIndex = 0; columnIndex < lastColumn; columnIndex++) {
            sheet.autoSizeColumn(columnIndex);
        }
    }


}

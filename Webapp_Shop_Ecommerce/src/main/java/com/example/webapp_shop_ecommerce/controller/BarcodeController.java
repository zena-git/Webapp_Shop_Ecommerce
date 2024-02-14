package com.example.webapp_shop_ecommerce.controller;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
@RestController
@RequestMapping("/api/barcode")
public class BarcodeController {
    ///api/barcode?data=123456,789012,345678,
    @GetMapping(produces = "application/zip")
    public ResponseEntity<byte[]> generateBarcodes(@RequestParam("data") List<String> dataList) throws IOException {
        // Tạo tệp ZIP
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zipOut = new ZipOutputStream(baos)) {
            for (String data : dataList) {
                // Tạo mã vạch
                BitMatrix bitMatrix = null;
                try {
                    bitMatrix = new MultiFormatWriter().encode(data, BarcodeFormat.CODE_128, 300, 100);
                } catch (WriterException e) {
                    throw new RuntimeException(e);
                }

                // Chuyển đổi BitMatrix thành BufferedImage
                BufferedImage image = new BufferedImage(bitMatrix.getWidth(), bitMatrix.getHeight(), BufferedImage.TYPE_INT_RGB);
                Graphics2D graphics = image.createGraphics();
                graphics.setColor(Color.WHITE);
                graphics.fillRect(0, 0, bitMatrix.getWidth(), bitMatrix.getHeight());
                graphics.setColor(Color.BLACK);
                for (int x = 0; x < bitMatrix.getWidth(); x++) {
                    for (int y = 0; y < bitMatrix.getHeight(); y++) {
                        if (bitMatrix.get(x, y)) {
                            graphics.fillRect(x, y, 1, 1);
                        }
                    }
                }

                // Chuyển đổi BufferedImage thành byte array
                ByteArrayOutputStream barcodeBaos = new ByteArrayOutputStream();
                ImageIO.write(image, "png", barcodeBaos);
                byte[] imageData = barcodeBaos.toByteArray();

                // Thêm hình ảnh vào tệp ZIP
                ZipEntry entry = new ZipEntry(data + ".png");
                zipOut.putNextEntry(entry);
                zipOut.write(imageData);
                zipOut.closeEntry();
            }
        }

        // Trả về tệp ZIP
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header("Content-Disposition", "attachment; filename=barcodes.zip")
                .body(baos.toByteArray());
    }
}

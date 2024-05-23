package com.example.webapp_shop_ecommerce.ultiltes;

import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Component
public class GenBarcode {
    public ByteArrayOutputStream genBarcode(List<ProductDetails> lst) throws IOException {
        // Tạo tệp ZIP
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zipOut = new ZipOutputStream(baos)) {
            for (ProductDetails data : lst) {
                // Tạo mã vạch
                BitMatrix bitMatrix = null;
                try {
//                    bitMatrix = new MultiFormatWriter().encode(data.getBarcode(), BarcodeFormat.QR_CODE, 300, 300);
                    bitMatrix = new MultiFormatWriter().encode(data.getBarcode(), BarcodeFormat.CODE_128, 300, 100);
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
                ZipEntry entry = new ZipEntry(data.getProduct().getCode()+"_"+data.getBarcode() + ".png");
                zipOut.putNextEntry(entry);
                zipOut.write(imageData);
                zipOut.closeEntry();
            }
        }

        return baos;
    }
}

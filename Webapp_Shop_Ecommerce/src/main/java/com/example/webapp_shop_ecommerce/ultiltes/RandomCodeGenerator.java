package com.example.webapp_shop_ecommerce.ultiltes;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Random;

@Component
public class RandomCodeGenerator {
    public String generateRandomBarcode() {
        Random random = new Random();
        StringBuilder barcode = new StringBuilder();

        // Bắt đầu với mã quốc gia hoặc khu vực (3 chữ số)
        barcode.append(String.format("%03d", random.nextInt(1000)));

        // Tiếp theo là mã nhà sản xuất (5 chữ số)
        barcode.append(String.format("%05d", random.nextInt(100000)));

        // Tiếp theo là mã sản phẩm (5 chữ số)
//        barcode.append(String.format("%05d", random.nextInt(100000)));

        // Tính chữ số kiểm tra (digit check)
        int sum = 0;
        for (int i = 0; i < 7; i++) {
            int digit = Character.getNumericValue(barcode.charAt(i));
            if (i % 2 == 0) {
                sum += digit;
            } else {
                sum += digit * 3;
            }
        }
        int checkDigit = (10 - (sum % 10)) % 10;
        barcode.append(checkDigit);

        return barcode.toString();
    }
}

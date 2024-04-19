package com.example.webapp_shop_ecommerce.ultiltes;

import java.util.Random;

public class OTPGenerator {
    public static String generateRandomNumber(int length) {
        String numbers = "0123456789";
        char otp[] = new char[length];
        Random getOtpNum = new Random();
        for (int i = 0; i < length; i++) {
            otp[i] = numbers.charAt(getOtpNum.nextInt(numbers.length()));
        }
        String optCode = "";
        for (int i = 0; i < otp.length; i++) {
            optCode += otp[i];
        }
        return optCode;
    }
}

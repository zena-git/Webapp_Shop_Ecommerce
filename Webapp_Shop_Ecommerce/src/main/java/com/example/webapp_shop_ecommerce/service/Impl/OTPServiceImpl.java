package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.config.TwilioConfig;
import com.example.webapp_shop_ecommerce.dto.request.message.NewAccountPasswordRequest;
import com.example.webapp_shop_ecommerce.dto.request.message.ResetPasswordRequest;
import com.example.webapp_shop_ecommerce.dto.response.message.ResetPasswordResponse;
import com.example.webapp_shop_ecommerce.infrastructure.enums.OTPStatus;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

import static com.example.webapp_shop_ecommerce.ultiltes.OTPGenerator.generateRandomNumber;

@Service
public class OTPServiceImpl {
    Map<String, String> otpMap;

    @Autowired
    private TwilioConfig twilioConfig;

//    public ResetPasswordResponse sendNewAccountPassword(NewAccountPasswordRequest newAccountPasswordRequest){
//        ResetPasswordResponse response = new ResetPasswordResponse();
//        try {
//            PhoneNumber to = new PhoneNumber(newAccountPasswordRequest.getPhoneNumber());
//            PhoneNumber from = new PhoneNumber(twilioConfig.getTrialNumber());
//            String randomPassword = generateRandomNumber(6);
//            String otpMessage = "Cảm ơn bạn đã tạo tài khoản tại Lolita Alice. Mật khẩu của bạn là: " + randomPassword + ".Hãy nhanh chóng đổi mật khẩu tại http://localhost:3001/resetpassword";
//            Message message = Message.creator(to,from, otpMessage)
//                    .create();
//            response.setStatus(OTPStatus.DELIVERY);
//            response.setMessage(otpMessage);
//        }catch (Exception ex){
//            response.setMessage(ex.getMessage());
//            response.setStatus(OTPStatus.FAILED);
//        }
//    return response;
//
//    }

    public ResetPasswordResponse sendNewPassword(ResetPasswordRequest resetPasswordRequest){
        ResetPasswordResponse response = new ResetPasswordResponse();
        try {
            PhoneNumber to = new PhoneNumber(resetPasswordRequest.getPhoneNumber());
            PhoneNumber from = new PhoneNumber(twilioConfig.getTrialNumber());
            String randomPassword = generateRandomNumber(6);
            String otpMessage = "Mật khẩu mới của bạn là: " + randomPassword + ".Hãy nhanh chóng đổi mật khẩu";
            Message message = Message.creator(to,from, otpMessage)
                    .create();

            System.out.println(message);
            response.setStatus(OTPStatus.DELIVERY);
            response.setMessage(otpMessage);
        }catch (Exception ex){
            response.setMessage(ex.getMessage());
            response.setStatus(OTPStatus.FAILED);
        }
        return response;

    }
}

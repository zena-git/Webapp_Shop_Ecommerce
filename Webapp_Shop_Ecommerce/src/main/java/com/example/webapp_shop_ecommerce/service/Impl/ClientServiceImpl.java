package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.request.mail.MailDTO;
import com.example.webapp_shop_ecommerce.dto.request.mail.MailInputDTO;
import com.example.webapp_shop_ecommerce.service.IClientService;
import com.example.webapp_shop_ecommerce.service.IMailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import static com.example.webapp_shop_ecommerce.ultiltes.OTPGenerator.generateRandomNumber;

@Service
public class ClientServiceImpl implements IClientService {
    @Autowired
    private IMailService mailService;

    @Override
    public Boolean create(MailInputDTO sdi) {
        try {
            MailDTO dataMail = new MailDTO();

            dataMail.setTo(sdi.getEmail());
            dataMail.setSubject("XÁC NHẬN TẠO MỚI THÔNG TIN NGƯỜI DÙNG");

            Map<String, Object> props = new HashMap<>();
            props.put("name", sdi.getName());
            props.put("email", sdi.getEmail());
            props.put("password", sdi.getPassword());
            dataMail.setProps(props);

            mailService.sendHtmlMail(dataMail, "client");
            return true;
        } catch (MessagingException exp){
            exp.printStackTrace();
        }
        return false;
    }
}
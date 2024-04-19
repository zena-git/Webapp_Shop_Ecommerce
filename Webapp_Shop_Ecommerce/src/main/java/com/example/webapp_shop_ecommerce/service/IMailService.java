package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.dto.request.mail.MailDTO;
import jakarta.mail.MessagingException;

public interface IMailService {
    void sendHtmlMail(MailDTO dataMail, String templateName) throws MessagingException;

}

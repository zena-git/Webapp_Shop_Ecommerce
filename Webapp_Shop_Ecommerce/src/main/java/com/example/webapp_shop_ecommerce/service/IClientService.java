package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.dto.request.mail.MailInputDTO;

public interface IClientService {
    Boolean create(MailInputDTO sdi);

}

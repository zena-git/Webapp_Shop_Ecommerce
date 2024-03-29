package com.example.webapp_shop_ecommerce.dto.request.payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private String codeBill;
    private String bankCode;
    private String language;
    private String returnUrl;
}

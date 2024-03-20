package com.example.webapp_shop_ecommerce.dto.response.payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
@Setter
@Getter
public class PaymentResponse implements Serializable {
    private String status;
    private String message;
    private String url;

    public PaymentResponse(String status, String message, String url) {
        this.status = status;
        this.url = url;
        this.message = message;
    }
}

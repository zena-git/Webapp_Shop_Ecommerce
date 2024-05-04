package com.example.webapp_shop_ecommerce.dto.response.message;

import com.example.webapp_shop_ecommerce.infrastructure.enums.OTPStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordResponse {
    private OTPStatus status;

    private String message;

}

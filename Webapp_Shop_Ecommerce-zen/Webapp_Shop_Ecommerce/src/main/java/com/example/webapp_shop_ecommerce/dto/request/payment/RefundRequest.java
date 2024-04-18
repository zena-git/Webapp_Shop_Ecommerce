package com.example.webapp_shop_ecommerce.dto.request.payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RefundRequest {
    private String trantype;
    private String order_id;
    private String amount;
    private String trans_date;
    private String user;
}

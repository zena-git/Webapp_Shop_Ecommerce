package com.example.webapp_shop_ecommerce.dto.request.payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuerydrRequest {
    private String vnpTxnRef;
    private String vnpPayDate;
    private String transactionNo;
    private String vnpResponseCode;
}

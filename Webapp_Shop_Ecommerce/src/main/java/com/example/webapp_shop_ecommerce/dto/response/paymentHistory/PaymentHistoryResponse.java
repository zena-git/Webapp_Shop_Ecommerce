package com.example.webapp_shop_ecommerce.dto.response.paymentHistory;


import com.example.webapp_shop_ecommerce.entity.Bill;
import jakarta.persistence.Column;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class PaymentHistoryResponse {


//    private Bill bill;
    private String type;
    private String tradingCode;
    private String paymentAmount;
    private String paymentMethod;
    private String description;
    private String status;
    private LocalDateTime createdDate;
    private String createdBy;
}

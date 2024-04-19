package com.example.webapp_shop_ecommerce.dto.request.paymentHistory;


import com.example.webapp_shop_ecommerce.dto.request.bill.BillRequest;
import com.example.webapp_shop_ecommerce.entity.Bill;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class PaymentHistoryRequest {
//    private Bill bill;
    private String type;
    private String tradingCode;
    private String paymentAmount;
    private String paymentMethod;
    private String description;
    private String status;
}

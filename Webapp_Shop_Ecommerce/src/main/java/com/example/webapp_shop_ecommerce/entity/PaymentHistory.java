package com.example.webapp_shop_ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "PaymentHistory")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PaymentHistory extends BaseEntity{
    @ManyToOne()
    @JoinColumn(name = "bill_id")
    private Bill bill;
    @Column(name = "type")
    private String type;
    @Column(name = "trading_ode")
    private String tradingCode;
    @Column(name = "payment_amount")
    private BigDecimal paymentAmount;
    @Column(name = "payment_method")
    private String paymentMethod;
    @Column(name = "payment_date")
    private LocalDateTime paymentDate;
    @Column(name = "description")
    private String description;
    @Column(name = "status")
    private String status;
}

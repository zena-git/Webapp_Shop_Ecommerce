package com.example.webapp_shop_ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

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
    @Column(name = "payment_date")
    private String paymentDate;
    @Column(name = "payment_amount")
    private String paymentAmount;
    @Column(name = "payment_method")
    private String paymentMethod;
    @Column(name = "description")
    private String description;
    @Column(name = "status")
    private String status;
}

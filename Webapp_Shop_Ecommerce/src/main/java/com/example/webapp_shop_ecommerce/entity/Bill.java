package com.example.webapp_shop_ecommerce.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "Bill")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Bill extends BaseEntity{
    @Column(name = "code_bill")
    private String codeBill;
    @Column(name = "status")
    private String status;
    @Column(name = "booking_date")
    private Date bookingDate;
    @Column(name = "payment_date")
    private Date paymentDate;
    @Column(name = "delivery_date")
    private Date DeliveryDate;
    @Column(name = "completion_date")
    private Date completionDate;
    @Column(name = "receiver_name")
    private String receiverName;
    @Column(name = "receiver_phone")
    private String receiverPhone;
    @Column(name = "receiver_address")
    private String receiverAddress;
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

}

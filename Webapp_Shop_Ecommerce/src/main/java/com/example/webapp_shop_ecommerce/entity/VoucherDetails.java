package com.example.webapp_shop_ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "VoucherDetail")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class VoucherDetails extends BaseEntity {

    @ManyToOne()
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;

    @ManyToOne()
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne()
    @JoinColumn(name = "bill_id")
    private Bill bill;

    @Column(name = "status")
    private String status;

    @Column(name = "used_date")
    private LocalDateTime usedDate;
}

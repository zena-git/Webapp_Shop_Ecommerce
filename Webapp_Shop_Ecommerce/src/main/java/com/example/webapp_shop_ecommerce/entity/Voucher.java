package com.example.webapp_shop_ecommerce.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "Voucher")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class Voucher extends BaseEntity {
    @Column(name = "code_voucher")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "value")
    private BigDecimal value;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

}

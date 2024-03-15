package com.example.webapp_shop_ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "Voucher")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class Voucher extends BaseEntity {
    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "value")
    private Float value;

    @Column(name = "status")
    private String status;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "max_discount_value")
    private Float max_discount_value;

    @Column(name = "order_min_value")
    private Float order_min_value;

    @Column(name = "description")
    private String description;

    @Column(name = "target_type")
    private String target_type;

    @Column(name = "usage_limit")
    private String usage_limit;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @JsonIgnore
    @OneToMany(mappedBy = "voucher")
    Set<VoucherDetails> lstVoucherDetails;

}

package com.example.webapp_shop_ecommerce.dto.request.voucher;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class VoucherRequest {
    private String code;
    private String name;
    private BigDecimal value;
    private String status;
    private Integer quantity;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<Long> lstCustomer;
}

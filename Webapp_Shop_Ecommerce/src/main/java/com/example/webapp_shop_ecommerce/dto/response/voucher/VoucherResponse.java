package com.example.webapp_shop_ecommerce.dto.response.voucher;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class VoucherResponse {
    private Long id;
    private String code;
    private String name;
    private BigDecimal value;
    private Integer quantity;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}

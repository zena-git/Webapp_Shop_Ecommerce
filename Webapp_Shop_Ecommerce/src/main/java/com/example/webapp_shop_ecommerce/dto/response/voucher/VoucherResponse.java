package com.example.webapp_shop_ecommerce.dto.response.voucher;

import com.example.webapp_shop_ecommerce.entity.VoucherDetails;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class VoucherResponse {
    private Long id;
    private String code;
    private String name;
    private Float value;
    private Integer quantity;

    private Integer discount_type;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
    Set<VoucherDetails> lstVoucherDetails;

}

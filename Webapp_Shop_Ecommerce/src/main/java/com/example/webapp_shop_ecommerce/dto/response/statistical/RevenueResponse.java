package com.example.webapp_shop_ecommerce.dto.response.statistical;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RevenueResponse {
    private String time;

    private BigDecimal revenue;

    private Integer completedOrders;
}

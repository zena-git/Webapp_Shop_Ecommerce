package com.example.webapp_shop_ecommerce.dto.response.statistical;

import java.math.BigDecimal;
import java.util.Date;

public interface StatisticalReponse {
    Integer getCompletedOrders();
    BigDecimal getRevenue();

    Date getTime();
}

package com.example.webapp_shop_ecommerce.dto.response.statistical;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class StatisticalTopSaleResponse {
    private String time;
    private List<TopSaleReponse> product;
}

package com.example.webapp_shop_ecommerce.dto.response.statistical;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class StatisticalTopSaleResponse {
    private Date time;
    private List<TopSaleReponse> product;

    public StatisticalTopSaleResponse(Date time, List<TopSaleReponse> product) {
        this.time = product.get(0).getTime();;
        this.product = product;
    }

    public StatisticalTopSaleResponse() {
    }
}

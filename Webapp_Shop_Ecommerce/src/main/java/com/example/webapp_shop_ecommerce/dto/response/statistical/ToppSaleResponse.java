package com.example.webapp_shop_ecommerce.dto.response.statistical;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ToppSaleResponse {
    public String time;
    public List<TopSaleReponse> product;
}

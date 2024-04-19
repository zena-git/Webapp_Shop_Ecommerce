package com.example.webapp_shop_ecommerce.dto.response.attributesvalues;

import com.example.webapp_shop_ecommerce.dto.response.brand.BrandResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString

public class AttributesValuesResponse {
    private Long id;
    private String name;
    private BrandResponse attribute;

}

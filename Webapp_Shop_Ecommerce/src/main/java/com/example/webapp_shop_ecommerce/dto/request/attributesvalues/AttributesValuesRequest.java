package com.example.webapp_shop_ecommerce.dto.request.attributesvalues;

import com.example.webapp_shop_ecommerce.dto.request.attributes.AttributesRequest;
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

public class AttributesValuesRequest {
    private Long id;
    private String name;
    private Long attribute;

}

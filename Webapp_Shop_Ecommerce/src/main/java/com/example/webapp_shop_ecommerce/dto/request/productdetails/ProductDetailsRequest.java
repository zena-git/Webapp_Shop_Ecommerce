package com.example.webapp_shop_ecommerce.dto.request.productdetails;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ProductDetailsRequest {
    private Long id;
    private String code;
    private String imageUrl;
    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0.01", message = "Giá phải lớn hơn 0")
    private BigDecimal price;
    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private Integer quantity;
    private String barcode;
    private String status;
    private Long product;
    @NotNull(message = "Màu không được để trống")
    private Long color;
    @NotNull(message = "Kích thước không được để trống")
    private Long size;

}

package com.example.webapp_shop_ecommerce.dto.request.color;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class ColorRequest {
    @NotBlank(message = "Không được để trống")
    @Size(max = 100, message = "Tên quá dài. Hãy nhập tên ngắn hơn.")
    private String name;
}

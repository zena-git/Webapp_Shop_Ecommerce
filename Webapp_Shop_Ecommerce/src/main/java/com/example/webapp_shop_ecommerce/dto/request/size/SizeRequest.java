package com.example.webapp_shop_ecommerce.dto.request.size;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class SizeRequest {
    @NotBlank(message = "Không được để trống")
    private String name;
}

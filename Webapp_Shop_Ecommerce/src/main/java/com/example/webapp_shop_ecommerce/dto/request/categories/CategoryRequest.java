package com.example.webapp_shop_ecommerce.dto.request.categories;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CategoryRequest {
    @NotBlank(message = "Không được để trống")
    @Size(max = 100, message = "Tên quá dài. Hãy nhập tên ngắn hơn.")
    private String name;

}

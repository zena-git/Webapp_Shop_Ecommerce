package com.example.webapp_shop_ecommerce.dto.request.products;

import com.example.webapp_shop_ecommerce.dto.request.productdetails.ProductDetailsRequest;
import com.example.webapp_shop_ecommerce.entity.Category;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ProductRequest {
    private Long id;
    @NotBlank(message = "Mã sản phẩm không được để trống")
    @Size(max = 200, message = "Mã quá dài. Hãy nhập mã ngắn hơn.")
    private String code;
    @NotBlank(message = "Hình ảnh sản phẩm không được để trống")
    private String imageUrl;
    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 100, message = "Tên quá dài. Hãy nhập tên ngắn hơn.")
    private String name;
    @NotNull(message = "Danh mục không được để trống")
    private Long category;
    @NotBlank(message = "Sự miêu tả sản phẩm không được để trống")
    @Size(max = 1000, message = "Sự miêu tả sản phẩm quá dài. Hãy nhập sự miêu tả ngắn hơn.")
    private String description;
    @NotNull(message = "Thương hiệu không được để trống")
    private Long brand;
    @NotNull(message = "Chất liệu không được để trống")
    private Long material;
    @NotNull(message = "Kiểu dáng không được để trống")
    private Long style;

    private String status;
    @Valid
    @Size(min = 1, message = "Ít nhất phải có một chi tiết sản phẩm")
    private List<ProductDetailsRequest> lstProductDetails;

}

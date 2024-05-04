package com.example.webapp_shop_ecommerce.dto.request.promotion;

import com.example.webapp_shop_ecommerce.dto.request.promotionDetials.PromotionDetailsRequest;
import com.example.webapp_shop_ecommerce.entity.ProductDetails;
import jakarta.persistence.Column;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.NumberFormat;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class PromotionRequest {

    private Long id;
    @NotBlank(message = "Mã không được để trống")
    private String code;
    @NotBlank(message = "Tên không được để trống")
    private String name;
    @NotBlank(message = "Mô tả không được để trống")
    private String description;
    @NotNull(message = "Giá trị không được để trống")
    @NumberFormat(style = NumberFormat.Style.NUMBER)
    private Float value;
    //2024-02-26T03:12:22
    @NotNull(message = "Ngày bắt đầu không được để trống")
    @FutureOrPresent(message = "Ngày bắt đầu phải là hiện tại hoặc trong tương lai")
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    @Future(message = "Ngày kết thúc phải ở tương lai")
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endDate;

    @NotBlank(message = "Trạng thái không được để trống")
    private String status;
    @NotNull(message = "Danh sách chi tiết sản phẩm không được để trống")
    @Size(min = 1, message = "Ít nhất phải có một chi tiết sản phẩm")
    private List<Long> lstProductDetails;
}

package com.example.webapp_shop_ecommerce.dto.request.voucher;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.NumberFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class VoucherRequest {
    @NotBlank(message = "Mã không được để trống")
    private String code;
    @NotBlank(message = "Tên không được để trống")
    private String name;
    @NotNull(message = "Giá trị không được để trống")
    @NumberFormat(style = NumberFormat.Style.NUMBER)
    private Float value;

    @NotNull(message = "Mục tiêu không được để trống")
    @NumberFormat(style = NumberFormat.Style.NUMBER)
    private Integer targetType;

    @NotNull(message = "Loại giảm giá không được để trống")
    @NumberFormat(style = NumberFormat.Style.NUMBER)
    private Integer discountType;

    @NumberFormat(style = NumberFormat.Style.NUMBER)
    private Float maxDiscountValue;

    @NotNull(message = "Giá trị tối thiểu không được để trống")
    @NumberFormat(style = NumberFormat.Style.NUMBER)
    private Float order_min_value;

    @NumberFormat(style = NumberFormat.Style.NUMBER)
    private Integer usageLimit;

    private String status;
    //2024-02-26T03:12:22
    @NotNull(message = "Ngày bắt đầu không được để trống")
    @FutureOrPresent(message = "Ngày bắt đầu phải là hiện tại hoặc trong tương lai")
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startDate;
    @NotNull(message = "Ngày kết thúc không được để trống")
    @Future(message = "Ngày kết thúc phải ở tương lai")
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endDate;
    @Size(min = 1, message = "Ít nhất phải có một khách hàng")
    private List<Long> lstCustomer;
}

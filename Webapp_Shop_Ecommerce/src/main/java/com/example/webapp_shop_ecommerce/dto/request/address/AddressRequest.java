package com.example.webapp_shop_ecommerce.dto.request.address;

import com.example.webapp_shop_ecommerce.dto.request.customer.CustomerRequest;
import com.example.webapp_shop_ecommerce.entity.Customer;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

public class AddressRequest {
    private Long id;
    @NotBlank(message = "Không được để trống tên người nhận")
    @Size(max = 200, message = "Tên người nhận quá dài. Hãy nhập tên ngắn hơn.")
    private String receiverName;
    @NotBlank(message = "Không được để trống sđt người nhận")
    @Size(min = 10, max = 10, message = "Số điện thoại phải có 10 chữ số.")
    private String receiverPhone;
    @NotBlank(message = "Không được để trống chi tiết")
    @Size(max = 200, message = "Chi tiết người nhận quá dài. Hãy nhập chi tiết ngắn hơn.")
    private String detail;
    @NotBlank(message = "Không được để trống xã người nhận")
    @Size(max = 200, message = "Xã người nhận quá dài. Hãy nhập xã ngắn hơn.")
    private String commune;
    @NotBlank(message = "Không được để trống huyện người nhận")
    @Size(max = 200, message = "huyện người nhận quá dài. Hãy nhập huyện ngắn hơn.")
    private String district;
    @NotBlank(message = "Không được để trống tỉnh người nhận")
    @Size(max = 200, message = "Tỉnh người nhận quá dài. Hãy nhập tỉnh ngắn hơn.")
    private String province;
    private Long customer;
    private boolean defaultAddress;
}
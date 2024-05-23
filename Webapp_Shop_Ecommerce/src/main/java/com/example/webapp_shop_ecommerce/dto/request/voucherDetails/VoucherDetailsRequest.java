package com.example.webapp_shop_ecommerce.dto.request.voucherDetails;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class VoucherDetailsRequest {
    private Long voucher;
    private Long customer;
    private Long bill;
    private Integer status;
    private Date usedDate;
}

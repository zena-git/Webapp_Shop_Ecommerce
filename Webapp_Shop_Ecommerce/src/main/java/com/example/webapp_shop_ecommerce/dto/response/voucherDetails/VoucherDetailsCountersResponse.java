package com.example.webapp_shop_ecommerce.dto.response.voucherDetails;

import com.example.webapp_shop_ecommerce.dto.response.bill.BillResponse;
import com.example.webapp_shop_ecommerce.dto.response.customer.CustomerResponse;
import com.example.webapp_shop_ecommerce.dto.response.voucher.VoucherResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class VoucherDetailsCountersResponse {
    private Long id;
    private VoucherResponse voucher;
    private Boolean status;
    private LocalDateTime usedDate;
}

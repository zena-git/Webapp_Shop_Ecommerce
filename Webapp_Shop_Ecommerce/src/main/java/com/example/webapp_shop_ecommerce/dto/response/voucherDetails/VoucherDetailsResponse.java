package com.example.webapp_shop_ecommerce.dto.response.voucherDetails;

import com.example.webapp_shop_ecommerce.dto.response.bill.BillResponse;
import com.example.webapp_shop_ecommerce.dto.response.customer.CustomerResponse;
import com.example.webapp_shop_ecommerce.dto.response.voucher.VoucherResponse;
import com.example.webapp_shop_ecommerce.entity.Bill;
import com.example.webapp_shop_ecommerce.entity.Customer;
import com.example.webapp_shop_ecommerce.entity.Voucher;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class VoucherDetailsResponse {
    private Long id;
    private VoucherResponse voucher;
    private CustomerResponse customer;
    private BillResponse bill;
    private Integer status;
    private Date usedDate;
}

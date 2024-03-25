package com.example.webapp_shop_ecommerce.dto.response.bill;

import com.example.webapp_shop_ecommerce.dto.response.billdetails.BillDetailsCountersResponse;
import com.example.webapp_shop_ecommerce.dto.response.customer.CustomerResponse;
import com.example.webapp_shop_ecommerce.dto.response.voucherDetails.VoucherDetailsResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BillCountersResponse {
    private Long id;
    private String codeBill;
    private String status;
    private String paymentMethod;

    private String billType;
    private BigDecimal cash;
    private BigDecimal digitalCurrency;
    private BigDecimal totalMoney;
    private BigDecimal intoMoney;
    private BigDecimal shipMoney;
    private BigDecimal voucherMoney;

    private Date bookingDate;
    private Date paymentDate;
    private Date DeliveryDate;
    private Date completionDate;
    private String email;
    private String receiverName;
    private String receiverPhone;
    private String receiverDetails;
    private String receiverCommune;
    private String receiverDistrict;
    private String receiverProvince;
    private String description;
    private LocalDateTime createdDate;

    private CustomerResponse customer;

//    private UserDto user;

    Set<BillDetailsCountersResponse> lstBillDetails;
    Set<VoucherDetailsResponse> lstVoucherDetails;


}

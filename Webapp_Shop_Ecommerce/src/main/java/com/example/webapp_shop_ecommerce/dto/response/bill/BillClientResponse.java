package com.example.webapp_shop_ecommerce.dto.response.bill;

import com.example.webapp_shop_ecommerce.dto.response.billdetails.BillDetailsBillResponse;
import com.example.webapp_shop_ecommerce.dto.response.customer.CustomerResponse;
import com.example.webapp_shop_ecommerce.dto.response.historybill.HistoryBillResponse;
import com.example.webapp_shop_ecommerce.dto.response.paymentHistory.PaymentHistoryResponse;
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
public class BillClientResponse {
    private Long id;
    private String codeBill;
    private String paymentMethod;
    private String status;
    private String billType;
    private String billFormat;
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
    private LocalDateTime lastModifiedDate;


    private CustomerResponse customer;
    private LocalDateTime createdDate;

//    private UserDto user;

    Set<BillDetailsBillResponse> lstBillDetails;
//    Set<VoucherDetailsResponse> lstVoucherDetails;
    Set<HistoryBillResponse> lstHistoryBill;
//    Set<PaymentHistoryResponse> lstPaymentHistory;

}

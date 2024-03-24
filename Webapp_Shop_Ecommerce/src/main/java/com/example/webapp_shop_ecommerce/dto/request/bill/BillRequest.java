package com.example.webapp_shop_ecommerce.dto.request.bill;

import com.example.webapp_shop_ecommerce.dto.request.customer.CustomerRequest;
import com.example.webapp_shop_ecommerce.entity.CartDetails;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BillRequest {
    private Long id;
    private String paymentMethod;
    private BigDecimal cash;
    private BigDecimal digitalCurrency;
    private BigDecimal totalMoney;
    private BigDecimal intoMoney;
    private BigDecimal shipMoney;
    private BigDecimal voucherMoney;
    private String status;
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
    private Long customer;
    private String description;

    //    private List<Long> lstCartDetails;
    private List<CartDetails> lstCartDetails;


//    private UserDto user;

}

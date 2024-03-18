package com.example.webapp_shop_ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "Bill")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Bill extends BaseEntity{
    @Column(name = "code_bill")
    private String codeBill;

    @Column(name = "bill_type")
    private String billType;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "cash")
    private BigDecimal cash;

    @Column(name = "digital_currency")
    private BigDecimal digitalCurrency;

    @Column(name = "total_money")
    private BigDecimal totalMoney;

    @Column(name = "into_money")
    private BigDecimal intoMoney;

    @Column(name = "status")
    private String status;

    @Column(name = "booking_date")
    private Date bookingDate;

    @Column(name = "payment_date")
    private Date paymentDate;

    @Column(name = "delivery_date")
    private Date deliveryDate;

    @Column(name = "completion_date")
    private Date completionDate;

    @Column(name = "email")
    private String email;

    @Column(name = "receiver_name")
    private String receiverName;

    @Column(name = "receiver_phone")
    private String receiverPhone;

    @Column(name = "receiver_details")
    private String receiverDetails;

    @Column(name = "receiver_commune")
    private String receiverCommune;

    @Column(name = "receiver_district")
    private String receiverDistrict;

    @Column(name = "receiver_province")
    private String receiverProvince;


    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

    @OneToMany(mappedBy = "bill")
    @JsonIgnore
    Set<BillDetails> lstBillDetails;

    @OneToMany(mappedBy = "bill")
    @JsonIgnore
    Set<VoucherDetails> lstVoucherDetails;

}

package com.example.webapp_shop_ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.math3.analysis.function.Add;

import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "Customer")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder

public class Customer extends BaseEntity{
    @Column(name = "code_customer")
    private String codeCustomer;
    @Column(name = "full_name")
    private String fullName;
    @Column(name = "birthday")
    private Date birthday;
    @Column(name = "gender")
    private Boolean gender;
    @Column(name = "phone")
    private String phone;
    @Column(name = "email")
    private String email;
    @Column(name = "username")
    private String username;
    @Column(name = "password")
    private String password;

    @OneToMany(mappedBy = "customer")
    @JsonIgnore
    private Set<Address> lstAddress;

    @OneToMany(mappedBy = "customer")
    @JsonIgnore
    private Set<Bill> lstBill;

//    @OneToOne
//    @JoinColumn(name = "default_address_id")
//    @JsonIgnore
//    private Address defaultAddress;
}

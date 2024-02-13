package com.example.webapp_shop_ecommerce.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "Promotion")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Promotion extends BaseEntity {
    @Column(name = "code_promotion")
    private String code;
    @Column(name = "name")
    private String name;
    @Column(name = "description")
    private String description;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "status")
    private Integer status;
}

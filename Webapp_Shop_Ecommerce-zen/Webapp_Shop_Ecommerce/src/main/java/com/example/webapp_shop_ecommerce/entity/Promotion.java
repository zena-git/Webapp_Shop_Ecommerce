package com.example.webapp_shop_ecommerce.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Set;

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

    @Column(name = "value")
    private Float value;

    @Column(name = "description")
    private String description;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "status")
    private String status;

    @JsonIgnore
    @OneToMany(mappedBy = "promotion")
    private Set<PromotionDetails> lstPromotionDetails;
}

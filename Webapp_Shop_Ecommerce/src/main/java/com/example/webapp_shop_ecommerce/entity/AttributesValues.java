package com.example.webapp_shop_ecommerce.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "AttributesValues")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class AttributesValues extends BaseEntity{
    private String name;
    @ManyToOne
    @JoinColumn(name = "attribute_id")
    private Attributes attribute;

    @OneToMany(mappedBy = "attributesValues")
    private Set<ProductDetails> lstProductDetails;
}

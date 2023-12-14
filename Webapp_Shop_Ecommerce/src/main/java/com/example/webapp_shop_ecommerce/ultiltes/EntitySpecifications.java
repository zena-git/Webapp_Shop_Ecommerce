package com.example.webapp_shop_ecommerce.ultiltes;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

public class EntitySpecifications {
    public static <E> Specification<E> isNotDeleted() {
        return (Root<E> root, CriteriaQuery<?> query, CriteriaBuilder builder) -> {
            return builder.isFalse(root.get("deleted"));
        };
    }
}

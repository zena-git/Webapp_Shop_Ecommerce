package com.example.webapp_shop_ecommerce.ultiltes;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

public class EntitySpecifications {
    public static <E> Specification<E> isNotDeleted() {
        return (root, query, builder) -> builder.isFalse(root.get("deleted"));
    }

    public static <E> Specification<E> sortByCreatedDate() {
        return (root, query, builder) -> {
            query.orderBy(builder.desc(root.get("createdDate")));
            return null;
        };
    }

    public static <E> Specification<E> isNotDeletedAndSortByCreatedDate() {
        return Specification.<E>where(isNotDeleted()).and(sortByCreatedDate());
    }
}

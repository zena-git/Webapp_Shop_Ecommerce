package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.entity.BaseEntity;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;

import java.io.Serializable;
import java.util.Optional;

public interface IBaseService<E extends BaseEntity, ID extends Serializable> {
    ResponseEntity<ResponseObject> createNew(E entity);

    ResponseEntity<ResponseObject> update(E entity);

    ResponseEntity<ResponseObject> physicalDelete(ID id);

    ResponseEntity<ResponseObject> delete(ID id);

    ResponseEntity<ResponseObject> delete(E entity);

    Optional<E> findById(ID id);

    Page<E> findAll(@Nullable Specification<E> spec, Pageable page);
    Page<E> findAllDeletedFalse(Pageable page);
}

package com.example.webapp_shop_ecommerce.repositories;

import com.example.webapp_shop_ecommerce.entity.BaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;
import java.util.Optional;

@NoRepositoryBean
public interface IBaseReporitory<E extends BaseEntity, ID extends Serializable> extends  JpaRepository<E,ID>,
        JpaSpecificationExecutor<E>
{
    @Query("select e from #{#entityName} e where e.id = ?1 and e.deleted = false")
    Optional<E> findByIdAndDeletedFalses(ID id);


}

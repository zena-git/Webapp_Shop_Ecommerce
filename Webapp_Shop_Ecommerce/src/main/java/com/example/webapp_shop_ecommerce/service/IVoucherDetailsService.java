package com.example.webapp_shop_ecommerce.service;

import com.example.webapp_shop_ecommerce.entity.Voucher;
import com.example.webapp_shop_ecommerce.entity.VoucherDetails;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IVoucherDetailsService extends IBaseService<VoucherDetails, Long>{


    Optional<VoucherDetails> findVoucherDetailsByCustomerAndVoucher(Long idCustomer,Long idVoucher);

}

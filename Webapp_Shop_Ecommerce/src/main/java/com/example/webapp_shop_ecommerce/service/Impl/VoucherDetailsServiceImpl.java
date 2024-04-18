package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.entity.Voucher;
import com.example.webapp_shop_ecommerce.entity.VoucherDetails;
import com.example.webapp_shop_ecommerce.infrastructure.enums.TrangThaiGiamGia;
import com.example.webapp_shop_ecommerce.repositories.IVoucherDetailsRepository;
import com.example.webapp_shop_ecommerce.repositories.IVoucherRepository;
import com.example.webapp_shop_ecommerce.service.IVoucherDetailsService;
import com.example.webapp_shop_ecommerce.service.IVoucherService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VoucherDetailsServiceImpl extends BaseServiceImpl<VoucherDetails, Long, IVoucherDetailsRepository> implements IVoucherDetailsService {



    @Override
    public Optional<VoucherDetails> findVoucherDetailsByCustomerAndVoucher(Long idCustomer, Long idVoucher) {
        return repository.findVoucherDetailsByCustomerAndVoucher(idCustomer, idVoucher);
    }
}

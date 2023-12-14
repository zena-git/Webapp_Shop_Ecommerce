package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.entity.BillDetails;
import com.example.webapp_shop_ecommerce.repositories.IBillDetailsRepository;
import com.example.webapp_shop_ecommerce.service.IBillDetailsService;
import org.springframework.stereotype.Service;

@Service
public class BillDetailsServiceImpl extends BaseServiceImpl<BillDetails, Long, IBillDetailsRepository> implements IBillDetailsService {
}

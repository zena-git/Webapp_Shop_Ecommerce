package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.request.voucher.VoucherRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Customer;
import com.example.webapp_shop_ecommerce.entity.Promotion;
import com.example.webapp_shop_ecommerce.entity.Voucher;
import com.example.webapp_shop_ecommerce.entity.VoucherDetails;
import com.example.webapp_shop_ecommerce.infrastructure.enums.TrangThaiGiamGia;
import com.example.webapp_shop_ecommerce.infrastructure.security.Authentication;
import com.example.webapp_shop_ecommerce.repositories.ICustomerRepository;
import com.example.webapp_shop_ecommerce.repositories.IVoucherDetailsRepository;
import com.example.webapp_shop_ecommerce.repositories.IVoucherRepository;
import com.example.webapp_shop_ecommerce.service.IVoucherService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VoucherServiceImpl extends BaseServiceImpl<Voucher, Long, IVoucherRepository> implements IVoucherService {
    @Autowired
    private ModelMapper mapper;
    @Autowired
    private ICustomerRepository customerRepo;
    @Autowired
    private IVoucherDetailsRepository voucherDetailsRepo;
    @Autowired
    private Authentication authentication;
    @Override
    public Page<Voucher> findVoucherByKeyWorkAndDeletedFalse(Pageable pageable, Map<String, String> keyWork) {
        return repository.findVoucherByKeyWorkAndDeletedFalse(pageable, keyWork);
    }

    @Override
    public List<Voucher> findAllByIdCustomer(Long idCustomer) {
        return repository.findAllByIdCustomer(idCustomer, TrangThaiGiamGia.DANG_DIEN_RA.getLabel());
    }

    @Override
    public ResponseEntity<ResponseObject> save(VoucherRequest voucherRequest) {
        Voucher entity = mapper.map(voucherRequest, Voucher.class);
        entity.setId(null);
        entity.setDeleted(false);
        entity.setCreatedBy(authentication.getUsers().getFullName());
        entity.setCreatedDate(LocalDateTime.now());
        entity.setLastModifiedDate(LocalDateTime.now());
        entity.setLastModifiedBy(authentication.getUsers().getFullName());
        entity.setStatus(TrangThaiGiamGia.SAP_DIEN_RA.getLabel());
        //check ngay start;
        if (true) {
//            entity.setStatus("0");
        }

        Voucher voucher = repository.save(entity);

        List<Long> lstIdCustomer = voucherRequest.getLstCustomer();
        List<Customer> lstCustomer = new ArrayList<Customer>();
        if (lstIdCustomer.size() > 0) {
            lstCustomer = customerRepo.findAllById(lstIdCustomer);
        } else {
            lstCustomer = customerRepo.findAll();
        }

        List<VoucherDetails> lstVoucherDetails = lstCustomer.stream().map(
                customer -> {
                    VoucherDetails voucherDetails = new VoucherDetails();
                    voucherDetails.setVoucher(voucher);
                    voucherDetails.setCustomer(customer);
                    voucherDetails.setId(null);
                    voucherDetails.setDeleted(false);
                    voucherDetails.setCreatedBy(authentication.getUsers().getFullName());
                    voucherDetails.setCreatedDate(LocalDateTime.now());
                    voucherDetails.setLastModifiedDate(LocalDateTime.now());
                    voucherDetails.setLastModifiedBy(authentication.getUsers().getFullName());
                    voucherDetails.setStatus(false);
                    return voucherDetails;
                }
        ).collect(Collectors.toList());

        voucherDetailsRepo.saveAll(lstVoucherDetails);
        return new ResponseEntity<>(new ResponseObject("success", "Thành Công", 0, voucherRequest), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ResponseObject> update(VoucherRequest voucherRequest, Long id) {
        Optional<Voucher> otp = repository.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("error", "Không Thấy ID", 1, voucherRequest), HttpStatus.BAD_REQUEST);
        }
        Voucher entity = otp.get();

        if (!entity.getStatus().equalsIgnoreCase(TrangThaiGiamGia.SAP_DIEN_RA.getLabel())) {
            return new ResponseEntity<>(new ResponseObject("error", "Không thể sửa giảm giá " +
                    (entity.getStatus().equalsIgnoreCase(TrangThaiGiamGia.DANG_DIEN_RA.getLabel()) ? "đang diễn ra" :
                            (entity.getStatus().equalsIgnoreCase(TrangThaiGiamGia.DA_KET_THUC.getLabel()) ? "đã kêt thúc" :
                                    (entity.getStatus().equalsIgnoreCase(TrangThaiGiamGia.DA_HUY.getLabel()) ? "đã hủy" : ""))), 1, voucherRequest), HttpStatus.BAD_REQUEST);
        }

        entity = mapper.map(voucherRequest, Voucher.class);
        entity.setId(id);
        entity.setDeleted(otp.get().getDeleted());
        entity.setStatus(otp.get().getStatus());
        Voucher voucher = repository.save(entity);
        if (voucher == null) {
            return new ResponseEntity<>(new ResponseObject("error", "Thất Bại", 1, voucherRequest), HttpStatus.BAD_REQUEST);
        }

        List<Long> lstIdCustomer = voucherRequest.getLstCustomer();
        List<VoucherDetails> listVoucherDetails = voucherDetailsRepo.findByVoucherId(id);

        List<Long> lstIdCustomVoucherdetail = listVoucherDetails
                .stream().map(voucherDetails -> voucherDetails.getCustomer().getId())
                .collect(Collectors.toList());

        List<Long> needDelete = listVoucherDetails.stream()
                .filter(voucherDetails -> !lstIdCustomer.contains(voucherDetails.getCustomer().getId()))
                .map(voucherDetails -> voucherDetails.getId()).collect(Collectors.toList());
        voucherDetailsRepo.deleteAllById(needDelete);


        List<Long> needCreate = lstIdCustomer.stream()
                .filter(customerId -> !lstIdCustomVoucherdetail.contains(customerId))
               .collect(Collectors.toList());

        List<Customer> lstCustomer = customerRepo.findAllById(needCreate);
        List<VoucherDetails> lstVoucherDetails = lstCustomer.stream().map(
                customer -> {
                    VoucherDetails voucherDetails = new VoucherDetails();
                    voucherDetails.setVoucher(voucher);
                    voucherDetails.setCustomer(customer);
                    voucherDetails.setId(null);
                    voucherDetails.setDeleted(false);
                    voucherDetails.setCreatedBy(authentication.getUsers().getFullName());
                    voucherDetails.setCreatedDate(LocalDateTime.now());
                    voucherDetails.setLastModifiedDate(LocalDateTime.now());
                    voucherDetails.setLastModifiedBy(authentication.getUsers().getFullName());
                    voucherDetails.setStatus(false);
                    return voucherDetails;
                }
        ).collect(Collectors.toList());
        voucherDetailsRepo.saveAll(lstVoucherDetails);
        return new ResponseEntity<>(new ResponseObject("success", "Thành Công", 0, voucherRequest), HttpStatus.OK);
    }
}

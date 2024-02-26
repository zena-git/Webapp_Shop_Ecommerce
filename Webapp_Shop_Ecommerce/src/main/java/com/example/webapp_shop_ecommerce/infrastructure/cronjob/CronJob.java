package com.example.webapp_shop_ecommerce.infrastructure.cronjob;

import com.example.webapp_shop_ecommerce.entity.Voucher;
import com.example.webapp_shop_ecommerce.infrastructure.enums.TrangThaiGiamGia;
import com.example.webapp_shop_ecommerce.repositories.IPromotionRepository;
import com.example.webapp_shop_ecommerce.repositories.IVoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CronJob {
    //https://hocspringboot.net/2020/10/30/scheduled-annotation-trong-spring-boot/
    private TrangThaiGiamGia trangThaiGiamGia;
    @Autowired
    IVoucherRepository voucherRepo;
    @Autowired
    IPromotionRepository promotionRepo;
    @Scheduled(fixedRate = 6000) // Chạy mỗi phút (1 phút = 60000 milliseconds)
    public void VoucherCronJob() {

        LocalDateTime now = LocalDateTime.now();

        //set Dang dien ra
        voucherRepo.updateStatusToDangDienRa(now,TrangThaiGiamGia.SAP_DIEN_RA.getLabel(), TrangThaiGiamGia.DANG_DIEN_RA.getLabel());
        //set ket thuc
        voucherRepo.updateStatusToDaKetThuc(now,TrangThaiGiamGia.DANG_DIEN_RA.getLabel(), TrangThaiGiamGia.DA_KET_THUC.getLabel());


    }

    @Scheduled(fixedRate = 6000) // Chạy mỗi phút (1 phút = 60000 milliseconds)
    public void PromotionCronJob() {
        LocalDateTime now = LocalDateTime.now();
        //set Dang dien ra
        promotionRepo.updateStatusToDangDienRa(now,TrangThaiGiamGia.SAP_DIEN_RA.getLabel(), TrangThaiGiamGia.DANG_DIEN_RA.getLabel());
        //set ket thuc
        promotionRepo.updateStatusToDaKetThuc(now,TrangThaiGiamGia.DANG_DIEN_RA.getLabel(), TrangThaiGiamGia.DA_KET_THUC.getLabel());

    }
}

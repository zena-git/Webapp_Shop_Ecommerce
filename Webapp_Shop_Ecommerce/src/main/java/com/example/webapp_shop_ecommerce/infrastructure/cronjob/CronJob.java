package com.example.webapp_shop_ecommerce.infrastructure.cronjob;

import com.example.webapp_shop_ecommerce.entity.Voucher;
import com.example.webapp_shop_ecommerce.infrastructure.enums.TrangThaiBill;
import com.example.webapp_shop_ecommerce.infrastructure.enums.TrangThaiGiamGia;
import com.example.webapp_shop_ecommerce.repositories.*;
import com.example.webapp_shop_ecommerce.service.IBillService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
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

    @Autowired
    IProductDetailsRepository productDetailsRepo;

    @Autowired
    IPromotionDetailsRepository promotionDetailsRepo;

    @Autowired
    IBillRepository billRepo;

    @Autowired
    IBillService billService;

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

        //Bo active  product detail
        productDetailsRepo.updateProductDetailsPromotionActiveToNull(TrangThaiGiamGia.DANG_DIEN_RA.getLabel());

        //active giam gia product detail
        productDetailsRepo.updateProductDetailsToPromotionDetailsWherePromotionToDangDienRa(TrangThaiGiamGia.DANG_DIEN_RA.getLabel());
    }


    @PostConstruct
    public void startApplicationOn() {
        // Lấy thời gian hiện tại
        LocalDateTime now = LocalDateTime.now();

        // Đặt giờ và phút thành hom nay 0:0
        LocalDateTime specificTime = now.withHour(0).withMinute(0);

        System.out.println("Thời gian hiện tại: " + now);
        System.out.println("Thời gian cấu hình: " + specificTime);
        billService.autoUpdateBillChoThanhToanToHuy(specificTime,TrangThaiBill.CHO_THANH_TOAN.getLabel(), TrangThaiBill.HUY.getLabel());

    }
    @Scheduled(cron = "0 59 23 * * ?")
    public void CancellingInvoice() {
        LocalDateTime now = LocalDateTime.now();
        // Đặt giờ và phút thành 23:59
        LocalDateTime specificTime = now.withHour(23).withMinute(59);
        //set Dang dien ra to huy
        billService.autoUpdateBillChoThanhToanToHuy(specificTime,TrangThaiBill.CHO_THANH_TOAN.getLabel(), TrangThaiBill.HUY.getLabel());
    }
}

package com.example.webapp_shop_ecommerce.infrastructure.enums;

public enum TrangThaiGiamGia {
//    SAP_DIEN_RA("Sắp Diễn Ra"),
//    DANG_DIEN_RA("Đang Diễn Ra"),
//    DA_KET_THUC("Đã Kết Thúc"),
//    SAP_KET_THUC("Sắp Kết Thúc");
    SAP_DIEN_RA("0"),
    DANG_DIEN_RA("1"),
    DA_KET_THUC("2"),
    DA_HUY("3");


    private final String label;

    TrangThaiGiamGia(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}

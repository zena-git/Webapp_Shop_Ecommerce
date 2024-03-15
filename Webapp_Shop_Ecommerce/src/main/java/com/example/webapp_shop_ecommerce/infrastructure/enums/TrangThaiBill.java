package com.example.webapp_shop_ecommerce.infrastructure.enums;

public enum TrangThaiBill {
    TAT_CA(""),
    NEW("New"),
    CHO_XAC_NHAN("Chờ Xác Nhận"),
    CHO_GIAO("Chờ Giao"),
    DANG_GIAO("Đang Giao"),
    HOAN_THANH("Hoàn Thành"),
    HUY("Hủy"),
    CHO_THANH_TOAN("Chờ Thanh Toán"),

    TRA_HANG("Trả Hàng"),

    DANG_BAN("Đang Bán");



    private final String label;

    TrangThaiBill(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}

package com.example.webapp_shop_ecommerce.infrastructure.enums;

public enum TrangThaiBill {
    TAT_CA(""),
    TAO_DON_HANG("-1"),
    CHO_XAC_NHAN("0"),
    DA_XAC_NHAN("1"),
    VAN_CHUYEN("2"),
    DA_THANH_TOAN("3"),
    HOAN_THANH("4"),
    HUY("5"),

    TRA_HANG("6"),
    DANG_BAN("7"),
    CHO_THANH_TOAN("8"),
    HOAN_TIEN("9"),
    NEW("New");


    private final String label;

    TrangThaiBill(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}

package com.example.webapp_shop_ecommerce.infrastructure.enums;

public enum TrangThaiBill {
    TAT_CA(""),
    TAO_DON_HANG("-1"),
    CHO_XAC_NHAN("0"),
    DA_XAC_NHAN("1"),
    CHO_GIA0("2"),
    DANG_GIAO("3"),
    HOAN_THANH("4"),
    DA_THANH_TOAN("5"),

    HUY("6"),
    TRA_HANG("10"),
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

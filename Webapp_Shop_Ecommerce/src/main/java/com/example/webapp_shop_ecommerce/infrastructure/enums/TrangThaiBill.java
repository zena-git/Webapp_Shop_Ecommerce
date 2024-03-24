package com.example.webapp_shop_ecommerce.infrastructure.enums;

public enum TrangThaiBill {
    TAT_CA(""),
    TAO_DON_HANG("-1"),
    CHO_XAC_NHAN("0"),
    DA_XAC_NHAN("1"),

    CHO_GIAO("2"),
    DANG_GIAO("3"),
    DA_GIAO_HANG("4"),
    HOAN_THANH("5"),
    HUY("6"),
    TRA_MOT_PHAN("7"),

    TRA_HANG("8"),
    DANG_BAN("9"),
    NEW("New");


    private final String label;

    TrangThaiBill(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}

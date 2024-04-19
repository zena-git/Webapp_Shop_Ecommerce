package com.example.webapp_shop_ecommerce.infrastructure.enums;

public enum TrangThai {
    HOAT_DONG("0"),
    NGUNG_HOAT_DONG("1");


    private final String label;

    TrangThai(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}

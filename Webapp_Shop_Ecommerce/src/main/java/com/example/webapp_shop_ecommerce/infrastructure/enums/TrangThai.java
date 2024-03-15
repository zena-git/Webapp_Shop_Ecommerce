package com.example.webapp_shop_ecommerce.infrastructure.enums;

public enum TrangThai {
    HOAT_DONG("Hoạt động"),
    NGUNG_HOAT_DONG("Ngừng hoạt động");


    private final String label;

    TrangThai(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}

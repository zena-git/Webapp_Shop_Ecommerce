package com.example.webapp_shop_ecommerce.infrastructure.enums;

public enum PaymentMethod {
    TIEN_MAT("0"),
    CHUYEN_KHOAN("1"),
    TIEN_MAT_CHUYEN_KHOAN("2");

    private final String label;

    PaymentMethod(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

}

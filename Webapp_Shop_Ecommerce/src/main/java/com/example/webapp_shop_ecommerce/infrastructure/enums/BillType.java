package com.example.webapp_shop_ecommerce.infrastructure.enums;

public enum BillType {
    ONLINE("0"),
    OFFLINE("1"),
    DELIVERY("2");

    private final String label;

    BillType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

}

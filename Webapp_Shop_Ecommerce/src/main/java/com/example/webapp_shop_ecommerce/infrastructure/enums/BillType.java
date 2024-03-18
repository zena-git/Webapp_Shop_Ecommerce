package com.example.webapp_shop_ecommerce.infrastructure.enums;

public enum BillType {
    ONLINE("Online"),
    OFFLINE("Offline");

    private final String label;

    BillType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

}

package com.example.webapp_shop_ecommerce.infrastructure.enums;

public enum DiscountType {
    GIAM_TRUC_TIEP("0"),
    GIAM_PHAN_TRAM("1");


    private final String label;

    DiscountType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

}

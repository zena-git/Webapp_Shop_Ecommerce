package com.example.webapp_shop_ecommerce.dto.request.message;

public class ResetPasswordRequest {
    private String phoneNumber; //đích
    private String newPassword;
    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}

package com.example.webapp_shop_ecommerce.dto.request.mail;

import lombok.Data;

@Data
public class MailInputDTO {
    private String name;
    private String username;
    private String email;

    public String getUsername() {
        return this.username;
    }

    public String getMailName() {
        return this.name;
    }

    public void setMailxName(String name){
        this.name = name;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

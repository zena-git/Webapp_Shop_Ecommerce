package com.example.webapp_shop_ecommerce;

import com.example.webapp_shop_ecommerce.config.TwilioConfig;
import com.twilio.Twilio;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WebappShopEcommerceApplication {

    @Autowired
    private TwilioConfig twilioConfig;

    @PostConstruct
    public void initTwilio(){
        Twilio.init(twilioConfig.getAccountSid(), twilioConfig.getAuthToken());
    }

//    public void initializePSPDFKit() throws PSPDFKitInitializeException {
//        PSPDFKit.initializeTrial();
//    }

    public static void main(String[] args) {
        SpringApplication.run(WebappShopEcommerceApplication.class, args);
    }

}

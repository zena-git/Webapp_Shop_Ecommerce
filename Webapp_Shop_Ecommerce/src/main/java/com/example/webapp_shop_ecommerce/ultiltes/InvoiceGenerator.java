package com.example.webapp_shop_ecommerce.ultiltes;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Component
public class InvoiceGenerator {
    public String generateInvoiceNumber() {
        LocalDate currentDate = LocalDate.now();
        String formattedDate = currentDate.format(DateTimeFormatter.ofPattern("ddMMyy"));

        UUID uuid = UUID.randomUUID();
        String uniqueId = uuid.toString().replaceAll("-", "").substring(0, 4);

        String invoiceNumber = formattedDate + uniqueId;
        return "HD-" + invoiceNumber;
    }
}

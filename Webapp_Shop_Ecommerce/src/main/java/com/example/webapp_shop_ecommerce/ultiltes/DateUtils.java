package com.example.webapp_shop_ecommerce.ultiltes;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.TimeZone;

public class DateUtils {
    public static LocalDateTime convertToLocalDateTime(Long timestampInMillisecond) {
        if (Objects.isNull(timestampInMillisecond)) {
            return null;
        }

        return LocalDateTime.ofInstant(Instant.ofEpochMilli(timestampInMillisecond), TimeZone.getDefault().toZoneId());
    }
}

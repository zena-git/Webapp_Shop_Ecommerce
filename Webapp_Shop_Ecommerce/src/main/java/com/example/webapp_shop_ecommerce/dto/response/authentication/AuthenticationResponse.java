package com.example.webapp_shop_ecommerce.dto.response.authentication;

import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
// kahi bao một mức truy cập cụ thể, ở đây là private (riêng tư).
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationResponse {
    String token;
    boolean authenticated;
}

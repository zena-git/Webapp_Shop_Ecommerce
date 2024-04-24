package com.example.webapp_shop_ecommerce.config;

import org.modelmapper.AbstractConverter;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        // Tạo object và cấu hình
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT);
        // Đăng ký một Converter để loại bỏ khoảng trắng ở hai đầu của chuỗi
        modelMapper.addConverter(new StringTrimConverter());
        return modelMapper;
    }
    // Converter để loại bỏ khoảng trắng ở hai đầu của chuỗi
    private static class StringTrimConverter extends AbstractConverter<String, String> {
        @Override
        protected String convert(String source) {
            if (source == null) {
                return null;
            }
            return source.trim();
        }
    }
}

package com.example.webapp_shop_ecommerce.dto.request.mail;

import lombok.*;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MailDTO {
    private String to;
    private String subject;
    private String content;
    private Map<String, Object> props;

    public Map<String, Object> getProps() {
        return this.props;
    }

    public String getSubject(){
        return  this.subject;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setProps(Map<String, Object> props) {
        this.props = props;
    }
}
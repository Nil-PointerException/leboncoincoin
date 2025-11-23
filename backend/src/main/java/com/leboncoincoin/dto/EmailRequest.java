package com.leboncoincoin.dto;

import java.util.Map;

public record EmailRequest(
    String to,
    String subject,
    String templateName,
    Map<String, Object> templateData
) {
    public static EmailRequest of(String to, String subject, String templateName, Map<String, Object> data) {
        return new EmailRequest(to, subject, templateName, data);
    }
}


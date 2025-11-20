package com.lmc.dto;

public record PresignedUrlResponse(
    String uploadUrl,
    String objectKey,
    String publicUrl
) {
}


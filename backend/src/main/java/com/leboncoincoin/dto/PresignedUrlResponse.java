package com.leboncoincoin.dto;

public record PresignedUrlResponse(
    String uploadUrl,
    String objectKey,
    String publicUrl
) {
}


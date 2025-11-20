package com.lmc.service;

import com.lmc.dto.PresignedUrlResponse;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.UUID;

@ApplicationScoped
public class S3Service {

    @ConfigProperty(name = "app.s3.bucket-name")
    String bucketName;

    @ConfigProperty(name = "app.s3.presigned-url-expiration")
    int presignedUrlExpiration;

    @ConfigProperty(name = "quarkus.s3.aws.region")
    String region;

    @Inject
    S3Client s3Client;

    public PresignedUrlResponse generatePresignedUploadUrl(String filename, String contentType, String userId) {
        Log.infof("Generating presigned URL for file: %s, user: %s", filename, userId);

        // Generate unique object key
        String fileExtension = getFileExtension(filename);
        String objectKey = String.format("%s/%s%s", userId, UUID.randomUUID(), fileExtension);

        try (S3Presigner presigner = S3Presigner.builder()
                .region(software.amazon.awssdk.regions.Region.of(region))
                .build()) {

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .contentType(contentType)
                    .build();

            PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofSeconds(presignedUrlExpiration))
                    .putObjectRequest(putObjectRequest)
                    .build();

            PresignedPutObjectRequest presignedRequest = presigner.presignPutObject(presignRequest);
            String uploadUrl = presignedRequest.url().toString();
            String publicUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", 
                    bucketName, region, objectKey);

            Log.infof("Generated presigned URL for object: %s", objectKey);

            return new PresignedUrlResponse(uploadUrl, objectKey, publicUrl);
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "";
        }
        int lastDot = filename.lastIndexOf('.');
        if (lastDot == -1) {
            return "";
        }
        return filename.substring(lastDot);
    }
}


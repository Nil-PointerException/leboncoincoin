package com.leboncoincoin.service;

import com.leboncoincoin.dto.PresignedUrlResponse;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.net.URI;
import java.time.Duration;
import java.util.UUID;
import java.util.Optional;

@ApplicationScoped
public class S3Service {

    @ConfigProperty(name = "app.s3.bucket-name")
    String bucketName;

    @ConfigProperty(name = "app.s3.presigned-url-expiration")
    int presignedUrlExpiration;

    @ConfigProperty(name = "quarkus.s3.aws.region")
    String region;

    @ConfigProperty(name = "quarkus.s3.endpoint-override")
    Optional<String> endpointOverride;

    @ConfigProperty(name = "quarkus.s3.path-style-access")
    Optional<Boolean> pathStyleAccess;

    @ConfigProperty(name = "quarkus.s3.aws.credentials.static-provider.access-key-id")
    Optional<String> accessKeyId;

    @ConfigProperty(name = "quarkus.s3.aws.credentials.static-provider.secret-access-key")
    Optional<String> secretAccessKey;

    @Inject
    S3Client s3Client;

    public PresignedUrlResponse generatePresignedUploadUrl(String filename, String contentType, String userId) {
        Log.infof("Generating presigned URL for file: %s, user: %s", filename, userId);

        // Generate unique object key
        String fileExtension = getFileExtension(filename);
        String objectKey = String.format("%s/%s%s", userId, UUID.randomUUID(), fileExtension);

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .contentType(contentType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofSeconds(presignedUrlExpiration))
                .putObjectRequest(putObjectRequest)
                .build();

        // Create presigner with proper configuration
        S3Presigner presigner = createPresigner();
        
        PresignedPutObjectRequest presignedRequest = presigner.presignPutObject(presignRequest);
        String uploadUrl = presignedRequest.url().toString();
        
        // Fix URL if it's still in virtual-hosted style (workaround for SDK issues)
        if (endpointOverride.isPresent() && uploadUrl.contains(bucketName + ".localhost")) {
            Log.warnf("Detected virtual-hosted style URL, converting to path-style: %s", uploadUrl);
            // Convert http://bucket.localhost:9000/path to http://localhost:9000/bucket/path
            uploadUrl = uploadUrl.replace(bucketName + ".localhost", "localhost/" + bucketName);
            Log.infof("Converted URL to path-style: %s", uploadUrl);
        }
        
        // Generate public URL based on whether we're using MinIO or AWS S3
        String publicUrl;
        if (endpointOverride.isPresent()) {
            // MinIO/Local S3 - use endpoint override with path-style
            publicUrl = String.format("%s/%s/%s", endpointOverride.get(), bucketName, objectKey);
        } else {
            // AWS S3 - use standard S3 URL
            publicUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", 
                    bucketName, region, objectKey);
        }

        Log.infof("Generated presigned URL for object: %s", objectKey);
        Log.infof("Upload URL: %s", uploadUrl);
        Log.infof("Public URL: %s", publicUrl);

        presigner.close();

        return new PresignedUrlResponse(uploadUrl, objectKey, publicUrl);
    }

    private S3Presigner createPresigner() {
        S3Presigner.Builder builder = S3Presigner.builder()
                .region(Region.of(region));

        // Configure for MinIO if endpoint override is present
        if (endpointOverride.isPresent()) {
            builder.endpointOverride(URI.create(endpointOverride.get()));
            
            // Enable path-style access for MinIO and disable features incompatible with MinIO
            S3Configuration s3Config = S3Configuration.builder()
                    .pathStyleAccessEnabled(true)
                    .accelerateModeEnabled(false)
                    .chunkedEncodingEnabled(false)
                    .checksumValidationEnabled(false)
                    .build();
            builder.serviceConfiguration(s3Config);

            // Use static credentials if provided (for MinIO)
            if (accessKeyId.isPresent() && secretAccessKey.isPresent()) {
                builder.credentialsProvider(
                    StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKeyId.get(), secretAccessKey.get())
                    )
                );
            }
        }

        return builder.build();
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


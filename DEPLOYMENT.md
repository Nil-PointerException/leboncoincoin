# 🚀 Deployment Guide - PostgreSQL Edition

This guide walks you through deploying the LMC platform to production with **AWS RDS PostgreSQL**.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured
- Clerk account setup
- Node.js 18+ and Java 23
- PostgreSQL client tools

## 📋 Deployment Checklist

### 1. Clerk Configuration

1. Go to https://clerk.com and create an account
2. Create a new application
3. Enable Email/Password authentication
4. Note down:
   - Publishable Key (for frontend)
   - Client ID (for backend)
   - Client Secret (for backend)
   - Domain (e.g., `your-app.clerk.accounts.dev`)

### 2. AWS Infrastructure Setup

#### Create VPC and Subnets (if not exists)

```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=lmc-vpc}]'

# Create subnets in different AZs
aws ec2 create-subnet --vpc-id vpc-xxxxx --cidr-block 10.0.1.0/24 --availability-zone eu-west-3a
aws ec2 create-subnet --vpc-id vpc-xxxxx --cidr-block 10.0.2.0/24 --availability-zone eu-west-3b

# Create Internet Gateway and NAT Gateway for Lambda
# (Required for Lambda to access S3 and Clerk)
```

#### Create RDS PostgreSQL Instance

```bash
# Create DB subnet group
aws rds create-db-subnet-group \
    --db-subnet-group-name lmc-db-subnet-group \
    --db-subnet-group-description "LMC Database Subnet Group" \
    --subnet-ids subnet-xxxxx subnet-yyyyy

# Create security group for RDS
aws ec2 create-security-group \
    --group-name lmc-rds-sg \
    --description "Security group for LMC RDS PostgreSQL" \
    --vpc-id vpc-xxxxx

# Allow PostgreSQL access from Lambda security group
aws ec2 authorize-security-group-ingress \
    --group-id sg-rds-xxxxx \
    --protocol tcp \
    --port 5432 \
    --source-group sg-lambda-xxxxx

# Create RDS instance
aws rds create-db-instance \
    --db-instance-identifier lmc-db-prod \
    --db-instance-class db.t4g.micro \
    --engine postgres \
    --engine-version 16.1 \
    --master-username admin \
    --master-user-password YOUR_SECURE_PASSWORD \
    --allocated-storage 20 \
    --db-subnet-group-name lmc-db-subnet-group \
    --vpc-security-group-ids sg-rds-xxxxx \
    --backup-retention-period 7 \
    --publicly-accessible false \
    --enable-performance-insights \
    --performance-insights-retention-period 7

# Wait for RDS to be available (takes ~10 minutes)
aws rds wait db-instance-available --db-instance-identifier lmc-db-prod

# Get RDS endpoint
RDS_ENDPOINT=$(aws rds describe-db-instances \
    --db-instance-identifier lmc-db-prod \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text)

echo "RDS Endpoint: $RDS_ENDPOINT"
```

#### Create S3 Bucket

```bash
# Create bucket
aws s3 mb s3://lmc-images-prod --region eu-west-3

# Configure CORS
aws s3api put-bucket-cors \
    --bucket lmc-images-prod \
    --cors-configuration file://backend/cors.json \
    --region eu-west-3

# Enable versioning (optional but recommended)
aws s3api put-bucket-versioning \
    --bucket lmc-images-prod \
    --versioning-configuration Status=Enabled
```

### 3. Database Setup

#### Connect to RDS and Create Database

```bash
# Connect via bastion host or AWS Systems Manager Session Manager
psql -h $RDS_ENDPOINT -U admin -d postgres

# Inside psql:
CREATE DATABASE lmc_db;
\c lmc_db

# Exit
\q
```

#### Run Initial Migration (Optional - Flyway will do this automatically)

The Quarkus application with Flyway will automatically run migrations on first deployment.

### 4. Backend Deployment (AWS Lambda)

#### Build the Application

```bash
cd backend

# Build for production
mvn clean package -DskipTests
```

#### Deploy with AWS SAM

```bash
# Set environment variables
export DB_URL="jdbc:postgresql://${RDS_ENDPOINT}:5432/lmc_db"
export DB_USERNAME="admin"
export DB_PASSWORD="YOUR_SECURE_PASSWORD"
export CLERK_CLIENT_ID="your_clerk_client_id"
export CLERK_CLIENT_SECRET="your_clerk_client_secret"
export CLERK_DOMAIN="your-domain.clerk.accounts.dev"

# Deploy
sam deploy \
    --template-file sam-template.yaml \
    --stack-name lmc-backend-prod \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
        DbUrl=$DB_URL \
        DbUsername=$DB_USERNAME \
        DbPassword=$DB_PASSWORD \
        ClerkClientId=$CLERK_CLIENT_ID \
        ClerkClientSecret=$CLERK_CLIENT_SECRET \
        ClerkDomain=$CLERK_DOMAIN \
        S3BucketName=lmc-images-prod \
        VpcSubnetIds=subnet-xxxxx,subnet-yyyyy \
        SecurityGroupIds=sg-lambda-xxxxx

# Get API endpoint
API_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name lmc-backend-prod \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
    --output text)

echo "API Endpoint: $API_ENDPOINT"
```

#### Verify Deployment

```bash
# Health check
curl ${API_ENDPOINT}/api/health

# Should return: {"status":"UP","timestamp":"...","service":"lmc-backend"}
```

### 5. Frontend Deployment

#### Update Configuration

```bash
cd frontend

# Create production .env
cat > .env.production << EOF
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
VITE_API_BASE_URL=${API_ENDPOINT}/api
EOF
```

#### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

Configure environment variables in Netlify dashboard:
- `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `VITE_API_BASE_URL`: Your API Gateway URL

#### Alternative: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 6. Post-Deployment Configuration

#### Update Backend CORS

Update `application.yml` with your frontend URL and redeploy:

```yaml
quarkus:
  http:
    cors:
      origins: https://your-frontend.netlify.app
```

#### Update Clerk Settings

In Clerk dashboard:
- **Allowed redirect URLs**: `https://your-frontend.netlify.app/*`
- **Allowed origins**: `https://your-frontend.netlify.app`

## 🔐 Security Best Practices

### 1. Use AWS Secrets Manager

```bash
# Store database password
aws secretsmanager create-secret \
    --name lmc/db/password \
    --secret-string "YOUR_SECURE_PASSWORD"

# Update Lambda to retrieve from Secrets Manager
# (Add code to fetch secret on Lambda cold start)
```

### 2. Enable RDS Encryption

```bash
# Create KMS key
aws kms create-key --description "LMC RDS Encryption Key"

# Enable encryption on RDS
aws rds modify-db-instance \
    --db-instance-identifier lmc-db-prod \
    --storage-encrypted \
    --kms-key-id alias/aws/rds \
    --apply-immediately
```

### 3. Configure Security Groups

- RDS: Only allow traffic from Lambda security group
- Lambda: Allow outbound to RDS, S3, and Clerk
- No public access to RDS

### 4. Enable SSL/TLS for Database

Update connection URL:
```
jdbc:postgresql://endpoint:5432/lmc_db?ssl=true&sslmode=require
```

## 📊 Monitoring Setup

### CloudWatch Alarms

```bash
# Lambda errors
aws cloudwatch put-metric-alarm \
    --alarm-name lmc-lambda-errors \
    --alarm-description "Alert on Lambda errors" \
    --metric-name Errors \
    --namespace AWS/Lambda \
    --statistic Sum \
    --period 300 \
    --threshold 10 \
    --comparison-operator GreaterThanThreshold

# RDS CPU
aws cloudwatch put-metric-alarm \
    --alarm-name lmc-rds-high-cpu \
    --alarm-description "Alert on high RDS CPU" \
    --metric-name CPUUtilization \
    --namespace AWS/RDS \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold
```

### Enable RDS Enhanced Monitoring

```bash
aws rds modify-db-instance \
    --db-instance-identifier lmc-db-prod \
    --monitoring-interval 60 \
    --monitoring-role-arn arn:aws:iam::account:role/rds-monitoring-role
```

### View Logs

```bash
# Lambda logs
aws logs tail /aws/lambda/lmc-backend --follow

# RDS logs
aws rds describe-db-log-files --db-instance-identifier lmc-db-prod
```

## 💰 Cost Estimation (Monthly)

| Service | Configuration | Cost (EUR) |
|---------|--------------|------------|
| RDS PostgreSQL | db.t4g.micro, 20GB | ~€15 |
| Lambda | 1M requests, 512MB | ~€2 |
| S3 | 10GB storage, 100K requests | ~€0.30 |
| Data Transfer | ~10GB | ~€1 |
| **Total** | | **~€18-20/month** |

*Prices are estimates for eu-west-3 region*

## 🔄 Database Backups

### Automated Backups

```bash
# Backups are already enabled (retention: 7 days)
# To modify:
aws rds modify-db-instance \
    --db-instance-identifier lmc-db-prod \
    --backup-retention-period 14
```

### Manual Snapshot

```bash
aws rds create-db-snapshot \
    --db-instance-identifier lmc-db-prod \
    --db-snapshot-identifier lmc-db-snapshot-$(date +%Y%m%d)
```

### Restore from Snapshot

```bash
aws rds restore-db-instance-from-db-snapshot \
    --db-instance-identifier lmc-db-restored \
    --db-snapshot-identifier lmc-db-snapshot-20241120
```

## 🧪 Testing Production

```bash
# Health check
curl https://your-api.execute-api.eu-west-3.amazonaws.com/api/health

# Get listings (public)
curl https://your-api.execute-api.eu-west-3.amazonaws.com/api/listings

# Create listing (authenticated)
curl -X POST https://your-api.execute-api.eu-west-3.amazonaws.com/api/listings \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Listing",
    "description": "Test",
    "price": 100,
    "category": "Test",
    "location": "Paris",
    "imageUrls": []
  }'
```

## 🆘 Troubleshooting

### Lambda Timeout Connecting to RDS

**Symptoms**: Lambda times out, no database connection

**Solutions**:
1. Verify Lambda is in same VPC as RDS
2. Check Lambda security group allows outbound to port 5432
3. Check RDS security group allows inbound from Lambda SG
4. Ensure NAT Gateway exists for outbound internet access
5. Check RDS is in "available" state

### Flyway Migration Errors

**Symptoms**: Application fails to start, migration errors

**Solutions**:
```bash
# Connect to RDS
psql -h $RDS_ENDPOINT -U admin -d lmc_db

# Check Flyway history
SELECT * FROM flyway_schema_history;

# If needed, manually fix and set baseline
# Then repair in application or manually update table
```

### CORS Errors

**Symptoms**: Frontend can't reach API

**Solutions**:
1. Verify CORS origins in `application.yml`
2. Check API Gateway CORS settings
3. Redeploy Lambda after configuration changes

## 📈 Scaling

### Increase RDS Instance Size

```bash
aws rds modify-db-instance \
    --db-instance-identifier lmc-db-prod \
    --db-instance-class db.t4g.small \
    --apply-immediately
```

### Add Read Replicas

```bash
aws rds create-db-instance-read-replica \
    --db-instance-identifier lmc-db-replica \
    --source-db-instance-identifier lmc-db-prod
```

### Increase Lambda Concurrency

Lambda auto-scales, but you can set reserved concurrency:

```bash
aws lambda put-function-concurrency \
    --function-name lmc-backend \
    --reserved-concurrent-executions 100
```

---

**Happy Deploying! 🎉**

#!/bin/bash

# Deployment script for LeBonCoinCoin Backend to AWS Lambda
# Usage: ./deploy.sh [environment]
# Example: ./deploy.sh prod

set -e

ENVIRONMENT=${1:-dev}

echo "🚀 Deploying LeBonCoinCoin Backend to AWS Lambda (Environment: $ENVIRONMENT)"
echo "☕ Java 21 Runtime"

# Build the application with Lambda profile
echo "📦 Building application..."
mvn clean package -Plambda -DskipTests

# Check if function.zip exists
if [ ! -f "target/function.zip" ]; then
    echo "❌ Error: function.zip not found in target directory"
    exit 1
fi

echo "✅ Build successful"

# Deploy using AWS CLI (example - adjust for your setup)
FUNCTION_NAME="leboncoincoin-backend-${ENVIRONMENT}"
REGION=${AWS_REGION:-eu-west-3}

echo "🔄 Updating Lambda function: $FUNCTION_NAME"

aws lambda update-function-code \
    --function-name $FUNCTION_NAME \
    --zip-file fileb://target/function.zip \
    --region $REGION

echo "✅ Deployment complete!"
echo "📝 Function: $FUNCTION_NAME"
echo "🌍 Region: $REGION"


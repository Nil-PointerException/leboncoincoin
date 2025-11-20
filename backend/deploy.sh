#!/bin/bash

# Deployment script for LMC Backend to AWS Lambda
# Usage: ./deploy.sh [environment]
# Example: ./deploy.sh prod

set -e

ENVIRONMENT=${1:-dev}

echo "🚀 Deploying LMC Backend to AWS Lambda (Environment: $ENVIRONMENT)"

# Build the application
echo "📦 Building application..."
mvn clean package -DskipTests

# Check if function.zip exists
if [ ! -f "target/function.zip" ]; then
    echo "❌ Error: function.zip not found in target directory"
    exit 1
fi

echo "✅ Build successful"

# Deploy using AWS CLI (example - adjust for your setup)
FUNCTION_NAME="lmc-backend-${ENVIRONMENT}"
REGION=${AWS_REGION:-eu-west-3}

echo "🔄 Updating Lambda function: $FUNCTION_NAME"

aws lambda update-function-code \
    --function-name $FUNCTION_NAME \
    --zip-file fileb://target/function.zip \
    --region $REGION

echo "✅ Deployment complete!"
echo "📝 Function: $FUNCTION_NAME"
echo "🌍 Region: $REGION"


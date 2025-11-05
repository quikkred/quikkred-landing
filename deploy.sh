#!/bin/bash

# Quikkred Deployment Script
# Usage: ./deploy.sh

set -e

echo "🚀 Starting Quikkred Deployment..."

# Configuration
AWS_REGION="ap-south-1"
AWS_ACCOUNT_ID="129585540620"
ECR_REPOSITORY="quikkred"
ECS_CLUSTER="quikkred-cluster"
ECS_SERVICE="quikkred-service"
IMAGE_TAG="latest"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1/6: Pulling latest code from GitHub...${NC}"
git pull origin main

echo -e "${YELLOW}Step 2/6: Logging into AWS ECR...${NC}"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

echo -e "${YELLOW}Step 3/6: Building Docker image...${NC}"
docker build --platform linux/amd64 -t $ECR_REPOSITORY:$IMAGE_TAG .

echo -e "${YELLOW}Step 4/6: Tagging image...${NC}"
docker tag $ECR_REPOSITORY:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$IMAGE_TAG

echo -e "${YELLOW}Step 5/6: Pushing to ECR...${NC}"
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$IMAGE_TAG

echo -e "${YELLOW}Step 6/7: Updating ECS service...${NC}"
aws ecs update-service \
  --cluster $ECS_CLUSTER \
  --service $ECS_SERVICE \
  --force-new-deployment \
  --region $AWS_REGION \
  --no-cli-pager

echo -e "${YELLOW}Step 7/7: Invalidating CloudFront cache...${NC}"
CLOUDFRONT_ID="E3GO0B7PSWGAHD"
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_ID \
  --paths "/*" \
  --region $AWS_REGION \
  --no-cli-pager

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${GREEN}ECS will roll out new version in 2-3 minutes.${NC}"
echo -e "${GREEN}CloudFront cache invalidation in progress (2-5 minutes).${NC}"
echo -e "${GREEN}Monitor ECS: https://console.aws.amazon.com/ecs/v2/clusters/$ECS_CLUSTER/services/$ECS_SERVICE${NC}"

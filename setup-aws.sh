#!/bin/bash

# Quikkred AWS Infrastructure Setup Script
# ONE-TIME setup - Run this once to create all infrastructure
# After this, use deploy.sh for deployments

set -e

AWS_REGION="ap-south-1"
AWS_ACCOUNT_ID="129585540620"

echo "🏗️ Setting up Quikkred Infrastructure on AWS Mumbai (ap-south-1)..."
echo "This will take about 10-15 minutes..."
echo ""

# Step 1: ECR Repository (Already created)
echo "✅ Step 1/8: ECR Repository created"

# Step 2: Create ECS Cluster
echo "📦 Step 2/8: Creating ECS Cluster..."
aws ecs create-cluster \
  --cluster-name quikkred-cluster \
  --region $AWS_REGION \
  --no-cli-pager 2>&1 | grep -E '(clusterName|clusterArn)' || echo "Cluster may already exist"

# Step 3: Get Default VPC and Subnets
echo "🌐 Step 3/8: Getting VPC and Subnets..."
VPC_ID=$(aws ec2 describe-vpcs --region $AWS_REGION --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text)
echo "Using VPC: $VPC_ID"

SUBNET_IDS=$(aws ec2 describe-subnets --region $AWS_REGION --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[*].SubnetId' --output text | tr '\t' ',')
echo "Using Subnets: $SUBNET_IDS"

# Step 4: Create Security Group for ALB
echo "🔒 Step 4/8: Creating Security Groups..."
ALB_SG_ID=$(aws ec2 create-security-group \
  --group-name quikkred-alb-sg \
  --description "Security group for Quikkred ALB" \
  --vpc-id $VPC_ID \
  --region $AWS_REGION \
  --output text 2>&1 | grep -o 'sg-[a-z0-9]*' || aws ec2 describe-security-groups --region $AWS_REGION --filters "Name=group-name,Values=quikkred-alb-sg" --query 'SecurityGroups[0].GroupId' --output text)

echo "ALB Security Group: $ALB_SG_ID"

# Allow HTTP and HTTPS on ALB
aws ec2 authorize-security-group-ingress \
  --group-id $ALB_SG_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0 \
  --region $AWS_REGION 2>&1 || echo "Rule may already exist"

aws ec2 authorize-security-group-ingress \
  --group-id $ALB_SG_ID \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0 \
  --region $AWS_REGION 2>&1 || echo "Rule may already exist"

# Step 5: Create Security Group for ECS Tasks
ECS_SG_ID=$(aws ec2 create-security-group \
  --group-name quikkred-ecs-sg \
  --description "Security group for Quikkred ECS tasks" \
  --vpc-id $VPC_ID \
  --region $AWS_REGION \
  --output text 2>&1 | grep -o 'sg-[a-z0-9]*' || aws ec2 describe-security-groups --region $AWS_REGION --filters "Name=group-name,Values=quikkred-ecs-sg" --query 'SecurityGroups[0].GroupId' --output text)

echo "ECS Security Group: $ECS_SG_ID"

# Allow traffic from ALB to ECS on port 3000
aws ec2 authorize-security-group-ingress \
  --group-id $ECS_SG_ID \
  --protocol tcp \
  --port 3000 \
  --source-group $ALB_SG_ID \
  --region $AWS_REGION 2>&1 || echo "Rule may already exist"

# Step 6: Create Application Load Balancer
echo "⚖️  Step 5/8: Creating Application Load Balancer..."
ALB_ARN=$(aws elbv2 create-load-balancer \
  --name quikkred-alb \
  --subnets $(echo $SUBNET_IDS | tr ',' ' ') \
  --security-groups $ALB_SG_ID \
  --region $AWS_REGION \
  --output text 2>&1 | grep -o 'arn:aws:elasticloadbalancing[^ ]*' || aws elbv2 describe-load-balancers --region $AWS_REGION --names quikkred-alb --query 'LoadBalancers[0].LoadBalancerArn' --output text)

echo "ALB ARN: $ALB_ARN"

# Get ALB DNS name
ALB_DNS=$(aws elbv2 describe-load-balancers --region $AWS_REGION --load-balancer-arns $ALB_ARN --query 'LoadBalancers[0].DNSName' --output text)
echo "ALB DNS: $ALB_DNS"

# Step 7: Create Target Group
echo "🎯 Step 6/8: Creating Target Group..."
TG_ARN=$(aws elbv2 create-target-group \
  --name quikkred-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id $VPC_ID \
  --target-type ip \
  --health-check-path / \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --region $AWS_REGION \
  --output text 2>&1 | grep -o 'arn:aws:elasticloadbalancing[^ ]*' || aws elbv2 describe-target-groups --region $AWS_REGION --names quikkred-tg --query 'TargetGroups[0].TargetGroupArn' --output text)

echo "Target Group ARN: $TG_ARN"

# Step 8: Create Listener for ALB
echo "👂 Step 7/8: Creating ALB Listener..."
aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=$TG_ARN \
  --region $AWS_REGION \
  --no-cli-pager 2>&1 || echo "Listener may already exist"

# Step 9: Create ECS Task Execution Role (if not exists)
echo "👤 Step 8/8: Creating IAM Role..."
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "ecs-tasks.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }' 2>&1 || echo "Role may already exist"

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy 2>&1 || echo "Policy may already be attached"

echo ""
echo "✅ Infrastructure setup complete!"
echo ""
echo "📝 Important Information:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "VPC ID: $VPC_ID"
echo "ALB DNS: $ALB_DNS"
echo "ALB ARN: $ALB_ARN"
echo "Target Group ARN: $TG_ARN"
echo "ECS Security Group: $ECS_SG_ID"
echo "Subnets: $SUBNET_IDS"
echo ""
echo "Next steps:"
echo "1. Wait 2-3 minutes for ALB to become active"
echo "2. Run: cd /Users/mahadev/Desktop/Development/quikkred && ./deploy.sh"
echo ""
echo "Your app will be available at: http://$ALB_DNS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

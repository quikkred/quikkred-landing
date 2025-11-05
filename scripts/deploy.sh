#!/bin/bash

# SriKuberOne Deployment Script
# Usage: ./scripts/deploy.sh [environment]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="backups/${TIMESTAMP}"

echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}SriKuberOne Deployment Script${NC}"
echo -e "${GREEN}Environment: ${YELLOW}${ENVIRONMENT}${NC}"
echo -e "${GREEN}==================================${NC}"

# Function to check prerequisites
check_prerequisites() {
    echo -e "\n${YELLOW}Checking prerequisites...${NC}"

    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Node.js is not installed${NC}"
        exit 1
    fi

    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}npm is not installed${NC}"
        exit 1
    fi

    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Docker is not installed${NC}"
        exit 1
    fi

    # Check environment file
    if [ ! -f ".env.${ENVIRONMENT}" ]; then
        echo -e "${RED}Environment file .env.${ENVIRONMENT} not found${NC}"
        exit 1
    fi

    echo -e "${GREEN}All prerequisites met${NC}"
}

# Function to run tests
run_tests() {
    echo -e "\n${YELLOW}Running tests...${NC}"

    # Run linting
    npm run lint || {
        echo -e "${RED}Linting failed${NC}"
        exit 1
    }

    # Run unit tests
    npm test || {
        echo -e "${RED}Unit tests failed${NC}"
        exit 1
    }

    # Run build test
    npm run build || {
        echo -e "${RED}Build failed${NC}"
        exit 1
    }

    echo -e "${GREEN}All tests passed${NC}"
}

# Function to backup current deployment
backup_current() {
    echo -e "\n${YELLOW}Creating backup...${NC}"

    mkdir -p ${BACKUP_DIR}

    # Backup database
    docker exec SriKuberone-postgres pg_dump -U SriKuberone SriKuberone_db > ${BACKUP_DIR}/database.sql

    # Backup environment files
    cp .env.* ${BACKUP_DIR}/

    # Backup uploads
    if [ -d "uploads" ]; then
        tar -czf ${BACKUP_DIR}/uploads.tar.gz uploads/
    fi

    echo -e "${GREEN}Backup created at ${BACKUP_DIR}${NC}"
}

# Function to deploy application
deploy() {
    echo -e "\n${YELLOW}Starting deployment...${NC}"

    # Copy environment file
    cp .env.${ENVIRONMENT} .env.production

    # Build Docker images
    docker-compose build --no-cache

    # Run database migrations
    docker-compose run --rm app npx prisma migrate deploy

    # Stop old containers
    docker-compose down

    # Start new containers
    docker-compose up -d

    # Wait for services to be healthy
    echo -e "${YELLOW}Waiting for services to be healthy...${NC}"
    sleep 10

    # Check health
    docker-compose ps

    echo -e "${GREEN}Deployment completed${NC}"
}

# Function to run post-deployment checks
post_deployment_checks() {
    echo -e "\n${YELLOW}Running post-deployment checks...${NC}"

    # Check application health
    curl -f http://localhost:3000/api/health || {
        echo -e "${RED}Health check failed${NC}"
        exit 1
    }

    # Check database connection
    docker exec SriKuberone-postgres pg_isready || {
        echo -e "${RED}Database check failed${NC}"
        exit 1
    }

    # Check Redis connection
    docker exec SriKuberone-redis redis-cli ping || {
        echo -e "${RED}Redis check failed${NC}"
        exit 1
    }

    echo -e "${GREEN}All post-deployment checks passed${NC}"
}

# Function to rollback deployment
rollback() {
    echo -e "\n${RED}Rolling back deployment...${NC}"

    # Stop current containers
    docker-compose down

    # Restore database
    if [ -f "${BACKUP_DIR}/database.sql" ]; then
        docker-compose up -d postgres
        sleep 5
        docker exec -i SriKuberone-postgres psql -U SriKuberone SriKuberone_db < ${BACKUP_DIR}/database.sql
    fi

    # Restore environment files
    cp ${BACKUP_DIR}/.env.* .

    # Restart with previous version
    docker-compose up -d

    echo -e "${YELLOW}Rollback completed${NC}"
}

# Main deployment flow
main() {
    check_prerequisites

    # Run tests in development/staging only
    if [ "${ENVIRONMENT}" != "production" ]; then
        run_tests
    fi

    # Backup current deployment (if exists)
    if [ "$(docker ps -q -f name=SriKuberone-app)" ]; then
        backup_current
    fi

    # Deploy
    deploy || {
        echo -e "${RED}Deployment failed, rolling back...${NC}"
        rollback
        exit 1
    }

    # Post-deployment checks
    post_deployment_checks || {
        echo -e "${RED}Post-deployment checks failed, rolling back...${NC}"
        rollback
        exit 1
    }

    echo -e "\n${GREEN}==================================${NC}"
    echo -e "${GREEN}Deployment Successful!${NC}"
    echo -e "${GREEN}Application: http://localhost:3000${NC}"
    echo -e "${GREEN}Admin Panel: http://localhost:3000/admin${NC}"
    echo -e "${GREEN}API Health: http://localhost:3000/api/health${NC}"
    echo -e "${GREEN}==================================${NC}"
}

# Run main function
main
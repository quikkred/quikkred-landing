#!/bin/bash

# SriKuberOne Platform Testing Script
# Comprehensive testing of all platform features

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Base URL
BASE_URL="http://localhost:3000"
API_URL="${BASE_URL}/api"

# Test results
PASSED=0
FAILED=0
TOTAL=0

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local expected_status=$3
    local description=$4

    TOTAL=$((TOTAL + 1))

    echo -ne "${BLUE}Testing: ${description}...${NC} "

    if [ "$method" == "GET" ]; then
        status=$(curl -s -o /dev/null -w "%{http_code}" "${endpoint}")
    else
        status=$(curl -X ${method} -s -o /dev/null -w "%{http_code}" "${endpoint}")
    fi

    if [ "$status" == "$expected_status" ]; then
        echo -e "${GREEN}PASSED${NC} (${status})"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}FAILED${NC} (Expected: ${expected_status}, Got: ${status})"
        FAILED=$((FAILED + 1))
    fi
}

# Function to test API with data
test_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5

    TOTAL=$((TOTAL + 1))

    echo -ne "${BLUE}Testing: ${description}...${NC} "

    if [ -z "$data" ]; then
        status=$(curl -X ${method} -s -o /dev/null -w "%{http_code}" \
            -H "Content-Type: application/json" \
            "${endpoint}")
    else
        status=$(curl -X ${method} -s -o /dev/null -w "%{http_code}" \
            -H "Content-Type: application/json" \
            -d "${data}" \
            "${endpoint}")
    fi

    if [ "$status" == "$expected_status" ]; then
        echo -e "${GREEN}PASSED${NC} (${status})"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}FAILED${NC} (Expected: ${expected_status}, Got: ${status})"
        FAILED=$((FAILED + 1))
    fi
}

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}SriKuberOne Platform Comprehensive Test${NC}"
echo -e "${GREEN}======================================${NC}\n"

# Check if server is running
echo -e "${YELLOW}1. Server Health Check${NC}"
test_endpoint "GET" "${API_URL}/health" "200" "API Health Check"

echo -e "\n${YELLOW}2. Frontend Pages${NC}"
test_endpoint "GET" "${BASE_URL}/" "200" "Homepage"
test_endpoint "GET" "${BASE_URL}/products" "200" "Products Page"
test_endpoint "GET" "${BASE_URL}/login" "200" "Login Page"
test_endpoint "GET" "${BASE_URL}/apply" "200" "Apply Page"
test_endpoint "GET" "${BASE_URL}/partners" "200" "Partners Page"
test_endpoint "GET" "${BASE_URL}/contact" "200" "Contact Page"
test_endpoint "GET" "${BASE_URL}/terms" "200" "Terms Page"
test_endpoint "GET" "${BASE_URL}/privacy" "200" "Privacy Policy"
test_endpoint "GET" "${BASE_URL}/dashboard" "200" "Customer Dashboard"
test_endpoint "GET" "${BASE_URL}/admin" "200" "Admin Dashboard"

echo -e "\n${YELLOW}3. API Endpoints - Authentication${NC}"
test_api "POST" "${API_URL}/auth/register" \
    '{"fullName":"Test User","email":"test@example.com","mobileNumber":"9876543210","password":"Test@123"}' \
    "200" "User Registration"

test_api "POST" "${API_URL}/auth/login" \
    '{"emailOrMobile":"test@example.com","password":"password123"}' \
    "200" "User Login"

echo -e "\n${YELLOW}4. API Endpoints - Loans${NC}"
test_api "POST" "${API_URL}/loans/calculate-emi" \
    '{"loanAmount":100000,"interestRate":12,"tenure":12}' \
    "200" "EMI Calculator"

test_api "POST" "${API_URL}/loans/apply" \
    '{"fullName":"Test User","mobileNumber":"9876543210","loanAmount":50000}' \
    "200" "Loan Application"

test_endpoint "GET" "${API_URL}/loans/products" "200" "Get Loan Products"
test_api "POST" "${API_URL}/loans/check-eligibility" \
    '{"income":50000,"creditScore":700,"loanAmount":100000}' \
    "200" "Check Eligibility"

echo -e "\n${YELLOW}5. API Endpoints - User Management${NC}"
test_endpoint "GET" "${API_URL}/users/profile" "401" "Get Profile (Unauthenticated)"
test_endpoint "GET" "${API_URL}/users/credit-score" "401" "Get Credit Score (Unauthenticated)"

echo -e "\n${YELLOW}6. API Endpoints - Admin${NC}"
test_endpoint "GET" "${API_URL}/admin/dashboard" "401" "Admin Dashboard (Unauthenticated)"
test_endpoint "GET" "${API_URL}/admin/users" "401" "Admin Users List (Unauthenticated)"

echo -e "\n${YELLOW}7. API Endpoints - Payments${NC}"
test_api "POST" "${API_URL}/payments/initiate" \
    '{"amount":5000,"method":"UPI"}' \
    "401" "Payment Initiation (Unauthenticated)"

echo -e "\n${YELLOW}8. API Endpoints - Support${NC}"
test_api "POST" "${API_URL}/support/ticket" \
    '{"subject":"Test Ticket","message":"This is a test"}' \
    "200" "Create Support Ticket"

echo -e "\n${YELLOW}9. API Endpoints - Notifications${NC}"
test_endpoint "GET" "${API_URL}/notifications" "401" "Get Notifications (Unauthenticated)"

echo -e "\n${YELLOW}10. Static Assets${NC}"
test_endpoint "GET" "${BASE_URL}/favicon.ico" "200" "Favicon"

echo -e "\n${YELLOW}11. Error Handling${NC}"
test_endpoint "GET" "${BASE_URL}/non-existent-page" "404" "404 Error Page"
test_endpoint "GET" "${API_URL}/non-existent-api" "404" "404 API Endpoint"

echo -e "\n${YELLOW}12. Performance Tests${NC}"
echo -ne "${BLUE}Testing: Response Time...${NC} "
start_time=$(date +%s%N)
curl -s -o /dev/null "${BASE_URL}/"
end_time=$(date +%s%N)
response_time=$((($end_time - $start_time) / 1000000))
if [ $response_time -lt 3000 ]; then
    echo -e "${GREEN}PASSED${NC} (${response_time}ms)"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}SLOW${NC} (${response_time}ms)"
    FAILED=$((FAILED + 1))
fi
TOTAL=$((TOTAL + 1))

# Summary
echo -e "\n${GREEN}======================================${NC}"
echo -e "${GREEN}Test Results Summary${NC}"
echo -e "${GREEN}======================================${NC}"
echo -e "Total Tests: ${TOTAL}"
echo -e "${GREEN}Passed: ${PASSED}${NC}"
echo -e "${RED}Failed: ${FAILED}${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✅ All tests passed successfully!${NC}"
    echo -e "${GREEN}The SriKuberOne platform is fully operational!${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Some tests failed. Please check the logs.${NC}"
    exit 1
fi
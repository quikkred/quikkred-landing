#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000/api"

# Generate JWT token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGxheG1pb25lLmNvbSIsInVzZXJUeXBlIjoiVVNFUiIsImlhdCI6MTc1ODEwNDY4OCwiZXhwIjoxNzU4MTkxMDg4fQ.Tx3vgn28MKtEgjnNIKpXMgccJNCnyARYy2CzQEFymOE"

echo "🚀 Testing SriKuberOne API Endpoints"
echo "=================================="
echo ""

# Counter for success/fail
SUCCESS=0
FAIL=0

# Function to test endpoint
test_endpoint() {
    local method=$1
    local path=$2
    local data=$3
    local auth=$4
    local name=$5

    echo -n "Testing $name... "

    if [ "$auth" = "true" ]; then
        headers="-H \"Authorization: Bearer $TOKEN\""
    else
        headers=""
    fi

    if [ -n "$data" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            $headers \
            -d "$data" \
            "$BASE_URL$path" 2>/dev/null)
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            $headers \
            "$BASE_URL$path" 2>/dev/null)
    fi

    if [ "$response" -ge 200 ] && [ "$response" -lt 300 ]; then
        echo -e "${GREEN}✅ [$response]${NC}"
        ((SUCCESS++))
    else
        echo -e "${RED}❌ [$response]${NC}"
        ((FAIL++))
    fi
}

# Test all endpoints
echo "Basic APIs"
echo "----------"
test_endpoint "GET" "/health" "" "false" "Health Check"

echo ""
echo "Authentication APIs"
echo "------------------"
test_endpoint "POST" "/auth/register" '{"fullName":"Test User","mobileNumber":"9876543210","email":"test@test.com","password":"Test@123","confirmPassword":"Test@123"}' "false" "Register"
test_endpoint "POST" "/auth/login" '{"emailOrMobile":"test@SriKuberone.com","password":"Test@123"}' "false" "Login"

echo ""
echo "Loan APIs"
echo "---------"
test_endpoint "POST" "/loans/calculate-emi" '{"loanAmount":100000,"interestRate":12,"tenure":12}' "false" "Calculate EMI"
test_endpoint "GET" "/loans/products" "" "false" "Loan Products"
test_endpoint "POST" "/loans/check-eligibility" '{"loanAmount":50000,"loanType":"PERSONAL","tenure":12}' "true" "Check Eligibility"
test_endpoint "POST" "/loans/apply" '{"fullName":"Test User","mobileNumber":"9876543210","email":"test@example.com","panCard":"ABCDE1234F","aadhaarCard":"123456789012","loanAmount":50000,"loanType":"PERSONAL","tenure":12,"purpose":"Personal","employmentType":"SALARIED","monthlyIncome":50000}' "false" "Apply Loan"

echo ""
echo "AI Services"
echo "-----------"
test_endpoint "POST" "/ai/credit-score" '{"loanAmount":50000,"tenure":12}' "true" "AI Credit Score"

echo ""
echo "Fraud Detection"
echo "---------------"
test_endpoint "POST" "/fraud/check" '{"transactionType":"LOAN_APPLICATION","amount":50000}' "false" "Fraud Check"

echo ""
echo "User APIs"
echo "---------"
test_endpoint "GET" "/users/profile" "" "true" "User Profile"
test_endpoint "GET" "/users/credit-score" "" "true" "Credit Score"

echo ""
echo "Admin APIs"
echo "----------"
test_endpoint "GET" "/admin/dashboard" "" "true" "Admin Dashboard"

echo ""
echo "Other APIs"
echo "----------"
test_endpoint "GET" "/notifications" "" "true" "Notifications"

# Summary
echo ""
echo "📊 Summary"
echo "========="
TOTAL=$((SUCCESS + FAIL))
PERCENTAGE=$((SUCCESS * 100 / TOTAL))
echo -e "${GREEN}✅ Working: $SUCCESS/$TOTAL ($PERCENTAGE%)${NC}"
echo -e "${RED}❌ Failed: $FAIL/$TOTAL${NC}"
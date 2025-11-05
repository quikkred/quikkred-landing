#!/bin/bash

echo "========================================="
echo "  Testing SriKuberOne API Endpoints"
echo "========================================="
echo ""

BASE_URL="http://localhost:3000/api"
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4

    echo -n "Testing: $description... "

    if [ "$method" = "GET" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" "$BASE_URL$endpoint")
    fi

    if [ "$response" = "200" ] || [ "$response" = "201" ]; then
        echo -e "${GREEN}✅ OK ($response)${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED ($response)${NC}"
        return 1
    fi
}

# Counter for success/failure
SUCCESS=0
FAILED=0

# Test health endpoint
if test_endpoint "GET" "/health" "" "Health Check"; then
    SUCCESS=$((SUCCESS + 1))
else
    FAILED=$((FAILED + 1))
fi

# Test auth endpoints
if test_endpoint "POST" "/auth/register" '{"fullName":"Test User","email":"test'$(date +%s)'@example.com","mobileNumber":"98'$(date +%s | tail -c 9)'","password":"Test@123"}' "User Registration"; then
    SUCCESS=$((SUCCESS + 1))
else
    FAILED=$((FAILED + 1))
fi

if test_endpoint "POST" "/auth/login" '{"emailOrMobile":"9876543210","password":"Test@123"}' "User Login"; then
    SUCCESS=$((SUCCESS + 1))
else
    FAILED=$((FAILED + 1))
fi

# Test loan endpoints
if test_endpoint "GET" "/loans/products" "" "Get Loan Products"; then
    SUCCESS=$((SUCCESS + 1))
else
    FAILED=$((FAILED + 1))
fi

if test_endpoint "POST" "/loans/calculate-emi" '{"loanAmount":100000,"interestRate":12,"tenure":12}' "Calculate EMI"; then
    SUCCESS=$((SUCCESS + 1))
else
    FAILED=$((FAILED + 1))
fi

if test_endpoint "POST" "/loans/check-eligibility" '{"monthlyIncome":50000,"existingEMI":5000,"creditScore":700}' "Check Eligibility"; then
    SUCCESS=$((SUCCESS + 1))
else
    FAILED=$((FAILED + 1))
fi

if test_endpoint "POST" "/loans/apply" '{"fullName":"Test User","mobileNumber":"9876543210","loanAmount":100000,"tenure":12}' "Apply for Loan"; then
    SUCCESS=$((SUCCESS + 1))
else
    FAILED=$((FAILED + 1))
fi

# Test user endpoints
if test_endpoint "GET" "/users/profile" "" "Get User Profile"; then
    SUCCESS=$((SUCCESS + 1))
else
    FAILED=$((FAILED + 1))
fi

if test_endpoint "GET" "/users/credit-score" "" "Get Credit Score"; then
    SUCCESS=$((SUCCESS + 1))
else
    FAILED=$((FAILED + 1))
fi

# Test notification endpoint
if test_endpoint "GET" "/notifications" "" "Get Notifications"; then
    SUCCESS=$((SUCCESS + 1))
else
    FAILED=$((FAILED + 1))
fi

# Test admin endpoints
if test_endpoint "GET" "/admin/dashboard" "" "Admin Dashboard"; then
    SUCCESS=$((SUCCESS + 1))
else
    FAILED=$((FAILED + 1))
fi

echo ""
echo "========================================="
echo "  Test Results Summary"
echo "========================================="
echo -e "${GREEN}✅ Passed: $SUCCESS${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo ""

TOTAL=$((SUCCESS + FAILED))
PERCENTAGE=$((SUCCESS * 100 / TOTAL))
echo "Success Rate: ${PERCENTAGE}%"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Please check the implementation.${NC}"
    exit 1
fi
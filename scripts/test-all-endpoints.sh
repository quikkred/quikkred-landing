#!/bin/bash

# Test all API endpoints
echo "Testing SriKuberOne API Endpoints"
echo "=============================="

BASE_URL="http://localhost:3000/api"

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4

    echo -ne "Testing: $description... "

    if [ "$method" == "GET" ]; then
        status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint")
    elif [ -z "$data" ]; then
        status=$(curl -X $method -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint")
    else
        status=$(curl -X $method -H "Content-Type: application/json" -d "$data" -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint")
    fi

    if [ "$status" -lt 500 ]; then
        echo "✅ ($status)"
    else
        echo "❌ ($status)"
    fi
}

echo -e "\n1. Core APIs"
test_endpoint "GET" "/health" "" "Health Check"

echo -e "\n2. Authentication APIs"
test_endpoint "POST" "/auth/register" '{"fullName":"Test","email":"test@test.com","mobileNumber":"9876543210","password":"Test@123"}' "Register"
test_endpoint "POST" "/auth/login" '{"emailOrMobile":"test@test.com","password":"password123"}' "Login"

echo -e "\n3. Loan APIs"
test_endpoint "POST" "/loans/calculate-emi" '{"loanAmount":100000,"interestRate":12,"tenure":12}' "EMI Calculator"
test_endpoint "POST" "/loans/apply" '{"fullName":"Test","mobileNumber":"9876543210","loanAmount":50000}' "Apply Loan"
test_endpoint "GET" "/loans/products" "" "Get Products"
test_endpoint "POST" "/loans/check-eligibility" '{"income":50000,"creditScore":700,"loanAmount":100000}' "Check Eligibility"
test_endpoint "GET" "/loans/my-loans" "" "My Loans"
test_endpoint "POST" "/loans/prepayment" '{"loanId":"123","amount":10000}' "Prepayment"
test_endpoint "GET" "/loans/schedule?loanId=123" "" "EMI Schedule"

echo -e "\n4. User APIs"
test_endpoint "GET" "/users/profile" "" "User Profile"
test_endpoint "GET" "/users/credit-score" "" "Credit Score"
test_endpoint "POST" "/users/kyc" '{"documentType":"aadhaar","documentNumber":"123456789012"}' "KYC Upload"
test_endpoint "PUT" "/users/update" '{"name":"Updated Name"}' "Update Profile"

echo -e "\n5. Admin APIs"
test_endpoint "GET" "/admin/dashboard" "" "Admin Dashboard"
test_endpoint "GET" "/admin/users" "" "Admin Users"

echo -e "\n6. Payment APIs"
test_endpoint "POST" "/payments/initiate" '{"amount":5000,"method":"UPI"}' "Initiate Payment"

echo -e "\n7. Support APIs"
test_endpoint "POST" "/support/ticket" '{"subject":"Test","message":"Test message"}' "Create Ticket"

echo -e "\n8. Notification APIs"
test_endpoint "GET" "/notifications" "" "Get Notifications"

echo -e "\n9. AI APIs"
test_endpoint "POST" "/ai/fraud-check" '{"userId":"123","transaction":{}}' "Fraud Check"
test_endpoint "POST" "/ai/collection" '{"customerId":"123"}' "Collection AI"
test_endpoint "POST" "/ai/spending-analysis" '{"userId":"123"}' "Spending Analysis"

echo -e "\n10. Credit Bureau APIs"
test_endpoint "GET" "/bureau/score?userId=123" "" "Bureau Score"

echo -e "\n11. KYC APIs"
test_endpoint "POST" "/kyc/verify" '{"type":"aadhaar","number":"123456789012"}' "Verify KYC"

echo -e "\n12. Portfolio APIs"
test_endpoint "GET" "/portfolio/bad-debt" "" "Bad Debt Analysis"

echo -e "\n=============================="
echo "Testing Complete!"
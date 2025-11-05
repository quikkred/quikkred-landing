# Quikkred API Specification v1.0

## Base URL
```
Production: https://api.bluechipfinmax.com/v1
Staging: https://api-staging.Quikkred.com/v1
```

## Authentication
All API requests require JWT authentication token in header:
```
Authorization: Bearer <jwt_token>
```

## Core APIs

### 1. KYC & Identity APIs

#### PAN Verification
```http
POST /kyc/pan/verify
```
```json
{
  "pan": "ABCDE1234F",
  "name": "RAVI KUMAR",
  "dob": "1994-05-11"
}
```

#### Aadhaar eKYC
```http
POST /kyc/aadhaar/ekyc
```
```json
{
  "aadhaar_number": "XXXX-XXXX-1234",
  "consent": true,
  "consent_timestamp": "2024-01-01T10:00:00Z",
  "otp": "123456"
}
```

#### Video KYC Session
```http
POST /kyc/video/initiate
```
```json
{
  "customer_id": "C123456",
  "session_type": "full_kyc",
  "language": "en"
}
```

### 2. Bank & Income APIs

#### Account Aggregator Consent
```http
POST /bank/aa/consent/initiate
```
```json
{
  "customer_id": "C123456",
  "aa_provider": "finvu",
  "accounts": ["savings", "current"],
  "duration_months": 6,
  "purpose": "loan_underwriting"
}
```

#### Bank Statement Analysis
```http
POST /bank/statement/analyze
```
```json
{
  "customer_id": "C123456",
  "consent_id": "AA123456",
  "analysis_type": "income_verification"
}
```

### 3. Credit Bureau APIs

#### CIBIL Score Pull
```http
POST /bureau/cibil/pull
```
```json
{
  "customer_id": "C123456",
  "pan": "ABCDE1234F",
  "full_name": "RAVI KUMAR",
  "dob": "1994-05-11",
  "mobile": "+919876543210",
  "purpose": "credit_underwriting"
}
```

#### Multi-Bureau Pull
```http
POST /bureau/multi/pull
```
```json
{
  "customer_id": "C123456",
  "bureaus": ["cibil", "experian", "crif"],
  "consent_id": "CONSENT123"
}
```

### 4. Loan Application APIs

#### Create Application
```http
POST /loan/application/create
```
```json
{
  "customer_id": "C123456",
  "loan_amount": 50000,
  "tenure_days": 90,
  "purpose": "medical_emergency",
  "employment_type": "salaried",
  "monthly_income": 45000
}
```

#### AI Credit Decision
```http
POST /loan/decision/ai
```
```json
{
  "application_id": "APP123456",
  "bureau_data": {},
  "bank_data": {},
  "employment_data": {},
  "real_time_signals": {}
}
```
Response:
```json
{
  "decision": "approved",
  "approved_amount": 45000,
  "interest_rate": 1.5,
  "tenure_days": 90,
  "monthly_emi": 15500,
  "risk_score": 720,
  "reasons": ["stable_income", "good_credit_history"],
  "processing_time_ms": 28
}
```

### 5. Disbursement APIs

#### Initiate Disbursement
```http
POST /disbursement/initiate
```
```json
{
  "loan_id": "L123456",
  "disbursement_mode": "imps",
  "beneficiary": {
    "account_number": "1234567890",
    "ifsc": "HDFC0001234",
    "name": "RAVI KUMAR"
  },
  "amount": 45000
}
```

### 6. Collection APIs

#### UPI Autopay Mandate
```http
POST /collection/mandate/upi/create
```
```json
{
  "loan_id": "L123456",
  "customer_upi": "ravi@paytm",
  "mandate_type": "fixed",
  "amount": 15500,
  "frequency": "monthly",
  "start_date": "2024-02-01",
  "end_date": "2024-04-30"
}
```

#### Collection Status
```http
GET /collection/status/{loan_id}
```

### 7. AI Assistant APIs

#### Voice Loan Application
```http
POST /ai/voice/apply
```
```json
{
  "audio_base64": "...",
  "language": "hi",
  "session_id": "VOICE123"
}
```

#### Chat Assistant
```http
POST /ai/chat/message
```
```json
{
  "message": "I need a loan of 50000",
  "session_id": "CHAT123",
  "context": {}
}
```

## WebSocket Events

### Real-time Updates
```javascript
ws://api.Quikkred.com/ws

// Subscribe to loan updates
{
  "type": "subscribe",
  "channel": "loan_updates",
  "loan_id": "L123456"
}

// Receive updates
{
  "type": "update",
  "event": "disbursement_completed",
  "data": {
    "loan_id": "L123456",
    "utr": "IMPS123456",
    "amount": 45000,
    "timestamp": "2024-01-01T10:00:00Z"
  }
}
```

## GraphQL Schema

```graphql
type Query {
  customer(id: ID!): Customer
  loan(id: ID!): Loan
  applications(status: ApplicationStatus): [Application]
}

type Mutation {
  createApplication(input: ApplicationInput!): Application
  approveLoan(applicationId: ID!): Loan
  initiateKYC(customerId: ID!): KYCSession
}

type Subscription {
  loanUpdates(loanId: ID!): LoanUpdate
  applicationStatus(applicationId: ID!): ApplicationUpdate
}

type Customer {
  id: ID!
  name: String!
  mobile: String!
  kyc: KYCStatus!
  creditScore: Int
  loans: [Loan]
}

type Loan {
  id: ID!
  amount: Float!
  status: LoanStatus!
  emi: Float!
  disbursementDate: DateTime
  collections: [Collection]
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 1001 | Invalid PAN format |
| 1002 | Aadhaar verification failed |
| 2001 | Bureau data not available |
| 2002 | Credit score below threshold |
| 3001 | Insufficient income |
| 3002 | High debt burden |
| 4001 | Disbursement failed |
| 5001 | Mandate creation failed |

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| KYC APIs | 100/hour |
| Bureau Pull | 10/hour |
| Loan Application | 50/hour |
| General APIs | 1000/hour |
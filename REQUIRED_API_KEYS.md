# 🔑 Required API Keys for Quikkred NBFC Platform

## Overview
This document lists all the external API keys and credentials required to run the Quikkred platform with full functionality.

---

## 1. 💳 Payment Gateway

### **Razorpay** (Primary Payment Gateway)
```env
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXX
RAZORPAY_WEBHOOK_SECRET=XXXXXXXXXXXXXXXXXX
```

**Where to get:**
- Sign up at: https://razorpay.com
- Dashboard → Account & Settings → API Keys
- Pricing: 2% per transaction
- Test Mode Available: Yes (use rzp_test_ prefix)

**Used for:**
- Loan disbursements
- EMI collections
- Refund processing
- Payment links generation

---

## 2. 🤖 AI/ML Services

### **OpenAI GPT-4** (Customer Support & Analysis)
```env
OPENAI_API_KEY=sk-XXXXXXXXXXXXXXXXXX
OPENAI_ORG_ID=org-XXXXXXXXXXXXXXXXXX
```

**Where to get:**
- Sign up at: https://platform.openai.com
- API Keys section
- Pricing: ~$0.03 per 1K tokens
- Free credits: $5 for new accounts

**Used for:**
- Customer support chat
- Document analysis
- Fraud pattern detection
- Risk assessment

### **Anthropic Claude** (Risk Assessment & Compliance)
```env
ANTHROPIC_API_KEY=sk-ant-XXXXXXXXXXXXXXXXXX
```

**Where to get:**
- Sign up at: https://console.anthropic.com
- API Keys section
- Pricing: Similar to GPT-4
- Free tier: Limited

**Used for:**
- Advanced risk scoring
- Compliance checking
- Collection intelligence
- Complex decision making

---

## 3. 📱 Communication Services

### **Twilio** (SMS & Voice Calls)
```env
TWILIO_ACCOUNT_SID=AC_XXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=XXXXXXXXXXXXXXXXXX
TWILIO_PHONE_NUMBER=+91XXXXXXXXXX
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

**Where to get:**
- Sign up at: https://www.twilio.com
- Console → Account Info
- Pricing: ~₹0.20 per SMS, ~₹0.50 per minute voice
- Free credits: $15 trial

**Used for:**
- OTP verification
- Payment reminders
- Collection calls
- Emergency notifications

### **SendGrid** (Email Service)
```env
SENDGRID_API_KEY=SG.XXXXXXXXXXXXXXXXXX
SENDGRID_FROM_EMAIL=noreply@Quikkred.com
SENDGRID_TEMPLATE_ID_WELCOME=d-XXXXXXXXXXXXXXXXXX
SENDGRID_TEMPLATE_ID_OTP=d-XXXXXXXXXXXXXXXXXX
```

**Where to get:**
- Sign up at: https://sendgrid.com
- Settings → API Keys
- Pricing: Free tier - 100 emails/day
- Paid: Starting $15/month

**Used for:**
- Welcome emails
- OTP emails
- Statements
- Notifications

### **WhatsApp Business API** (via Twilio or Meta)
```env
WHATSAPP_API_TOKEN=EAXXXXXXXXXXXXXXXXXX
WHATSAPP_PHONE_ID=XXXXXXXXXXXXXXXXXX
WHATSAPP_BUSINESS_ID=XXXXXXXXXXXXXXXXXX
```

**Where to get:**
- Via Twilio (easier) or Meta Business
- Requires business verification
- Pricing: ~₹0.50 per conversation

**Used for:**
- Customer support
- Document collection
- Payment reminders

---

## 4. ☁️ AWS Services

### **AWS Core Services**
```env
AWS_ACCESS_KEY_ID=AKIA_XXXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=XXXXXXXXXXXXXXXXXX
AWS_REGION=ap-south-1
```

### **S3 Storage** (Document Storage)
```env
AWS_S3_BUCKET=Quikkred-documents
AWS_S3_REGION=ap-south-1
AWS_S3_ENDPOINT=https://s3.ap-south-1.amazonaws.com
```

**Where to get:**
- AWS Console → IAM → Users → Create Access Key
- Pricing: ~$0.023 per GB/month
- Free tier: 5GB for 12 months

**Used for:**
- KYC documents
- Loan agreements
- User uploads
- Backups

### **AWS Textract** (OCR/Document Processing)
```env
AWS_TEXTRACT_REGION=ap-south-1
```

**Used for:**
- Aadhaar extraction
- PAN card reading
- Bank statement analysis
- Salary slip processing

---

## 5. 📊 Credit Bureau APIs

### **CIBIL (TransUnion)**
```env
CIBIL_API_KEY=XXXXXXXXXXXXXXXXXX
CIBIL_API_SECRET=XXXXXXXXXXXXXXXXXX
CIBIL_MEMBER_ID=XXXXXXXXXXXXXXXXXX
CIBIL_USER_ID=XXXXXXXXXXXXXXXXXX
CIBIL_PASSWORD=XXXXXXXXXXXXXXXXXX
```

**Where to get:**
- Apply at: https://www.transunioncibil.com
- Requires NBFC license
- Pricing: ₹15-50 per pull
- Sandbox available: Yes

**Used for:**
- Credit score fetching
- Credit history
- Default checking

### **Experian**
```env
EXPERIAN_API_KEY=XXXXXXXXXXXXXXXXXX
EXPERIAN_API_SECRET=XXXXXXXXXXXXXXXXXX
EXPERIAN_CLIENT_ID=XXXXXXXXXXXXXXXXXX
```

**Where to get:**
- Apply at: https://www.experian.in
- Requires business verification
- Pricing: Similar to CIBIL

---

## 6. 🏦 Banking & KYC Services

### **Bank Account Verification (Razorpay Route)**
```env
RAZORPAY_ACCOUNT_VERIFICATION=enabled
```
*Uses same Razorpay credentials*

### **Aadhaar Verification (UIDAI)**
```env
AADHAAR_API_KEY=XXXXXXXXXXXXXXXXXX
AADHAAR_API_SECRET=XXXXXXXXXXXXXXXXXX
DIGILOCKER_API_KEY=XXXXXXXXXXXXXXXXXX
```

**Where to get:**
- Via aggregators like Signzy, IDfy
- Requires compliance approval
- Pricing: ₹3-10 per verification

### **PAN Verification**
```env
PAN_VERIFICATION_KEY=XXXXXXXXXXXXXXXXXX
NSDL_API_KEY=XXXXXXXXXXXXXXXXXX
```

---

## 7. 🔍 Other Services

### **Google Maps** (Branch Locator)
```env
GOOGLE_MAPS_API_KEY=AIza_XXXXXXXXXXXXXXXXXX
```

**Where to get:**
- Google Cloud Console
- Enable Maps JavaScript API
- Pricing: $200 free credits/month

### **Sentry** (Error Tracking)
```env
SENTRY_DSN=https://XXXXX@sentry.io/XXXXX
SENTRY_ORG=Quikkred
SENTRY_PROJECT=web
```

**Where to get:**
- Sign up at: https://sentry.io
- Free tier: 5K errors/month

### **Analytics**
```env
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
MIXPANEL_TOKEN=XXXXXXXXXXXXXXXXXX
```

---

## 8. 🔐 Authentication & Security

### **NextAuth** (Already configured)
```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
```

### **JWT Secret** (Already configured)
```env
JWT_SECRET=generate-strong-secret-key
```

---

## 📝 Priority Order for Testing

### **Phase 1 - Essential (Can run without these but limited)**
1. ✅ PostgreSQL (local) - DONE
2. ✅ Redis (local) - Can use memory cache
3. ✅ JWT_SECRET - Any string works for testing

### **Phase 2 - Core Features (Need for main functionality)**
1. Razorpay - Payment processing
2. Twilio - OTP verification
3. SendGrid - Email notifications
4. OpenAI - AI features

### **Phase 3 - Advanced (Full production)**
1. CIBIL/Experian - Credit scoring
2. AWS Services - Document management
3. WhatsApp API - Customer communication
4. Aadhaar/PAN - KYC verification

---

## 🚀 Quick Start with Test Keys

For immediate testing, you can use these test/sandbox keys:

```env
# Copy to .env.local for testing

# Payment (Razorpay Test Mode)
RAZORPAY_KEY_ID=rzp_test_1234567890abcd
RAZORPAY_KEY_SECRET=testsecret123456789

# AI Services (Limited free tier)
OPENAI_API_KEY=sk-... (get free $5 credits)
ANTHROPIC_API_KEY=sk-ant-... (apply for access)

# Communication (Twilio Trial)
TWILIO_ACCOUNT_SID=AC... (get trial account)
TWILIO_AUTH_TOKEN=... (from trial account)
SENDGRID_API_KEY=SG... (100 emails/day free)

# AWS (Free Tier)
AWS_ACCESS_KEY_ID=AKIA... (create IAM user)
AWS_SECRET_ACCESS_KEY=... (from IAM)
```

---

## 💡 Tips

1. **Start with test/sandbox keys** for development
2. **Use environment-specific files**: .env.local, .env.production
3. **Never commit API keys** to Git
4. **Rotate keys regularly** in production
5. **Use secrets management** tools in production (AWS Secrets Manager, etc.)
6. **Monitor API usage** to avoid surprise bills
7. **Set up billing alerts** on all services

---

## 📞 Support Contacts

- **Razorpay**: support@razorpay.com
- **Twilio**: support@twilio.com
- **SendGrid**: support@sendgrid.com
- **OpenAI**: Via platform dashboard
- **AWS**: AWS Support Center

---

## 🔒 Security Notes

1. **Production Keys**: Store in secure vault (AWS Secrets Manager, HashiCorp Vault)
2. **Access Control**: Limit who can access production keys
3. **Audit Logs**: Track all API key usage
4. **Rate Limiting**: Implement on your side too
5. **Webhooks**: Validate signatures for security

---

**Last Updated**: 2025-09-18
**Total Services**: 15+
**Estimated Monthly Cost**: ₹10,000-50,000 (depends on usage)
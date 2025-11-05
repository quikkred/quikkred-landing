# Quikkred Frontend Testing Guide

## 🚀 Quick Start

The application is running at: **http://localhost:3000**

### Test Credentials
- **User Account**:
  - Email: `test@Quikkred.com`
  - Password: `Test@123`

- **Admin Account**:
  - Email: `admin@Quikkred.com`
  - Password: `Test@123`

---

## 📱 Frontend Pages to Test

### 1. **Homepage** (http://localhost:3000)
- ✅ Check hero section with loan calculator
- ✅ Test "Apply Now" button
- ✅ Verify all product cards
- ✅ Check language switcher (top right)
- ✅ Test responsive design on mobile view

### 2. **Login Page** (http://localhost:3000/login)
- ✅ Enter email: `test@Quikkred.com`
- ✅ Enter password: `Test@123`
- ✅ Click "Sign In"
- ✅ Should redirect to dashboard after successful login
- ✅ Test "Remember me" checkbox
- ✅ Test error handling with wrong credentials

### 3. **Dashboard** (http://localhost:3000/dashboard)
**After Login:**
- ✅ View loan overview cards
- ✅ Check active loans section
- ✅ Review recent transactions
- ✅ Test quick actions buttons
- ✅ Check notifications bell icon
- ✅ View credit score widget

### 4. **Apply for Loan** (http://localhost:3000/apply)
**Multi-step form:**
- **Step 1: Personal Details**
  - Full Name: `John Doe`
  - Email: `john@example.com`
  - Phone: `9876543210`
  - Date of Birth: `01/01/1990`
  - PAN: `ABCDE1234F`
  - Aadhaar: `123456789012`

- **Step 2: Employment Info**
  - Employment Type: `Salaried`
  - Company Name: `Tech Corp`
  - Designation: `Software Engineer`
  - Monthly Income: `75000`
  - Work Experience: `5` years

- **Step 3: Documents**
  - Upload test files for each document type

- **Step 4: Loan Details**
  - Loan Amount: `500000`
  - Purpose: `Personal Use`
  - Tenure: `24` months

- **Step 5: Review & Submit**
  - Review all information
  - Accept terms
  - Submit application

### 5. **Products Page** (http://localhost:3000/products)
- ✅ Browse loan products
- ✅ Click on each product card for details
- ✅ Test "Apply Now" on product pages
- ✅ Check eligibility calculators

### 6. **Profile Page** (http://localhost:3000/profile)
- ✅ View personal information
- ✅ Edit profile details
- ✅ Update contact information
- ✅ Save changes

### 7. **KYC Page** (http://localhost:3000/kyc)
- ✅ Complete multi-step KYC verification
- ✅ Upload identity documents
- ✅ Submit for verification

### 8. **Payments Page** (http://localhost:3000/payments)
- ✅ View EMI schedule
- ✅ Check payment history
- ✅ Test "Pay Now" button
- ✅ Set up auto-pay

### 9. **Notifications** (http://localhost:3000/notifications)
- ✅ View all notifications
- ✅ Filter by category
- ✅ Mark as read/unread
- ✅ Clear notifications

### 10. **Support Page** (http://localhost:3000/support)
- ✅ Create support ticket
- ✅ View FAQs
- ✅ Test live chat interface
- ✅ Search help articles

### 11. **Settings Page** (http://localhost:3000/settings)
- ✅ Update personal information
- ✅ Change password
- ✅ Configure notifications
- ✅ Select language preference
- ✅ Manage security settings

### 12. **Document Vault** (http://localhost:3000/documents)
- ✅ Upload documents
- ✅ View uploaded documents
- ✅ Filter by category
- ✅ Download documents
- ✅ Delete documents

### 13. **Reports Page** (http://localhost:3000/reports)
- ✅ View payment trends
- ✅ Check loan progress
- ✅ Download statements
- ✅ View analytics charts

### 14. **Referrals Page** (http://localhost:3000/referrals)
- ✅ View referral code
- ✅ Share referral link
- ✅ Track referral status
- ✅ Check rewards earned

### 15. **Track Application** (http://localhost:3000/track-application)
- ✅ Enter application ID
- ✅ View application status
- ✅ Check timeline progress
- ✅ View required documents

---

## 🧪 Testing Checklist

### Authentication Flow
- [ ] Login with valid credentials
- [ ] Logout functionality
- [ ] Session persistence
- [ ] Protected route access
- [ ] Error handling for invalid credentials

### Loan Application Flow
- [ ] Complete all form steps
- [ ] Form validation
- [ ] File upload functionality
- [ ] Progress saving between steps
- [ ] Final submission

### Payment Features
- [ ] View EMI details
- [ ] Payment history
- [ ] Download receipts
- [ ] Payment reminders

### User Experience
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark/Light theme toggle
- [ ] Language switching
- [ ] Loading states
- [ ] Error messages
- [ ] Success notifications

### API Integration (Currently using mock data)
- [ ] Login/Logout
- [ ] Profile updates
- [ ] Loan application submission
- [ ] Document upload
- [ ] Notifications

---

## 🔧 Known Issues

1. **Database Connection**: Currently using mock authentication due to Prisma/Turbopack caching issue
2. **Real API Calls**: Some API endpoints return mock data as fallback

---

## 💡 Testing Tips

1. **Browser DevTools**:
   - Open with F12
   - Check Console for errors
   - Use Network tab to monitor API calls
   - Test responsive design in device mode

2. **Test Different Scenarios**:
   - Valid inputs
   - Invalid inputs
   - Empty fields
   - Large files upload
   - Slow network (DevTools > Network > Slow 3G)

3. **Check LocalStorage**:
   - Auth token storage
   - User preferences
   - Application state

4. **Performance**:
   - Page load times
   - API response times
   - Animation smoothness

---

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Verify server is running: `http://localhost:3000`
3. Clear browser cache and cookies
4. Restart the development server

---

## ✅ Quick Test Flow

1. **Open** http://localhost:3000
2. **Click** "Login" in header
3. **Enter** credentials (test@Quikkred.com / Test@123)
4. **Explore** Dashboard
5. **Navigate** to different pages using sidebar
6. **Test** loan application flow
7. **Check** all features listed above

The application is fully functional with a complete UI. Enjoy testing! 🚀
# 🚀 Step-by-Step Deployment Guide

## ✅ Step 1: GitHub Repository Setup

### 1.1 Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Name it: `party-booking-app`
4. Make it **Public** (for free hosting)
5. Don't initialize with README (we already have one)
6. Click "Create repository"

### 1.2 Push Your Code
Run these commands in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/party-booking-app.git
git branch -M main
git push -u origin main
```

## 🗄️ Step 2: MongoDB Atlas Setup

### 2.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free"
3. Fill in your details and create account
4. Choose "Free" plan (M0)

### 2.2 Create Database Cluster
1. Click "Build a Database"
2. Choose "FREE" tier
3. Select your preferred cloud provider (AWS/Google Cloud/Azure)
4. Choose a region close to you
5. Click "Create"

### 2.3 Set Up Database Access
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Username: `partybooking`
4. Password: Create a strong password
5. Role: "Read and write to any database"
6. Click "Add User"

### 2.4 Set Up Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 2.5 Get Connection String
1. Go back to "Database" in left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<dbname>` with `partybooking`

**Your connection string will look like:**
```
mongodb+srv://partybooking:yourpassword@cluster0.xxxxx.mongodb.net/partybooking?retryWrites=true&w=majority
```

## 💳 Step 3: Stripe Setup

### 3.1 Create Stripe Account
1. Go to [Stripe.com](https://stripe.com)
2. Click "Start now"
3. Fill in your business details
4. Complete account verification

### 3.2 Get API Keys
1. Go to Stripe Dashboard
2. Click "Developers" in left sidebar
3. Click "API keys"
4. Copy your **Publishable key** (starts with `pk_test_`)
5. Copy your **Secret key** (starts with `sk_test_`)

## 🖥️ Step 4: Backend Deployment (Render)

### 4.1 Create Render Account
1. Go to [Render.com](https://render.com)
2. Click "Get Started"
3. Sign up with your GitHub account

### 4.2 Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `party-booking-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 4.3 Set Environment Variables
In Render dashboard, go to Environment → Environment Variables:

```env
PORT=10000
MONGO_URI=mongodb+srv://partybooking:yourpassword@cluster0.xxxxx.mongodb.net/partybooking?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 4.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment (2-3 minutes)
3. Copy your backend URL (e.g., `https://your-app.onrender.com`)

## 🎨 Step 5: Frontend Deployment (Vercel)

### 5.1 Create Vercel Account
1. Go to [Vercel.com](https://vercel.com)
2. Click "Continue with GitHub"
3. Authorize Vercel

### 5.2 Update Frontend Configuration
Before deploying, update your frontend to use the backend URL:

1. Open `frontend/src/App.js`
2. Find the Stripe configuration
3. Update it with your actual Stripe publishable key:

```javascript
const stripePromise = loadStripe('pk_test_your_actual_stripe_publishable_key');
```

### 5.3 Deploy Frontend
1. Click "New Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 5.4 Set Environment Variables (Optional)
In Vercel dashboard, go to Settings → Environment Variables:

```env
REACT_APP_API_URL=https://your-app.onrender.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 5.5 Deploy
1. Click "Deploy"
2. Wait for deployment (1-2 minutes)
3. Your app will be live at `https://your-app.vercel.app`

## 🔧 Step 6: Post-Deployment Setup

### 6.1 Create Admin Account
Use your backend API to create the first admin account:

```bash
curl -X POST https://your-app.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### 6.2 Test Your Application
1. **Frontend**: Visit your Vercel URL
2. **Backend**: Test API endpoints
3. **Payments**: Use Stripe test cards
4. **Admin**: Login at `/admin`

## 🧪 Step 7: Testing Checklist

### ✅ Frontend Testing
- [ ] Homepage loads correctly
- [ ] Hall listing displays
- [ ] Hall details page works
- [ ] Booking form functions
- [ ] Payment integration works
- [ ] Admin login works
- [ ] Admin dashboard functions

### ✅ Backend Testing
- [ ] API endpoints respond
- [ ] Database connection works
- [ ] Authentication functions
- [ ] Payment processing works

### ✅ Payment Testing
- [ ] Test successful payment
- [ ] Test failed payment
- [ ] Test payment confirmation
- [ ] Verify booking creation

## 🎉 Success!

Your Birthday Party Hall Booking App is now live!

**Frontend URL**: `https://your-app.vercel.app`
**Backend URL**: `https://your-app.onrender.com`
**Admin Panel**: `https://your-app.vercel.app/admin`

---

**Happy Deploying! 🚀** 
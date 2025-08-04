# 🚀 Deployment Guide - Birthday Party Hall Booking App

This guide will help you deploy your Birthday Party Hall Booking App to production using free hosting services.

## 📋 Prerequisites

1. **GitHub Account** - For code hosting
2. **Stripe Account** - For payment processing
3. **MongoDB Atlas Account** - For database hosting
4. **Vercel Account** - For frontend hosting
5. **Render Account** - For backend hosting

## 🗄️ Step 1: Database Setup (MongoDB Atlas)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (Free tier)
4. Set up database access (username/password)
5. Set up network access (Allow all IPs: 0.0.0.0/0)

### 1.2 Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password
5. Replace `<dbname>` with `partybooking`

**Example:**
```
mongodb+srv://username:password@cluster.mongodb.net/partybooking?retryWrites=true&w=majority
```

## 💳 Step 2: Payment Setup (Stripe)

### 2.1 Create Stripe Account
1. Go to [Stripe.com](https://stripe.com)
2. Sign up for a free account
3. Complete account verification

### 2.2 Get API Keys
1. Go to Stripe Dashboard → Developers → API Keys
2. Copy your **Publishable Key** (starts with `pk_test_`)
3. Copy your **Secret Key** (starts with `sk_test_`)

## 🖥️ Step 3: Backend Deployment (Render)

### 3.1 Prepare Backend Code
1. Push your code to GitHub
2. Ensure your backend folder structure is correct
3. Verify `package.json` has correct scripts

### 3.2 Deploy to Render
1. Go to [Render.com](https://render.com)
2. Sign up with your GitHub account
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: `party-booking-backend`
   - **Root Directory**: `backend` (if your backend is in a subfolder)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 3.3 Set Environment Variables
In Render dashboard, go to Environment → Environment Variables:

```env
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/partybooking?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 3.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Copy your backend URL (e.g., `https://your-app.onrender.com`)

## 🎨 Step 4: Frontend Deployment (Vercel)

### 4.1 Update Frontend Configuration
1. Update `frontend/src/App.js` with your backend URL:

```javascript
// Replace localhost:5000 with your Render backend URL
const API_BASE_URL = 'https://your-app.onrender.com';
```

2. Update Stripe publishable key in `frontend/src/App.js`:

```javascript
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here');
```

### 4.2 Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend` (if your frontend is in a subfolder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 4.3 Set Environment Variables (Optional)
In Vercel dashboard, go to Settings → Environment Variables:

```env
REACT_APP_API_URL=https://your-app.onrender.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### 4.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be live at `https://your-app.vercel.app`

## 🔧 Step 5: Post-Deployment Setup

### 5.1 Create Admin Account
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

### 5.2 Test the Application
1. **Frontend**: Visit your Vercel URL
2. **Backend**: Test API endpoints
3. **Payments**: Use Stripe test cards
4. **Admin**: Login at `/admin`

## 🧪 Step 6: Testing Checklist

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
- [ ] File uploads work (if applicable)

### ✅ Payment Testing
- [ ] Test successful payment
- [ ] Test failed payment
- [ ] Test payment confirmation
- [ ] Verify booking creation

## 🔒 Step 7: Security & Production

### 7.1 Environment Variables
- ✅ Use strong JWT secrets
- ✅ Keep Stripe keys secure
- ✅ Use production MongoDB cluster

### 7.2 SSL/HTTPS
- ✅ Vercel provides SSL automatically
- ✅ Render provides SSL automatically
- ✅ MongoDB Atlas uses SSL

### 7.3 Monitoring
- Set up error monitoring (Sentry, LogRocket)
- Monitor API response times
- Track payment success rates

## 🚨 Troubleshooting

### Common Issues

**1. CORS Errors**
- Ensure backend CORS is configured for your frontend domain
- Check environment variables are set correctly

**2. Database Connection Issues**
- Verify MongoDB Atlas network access
- Check connection string format
- Ensure database user has correct permissions

**3. Payment Issues**
- Verify Stripe keys are correct
- Check webhook endpoints (if using)
- Test with Stripe test cards

**4. Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for syntax errors in code

### Getting Help
1. Check deployment logs in Vercel/Render
2. Verify environment variables
3. Test API endpoints with Postman
4. Check browser console for frontend errors

## 🎉 Success!

Your Birthday Party Hall Booking App is now live! 

**Frontend URL**: `https://your-app.vercel.app`
**Backend URL**: `https://your-app.onrender.com`
**Admin Panel**: `https://your-app.vercel.app/admin`

---

**Happy Deploying! 🚀** 
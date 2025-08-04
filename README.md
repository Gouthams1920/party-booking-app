# 🎉 Birthday Party Hall Booking App

A full-stack web application for booking party halls with online payment integration.

## ✨ Features

### 👤 User Features
- **Browse Party Halls**: View available halls with images, details, and pricing
- **Book Halls**: Select date, time, and make online payments via Stripe
- **Booking Confirmation**: Receive detailed booking confirmations with email receipts
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### 🛠️ Admin Features
- **Secure Admin Login**: JWT-based authentication for admin access
- **Hall Management**: Add, edit, and delete party halls
- **Booking Dashboard**: View all bookings with detailed information
- **Revenue Tracking**: Monitor total bookings and revenue

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React.js, React Router, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **Authentication** | JWT (JSON Web Tokens) |
| **Payments** | Stripe Integration |
| **Styling** | CSS3 with responsive design |
| **Icons** | React Icons |

## 📦 Project Structure

```
party-app/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Hall.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── halls.js
│   │   └── bookings.js
│   ├── middleware/
│   │   └── auth.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   └── Footer.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── HallDetail.js
│   │   │   ├── BookingForm.js
│   │   │   ├── BookingSuccess.js
│   │   │   ├── AdminLogin.js
│   │   │   └── AdminDashboard.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Stripe account for payments

### 1. Clone the Repository
```bash
git clone <repository-url>
cd party-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/partybooking
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

Start the backend server:
```bash
npm start
# or for development
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Update the Stripe publishable key in `src/App.js`:
```javascript
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here');
```

Start the frontend development server:
```bash
npm start
```

### 4. Database Setup
The app will automatically create the necessary collections. For initial admin setup, you can use the registration endpoint:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

## 🔧 Configuration

### MongoDB Setup
1. **Local MongoDB**: Install MongoDB locally and start the service
2. **MongoDB Atlas**: Create a free cluster and get your connection string

### Stripe Setup
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Update the environment variables with your keys

### Email Configuration (Optional)
For email notifications, configure your email service:
- Gmail: Use App Password
- Other providers: Update SMTP settings

## 📱 Usage

### For Users
1. **Browse Halls**: Visit the homepage to see available party halls
2. **View Details**: Click on any hall to see detailed information
3. **Make Booking**: Fill out the booking form with your details
4. **Payment**: Complete payment using Stripe
5. **Confirmation**: Receive booking confirmation and details

### For Admins
1. **Login**: Go to `/admin` and login with admin credentials
2. **Manage Halls**: Add, edit, or delete party halls
3. **View Bookings**: Check all bookings in the dashboard
4. **Monitor Revenue**: Track total bookings and revenue

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create admin account
- `GET /api/auth/profile` - Get user profile

### Halls
- `GET /api/halls` - Get all halls (public)
- `GET /api/halls/:id` - Get specific hall
- `POST /api/halls` - Create hall (admin only)
- `PUT /api/halls/:id` - Update hall (admin only)
- `DELETE /api/halls/:id` - Delete hall (admin only)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings (admin only)
- `PUT /api/bookings/:id` - Update booking status
- `POST /api/bookings/:id/confirm-payment` - Confirm payment

## 🎨 Customization

### Adding New Features
1. **New Hall Fields**: Update the Hall model in `backend/models/Hall.js`
2. **Custom Styling**: Modify CSS files in the frontend
3. **Additional Pages**: Add new routes in `frontend/src/App.js`

### Styling
- Global styles: `frontend/src/index.css`
- Component styles: Individual CSS files for each component
- Responsive design: Mobile-first approach with CSS Grid and Flexbox

## 🚀 Deployment

### Backend (Render/Heroku)
1. Push to Git repository
2. Connect to Render/Heroku
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy to Vercel or Netlify
3. Set environment variables

### Database
- **MongoDB Atlas**: Recommended for production
- **Local MongoDB**: For development

## 🔒 Security Features

- **JWT Authentication**: Secure admin access
- **Password Hashing**: bcrypt for password security
- **CORS Protection**: Configured for cross-origin requests
- **Input Validation**: Server-side validation for all inputs
- **Payment Security**: Stripe handles secure payment processing

## 🧪 Testing

### Manual Testing
1. **User Flow**: Browse halls → Book → Pay → Confirm
2. **Admin Flow**: Login → Manage halls → View bookings
3. **Payment Testing**: Use Stripe test cards

### API Testing
Use the provided Postman collection or test with curl commands.

## 📞 Support

For issues and questions:
1. Check the console for error messages
2. Verify environment variables are set correctly
3. Ensure MongoDB is running
4. Check Stripe API keys are valid

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Coding! 🎉**

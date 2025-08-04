# 💳 Stripe Integration Guide

This document provides detailed instructions for setting up and using Stripe payment integration in the Birthday Party Hall Booking App.

## 🔧 Setup Instructions

### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete your business profile
3. Navigate to the Dashboard

### 2. Get API Keys
1. In the Stripe Dashboard, go to **Developers** → **API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)
3. Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 3. Configure Environment Variables

#### Backend (.env file)
```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

#### Frontend (App.js)
```javascript
const stripePromise = loadStripe('pk_test_your_publishable_key_here');
```

## 🔄 Payment Flow

### 1. Create Payment Intent
When a user submits a booking, the backend creates a Stripe Payment Intent:

```javascript
// Backend: routes/bookings.js
const paymentIntent = await stripe.paymentIntents.create({
  amount: totalAmount * 100, // Convert to cents
  currency: 'usd',
  metadata: {
    hallId: hallId,
    customerName: customerName,
    customerEmail: customerEmail
  }
});
```

### 2. Frontend Payment Processing
The frontend uses Stripe Elements to collect payment information:

```javascript
// Frontend: pages/BookingForm.js
const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: elements.getElement(CardElement),
    billing_details: {
      name: formData.customerName,
      email: formData.customerEmail
    }
  }
});
```

### 3. Payment Confirmation
After successful payment, the backend confirms the payment:

```javascript
// Backend: routes/bookings.js
const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
if (paymentIntent.status === 'succeeded') {
  booking.paymentStatus = 'completed';
  await booking.save();
}
```

## 🧪 Testing

### Test Card Numbers
Use these test card numbers for testing:

| Card Type | Number | Expiry | CVC |
|-----------|--------|--------|-----|
| Visa | 4242424242424242 | Any future date | Any 3 digits |
| Mastercard | 5555555555554444 | Any future date | Any 3 digits |
| American Express | 378282246310005 | Any future date | Any 4 digits |

### Test Scenarios
1. **Successful Payment**: Use any valid test card
2. **Declined Payment**: Use `4000000000000002`
3. **Insufficient Funds**: Use `4000000000009995`
4. **Expired Card**: Use `4000000000000069`

## 🔒 Security Best Practices

### 1. Never Expose Secret Keys
- Keep secret keys only on the backend
- Use environment variables
- Never commit keys to version control

### 2. Validate Payment Amounts
```javascript
// Always validate amounts on the backend
if (amount <= 0 || amount > MAX_AMOUNT) {
  throw new Error('Invalid amount');
}
```

### 3. Use Webhooks (Production)
For production, implement Stripe webhooks to handle payment events:

```javascript
// Backend: webhooks/stripe.js
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Handle successful payment
      break;
    case 'payment_intent.payment_failed':
      // Handle failed payment
      break;
  }
});
```

## 📊 Payment Tracking

### Booking Model Fields
```javascript
{
  paymentStatus: 'pending' | 'completed' | 'failed',
  paymentId: String,
  stripePaymentIntentId: String,
  totalAmount: Number
}
```

### Admin Dashboard
The admin dashboard shows:
- Payment status for each booking
- Total revenue
- Payment IDs for reference

## 🚀 Production Deployment

### 1. Switch to Live Keys
- Replace test keys with live keys
- Update environment variables
- Test thoroughly with small amounts

### 2. Enable Webhooks
1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Add endpoint: `https://yourdomain.com/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`

### 3. SSL Certificate
- Ensure your domain has SSL certificate
- Stripe requires HTTPS for live payments

## 🔧 Customization

### Currency
To change currency, update the payment intent creation:

```javascript
const paymentIntent = await stripe.paymentIntents.create({
  amount: totalAmount * 100,
  currency: 'eur', // Change to desired currency
  // ... other options
});
```

### Payment Methods
Add additional payment methods:

```javascript
// Frontend: Add payment method options
<PaymentElement options={{
  paymentMethodOrder: ['card', 'apple_pay', 'google_pay']
}} />
```

### Custom Styling
Style the payment form:

```javascript
// Frontend: Customize Stripe Elements
<CardElement
  options={{
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }}
/>
```

## 🐛 Troubleshooting

### Common Issues

1. **Payment Declined**
   - Check card details
   - Verify sufficient funds
   - Check card expiration

2. **CORS Errors**
   - Ensure backend CORS is configured
   - Check frontend proxy settings

3. **Invalid Amount**
   - Verify amount is in cents
   - Check for decimal precision issues

4. **Webhook Failures**
   - Verify webhook endpoint URL
   - Check webhook signature verification
   - Ensure HTTPS in production

### Debug Mode
Enable Stripe debug mode:

```javascript
// Backend
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
});
```

## 📞 Support

- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Stripe Support**: Available in your Stripe Dashboard
- **Test Mode**: Use test keys for development
- **Live Mode**: Switch to live keys for production

## 🔄 Webhook Events

### Important Events
- `payment_intent.succeeded`: Payment completed successfully
- `payment_intent.payment_failed`: Payment failed
- `payment_intent.canceled`: Payment was canceled
- `customer.subscription.created`: Subscription created (if using subscriptions)

### Webhook Implementation
```javascript
// Backend: webhooks/stripe.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Update booking status
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});
```

---

**Note**: Always test thoroughly in Stripe's test mode before going live with real payments.

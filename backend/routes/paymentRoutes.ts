// backend/routes/paymentRoutes.ts
import express from 'express';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = express.Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

// Initialize Razorpay with server-side env vars
const razorpay = new Razorpay({
  key_id: process.env.RAZOR_PAY_KEY_ID!,
  key_secret: process.env.RAZOR_PAY_SECRET_KEY!,
});

// Create Stripe Payment Intent
router.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({ amount, currency });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create Razorpay Order
router.post('/create-razorpay-order', async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount, // in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    });
    console.log('Created Razorpay order:', order); // Debug log
    res.json({ order_id: order.id }); // Ensure this is "order_id"
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify Razorpay Payment
router.post('/verify-razorpay-payment', (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  const secret = process.env.RAZOR_PAY_SECRET_KEY!;

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  res.json({ success: generatedSignature === razorpay_signature });
});

export default router;
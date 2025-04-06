import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const StripePaymentForm = ({ onSuccess, amount, currency = 'usd' }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const cardElement = elements.getElement(CardElement);

    try {
      // Call backend to create a payment intent
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency }),
      });
      const { clientSecret } = await response.json();

      // Confirm payment with Stripe
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement! },
      });

      if (error) {
        setError(error.message || 'Payment failed');
        setProcessing(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess();
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-3 border rounded bg-white" />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded"
        disabled={processing || !stripe}
      >
        {processing ? 'Processing...' : 'Pay with Stripe'}
      </button>
    </form>
  );
};

export default StripePaymentForm;
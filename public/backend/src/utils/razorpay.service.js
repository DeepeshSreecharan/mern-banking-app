// Mock Razorpay Service (No real API calls)

// Simulate initiating a payment
const initiatePayment = async (amount, currency = 'INR') => {
  try {
    const orderId = 'order_test_' + Math.random().toString(36).substring(2, 10);

    return {
      id: orderId,
      amount: amount * 100, // mimic paise conversion
      currency,
      receipt: 'receipt_' + Date.now(),
      status: 'created',
    };
  } catch (error) {
    throw new Error('Payment initiation failed: ' + error.message);
  }
};

// Simulate verifying a payment (always returns true for demo)
const verifyPayment = (orderId, paymentId, signature) => {
  try {
    return true; // always success in mock mode
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};

// Simulate fetching payment details
const getPaymentDetails = async (paymentId) => {
  try {
    return {
      id: paymentId || 'pay_test_' + Math.random().toString(36).substring(2, 10),
      amount: 50000,
      currency: 'INR',
      status: 'captured',
      method: 'card',
      description: 'Mock payment for demo project',
      created_at: new Date().toISOString(),
    };
  } catch (error) {
    throw new Error('Failed to fetch payment details: ' + error.message);
  }
};

// Simulate refunding a payment
const refundPayment = async (paymentId, amount = null) => {
  try {
    return {
      id: 'rfnd_test_' + Math.random().toString(36).substring(2, 10),
      payment_id: paymentId,
      amount: amount ? amount * 100 : 50000,
      currency: 'INR',
      status: 'processed',
      created_at: new Date().toISOString(),
    };
  } catch (error) {
    throw new Error('Refund failed: ' + error.message);
  }
};

module.exports = {
  initiatePayment,
  verifyPayment,
  getPaymentDetails,
  refundPayment,
};

const https = require('https');

const FAKEPAY_HOST = 'fakepayment.onrender.com';
const FAKEPAY_PATH = '/payments';

class CreditCardPaymentStrategy {
  async processPayment(paymentDetails) {
    // paymentDetails: { cardToken, amount, currency }
    // Simulate if in test/dev or if no cardToken provided (for easy testing)
    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development' || !paymentDetails.cardToken) {
      if (paymentDetails.cardToken && String(paymentDetails.cardToken).includes('fail')) {
        return { success: false, data: { message: 'Card declined (simulated)' } };
      }
      return { success: true, data: { transactionId: 'simulated_tx_' + Date.now() } };
    }
    const payload = JSON.stringify(paymentDetails);

    const options = {
      hostname: FAKEPAY_HOST,
      path: FAKEPAY_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve({ success: true, data: parsed });
            } else {
              resolve({ success: false, data: parsed });
            }
          } catch (err) {
            // If response is not valid JSON, treat as plain text error
            resolve({ success: false, data: { message: data || 'Payment failed' } });
          }
        });
      });
      req.on('error', (e) => reject(e));
      req.write(payload);
      req.end();
    });
  }
}

module.exports = CreditCardPaymentStrategy;

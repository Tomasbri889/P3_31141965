class PaymentStrategy {
  async processPayment(paymentDetails) {
    throw new Error('processPayment not implemented');
  }
}

module.exports = PaymentStrategy;

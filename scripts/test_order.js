(async () => {
  try {
    const url = 'http://localhost:3000/orders';
    const body = {
      items: [{ productId: 1, quantity: 1 }],
      paymentMethod: 'card',
      paymentDetails: { cardToken: 'tok_test' }
    };
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const text = await res.text();
    console.log('STATUS', res.status);
    console.log('BODY', text);
  } catch (e) {
    console.error('ERROR', e.message || e);
  }
})();

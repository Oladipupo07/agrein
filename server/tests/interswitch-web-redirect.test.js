// Automated Test Suite for Interswitch Web Redirect Integration
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const assert = require('assert');
const {
  initializeInterswitchPayment,
  verifyInterswitchPayment,
  INTERSWITCH_MERCHANT_CODE,
  INTERSWITCH_PAY_ITEM_ID
} = require('../utils/interswitch');
const { handlePaymentResponse } = require('../controllers/orderController');

async function runTests() {
  console.log('🧪 Starting Interswitch Web Redirect Integration Tests...\n');

  // Test 1: Payment Initialization Form Payload
  console.log('👉 Test 1: Validate initializeInterswitchPayment returns required Web Redirect fields');
  const sampleRef = `TEST-AGR-${Date.now()}`;
  const initResult = await initializeInterswitchPayment({
    email: 'buyer@example.com',
    amount: 1500, // ₦1,500
    reference: sampleRef,
    redirectUrl: 'http://localhost:5000/api/orders/payment-response',
    custName: 'Adeola Johnson',
    custId: 'user-123',
    payItemName: 'Grade-A Yellow Maize'
  });

  assert.strictEqual(initResult.status, true, 'Initialization status should be true');
  assert.ok(initResult.data, 'Initialization data must be present');
  
  const d = initResult.data;
  assert.ok(d.payment_url && d.payment_url.includes('collections/w/pay'), 'Payment URL must point to collections/w/pay');
  assert.strictEqual(d.merchant_code, INTERSWITCH_MERCHANT_CODE, 'Merchant code must match configuration');
  assert.strictEqual(d.pay_item_id, INTERSWITCH_PAY_ITEM_ID, 'Pay item ID must match configuration');
  assert.strictEqual(d.txn_ref, sampleRef, 'Transaction reference must match');
  assert.strictEqual(d.amount, 150000, 'Amount must be in kobo minor units (1500 * 100 = 150000)');
  assert.strictEqual(d.currency, 566, 'Currency code must be 566 (NGN)');
  assert.strictEqual(d.site_redirect_url, 'http://localhost:5000/api/orders/payment-response', 'Site redirect URL must match');
  assert.strictEqual(d.cust_email, 'buyer@example.com', 'Customer email must match');
  assert.strictEqual(d.cust_name, 'Adeola Johnson', 'Customer name must match');
  console.log('✅ Test 1 Passed: Web Redirect payload is properly formatted with all required fields.\n');

  // Test 2: Server-side Re-query Verification
  // The test environment has no real Interswitch credentials, so both v1 and
  // v2 requery calls will fail and verifyInterswitchPayment should return a
  // non-success response — never silently fake an approval.
  console.log('👉 Test 2: Validate verifyInterswitchPayment returns non-success when gateway is unreachable');
  const verifyResult = await verifyInterswitchPayment(sampleRef, 1500);
  assert.ok(verifyResult, 'Requery result must not be null');
  assert.ok(verifyResult.ResponseCode !== undefined, 'ResponseCode must be present in gateway response');
  assert.ok(typeof verifyResult.ResponseDescription === 'string', 'ResponseDescription must be a string');
  assert.notStrictEqual(verifyResult.ResponseCode, '00', 'Requery must NOT auto-approve when gateway is unreachable (LIVE safety guard)');
  console.log(`✅ Test 2 Passed: Requery refused to fake-approve (Returned ResponseCode: ${verifyResult.ResponseCode}, Desc: ${verifyResult.ResponseDescription}).\n`);

  // Test 3: Controller handlePaymentResponse with declined / unverified transaction
  console.log('👉 Test 3: Validate handlePaymentResponse with unapproved reference redirects to payment=failed');
  let redirectUrlTarget = null;
  const mockBrowserReq = {
    headers: { accept: 'text/html' },
    query: {},
    body: {
      txnref: sampleRef,
      amount: '150000',
      resp: 'Z25',
      desc: 'Transaction Not Found'
    }
  };
  const mockBrowserRes = {
    redirect(url) {
      redirectUrlTarget = url;
      return this;
    }
  };
  await handlePaymentResponse(mockBrowserReq, mockBrowserRes);
  assert.ok(redirectUrlTarget, 'Redirect URL target must be set');
  assert.ok(redirectUrlTarget.includes('payment=failed'), 'Unapproved transaction must redirect with payment=failed');
  assert.ok(redirectUrlTarget.includes(sampleRef), 'Redirect URL must contain txn_ref');
  console.log(`✅ Test 3 Passed: Unapproved transaction redirected to ${redirectUrlTarget}\n`);

  // Test 4: Controller handlePaymentResponse with JSON client request
  console.log('👉 Test 4: Validate handlePaymentResponse with JSON header');
  let jsonResponseData = null;
  let statusCode = 200;

  const mockJsonReq = {
    headers: { accept: 'application/json' },
    query: {},
    body: {
      txnref: sampleRef,
      amount: '150000',
      resp: 'Z25',
      desc: 'Declined'
    }
  };
  const mockJsonRes = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      jsonResponseData = data;
      return this;
    }
  };
  await handlePaymentResponse(mockJsonReq, mockJsonRes);
  assert.strictEqual(statusCode, 400, 'Unapproved transaction via JSON header should return HTTP 400');
  assert.strictEqual(jsonResponseData.status, 'failed', 'Status should be failed');
  console.log('✅ Test 4 Passed: JSON client received structured failure payload for unapproved ref.\n');

  console.log('🎉 All Interswitch Web Redirect tests completed successfully!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

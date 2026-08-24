const test = require('node:test');
const assert = require('node:assert/strict');
const authController = require('../controllers/authController');

function mockRes() {
  return {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return payload;
    }
  };
}

test('authController.updateProfile updates the logged-in user data', async () => {
  const registerRes = mockRes();
  await authController.register(
    {
      body: {
        fullName: 'Profile User',
        email: 'profile.user@example.com',
        phone: '08012345678',
        password: 'Password1!',
        role: 'BUYER'
      }
    },
    registerRes
  );

  assert.equal(registerRes.payload.success, true);

  const updateRes = mockRes();
  await authController.updateProfile(
    {
      user: { email: 'profile.user@example.com' },
      body: {
        fullName: 'Updated Profile User',
        phone: '09099999999',
        state: 'Lagos',
        lga: 'Ikeja',
        city: 'Ikeja',
        address: '12 Market Road',
        marketingConsent: true
      }
    },
    updateRes
  );

  assert.equal(updateRes.payload.success, true);
  assert.equal(updateRes.payload.user.full_name, 'Updated Profile User');
  assert.equal(updateRes.payload.user.phone_number, '09099999999');
  assert.equal(updateRes.payload.user.state, 'Lagos');
  assert.equal(updateRes.payload.user.address, '12 Market Road');
  assert.equal(updateRes.payload.user.marketing_consent, true);
});

test('authController.requestAccountDeletion starts the grace-period deletion flow', async () => {
  const registerRes = mockRes();
  await authController.register(
    {
      body: {
        fullName: 'Delete User',
        email: 'delete.user@example.com',
        phone: '08022222222',
        password: 'Password1!',
        role: 'FARMER'
      }
    },
    registerRes
  );

  const deleteRes = mockRes();
  await authController.requestAccountDeletion(
    {
      user: { email: 'delete.user@example.com' },
      body: { reason: 'I no longer need the account' }
    },
    deleteRes
  );

  assert.equal(deleteRes.payload.success, true);
  assert.equal(deleteRes.payload.daysRemaining, 14);
});

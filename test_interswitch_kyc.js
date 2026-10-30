const http = require('http');
const path = require('path');
const jwt = require('./server/node_modules/jsonwebtoken');
require('./server/node_modules/dotenv').config({ path: path.join(__dirname, '.env') });

const JWT_SECRET = process.env.JWT_SECRET;
const farmerToken = jwt.sign(
  { sub: 'usr-farmer-isw-test', email: 'farmer_isw@agrein.com', role: 'FARMER', full_name: 'Alhaji Bello Musa' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 5094,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
          ...(token ? { 'Authorization': 'Bearer ' + token } : {})
        }
      },
      res => {
        let resp = '';
        res.on('data', c => (resp += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(resp) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: resp });
          }
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  const app = await require('./server/index.js');
  const server = app.listen(5094, '127.0.0.1', async () => {
    try {
      console.log('1. Testing Interswitch KYC service status:');
      const stRes = await request('GET', '/api/kyc/status');
      console.log('Status code:', stRes.status, 'Provider:', stRes.data.provider);
      if (stRes.status !== 200 || !stRes.data.success) throw new Error('Status failed');

      console.log('\n2. Testing NIN validation with invalid length (should fail 422):');
      const invNinRes = await request('POST', '/api/kyc/verify-nin', { nin: '12345' });
      console.log('Invalid NIN response:', invNinRes.status, invNinRes.data.message);
      if (invNinRes.status !== 422) throw new Error('Expected 422 for invalid NIN');

      console.log('\n3. Testing valid 11-digit NIN verification with Interswitch NIMC gateway:');
      const ninRes = await request('POST', '/api/kyc/verify-nin', {
        nin: '12345678901',
        fullName: 'Ibrahim Bello Musa',
        dateOfBirth: '1985-04-12',
        phone: '08123456789'
      });
      console.log('NIN verify status:', ninRes.status, 'Verified:', ninRes.data.verified, 'Gateway:', ninRes.data.data?.gateway);
      if (ninRes.status !== 200 || !ninRes.data.verified) throw new Error('NIN verification failed');

      console.log('\n4. Testing CAC validation with invalid format:');
      const invCacRes = await request('POST', '/api/kyc/verify-cac', { cacNumber: 'RC' });
      console.log('Invalid CAC response:', invCacRes.status, invCacRes.data.message);
      if (invCacRes.status !== 422) throw new Error('Expected 422 for invalid CAC');

      console.log('\n5. Testing valid CAC verification with Interswitch Corporate Registry gateway:');
      const cacRes = await request('POST', '/api/kyc/verify-cac', {
        cacNumber: 'RC-1849204',
        companyName: 'Bello Agro Farms Nigeria Ltd.'
      });
      console.log('CAC verify status:', cacRes.status, 'Verified:', cacRes.data.verified, 'Gateway:', cacRes.data.data?.gateway);
      if (cacRes.status !== 200 || !cacRes.data.verified) throw new Error('CAC verification failed');

      console.log('\n6. Testing Farmer Onboarding submission with Interswitch NIN & CAC processing:');
      const obRes = await request(
        'POST',
        '/api/farmer/onboarding',
        {
          full_name: 'Ibrahim Bello Musa',
          phone_number: '08123456789',
          date_of_birth: '1985-04-12',
          gender: 'male',
          state: 'Oyo',
          lga: 'Saki West',
          address: 'Plot 4 Agro Layout, Saki',
          nin_number: '12345678901',
          farm_name: 'Bello Agro Farms Nigeria Ltd.',
          farm_state: 'Oyo',
          farm_lga: 'Saki West',
          farm_location: 'KM 14 Iseyin Road, Saki West',
          farm_size_acres: 15,
          farm_type: 'Crop',
          crops_produced: ['Maize', 'Soybeans'],
          years_experience: 8,
          cac_number: 'RC-1849204'
        },
        farmerToken
      );

      console.log('Onboarding status:', obRes.status);
      console.log('Onboarding response message:', obRes.data.message);
      console.log('Interswitch NIN verified:', obRes.data.interswitch?.nin_verified);
      console.log('Interswitch CAC verified:', obRes.data.interswitch?.cac_verified);

      if (obRes.status !== 200 || !obRes.data.interswitch?.nin_verified) {
        throw new Error('Farmer onboarding submission did not verify Interswitch data');
      }

      console.log('\n🎉 ALL 6 INTERSWITCH NIN & CAC KYC TESTS PASSED SUCCESSFULLY!');
      server.close(() => process.exit(0));
    } catch (err) {
      console.error('❌ Test failed:', err);
      server.close(() => process.exit(1));
    }
  });
}

runTests();


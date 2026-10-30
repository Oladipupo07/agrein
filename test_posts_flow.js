require('./server/node_modules/dotenv').config({ path: require('path').join(__dirname, '.env') });
const http = require('http');
const jwt = require('./server/node_modules/jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const farmerToken = jwt.sign(
  { sub: 'usr-farmer-test', email: 'farmer_test@agrein.com', role: 'FARMER', full_name: 'Test Farmer Musa' },
  JWT_SECRET,
  { expiresIn: '1h' }
);
const buyerToken = jwt.sign(
  { sub: 'usr-buyer-test', email: 'buyer_test@agrein.com', role: 'BUYER', full_name: 'Test Buyer Chioma' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 5095,
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
  const server = app.listen(5095, '127.0.0.1', async () => {
    try {
      console.log('1. Testing Buyer blocked from creating post:');
      const bRes = await request('POST', '/api/posts', { title: 'T', content: 'C' }, buyerToken);
      console.log('Buyer create status:', bRes.status, '(Expected 403)');
      if (bRes.status !== 403) throw new Error('Buyer was not blocked!');

      console.log('\n2. Testing Farmer creating post:');
      const fRes = await request(
        'POST',
        '/api/posts',
        {
          title: '🌾 100 Tons Fresh Cassava Harvest Ready in Ogun',
          content: 'High-starch white cassava freshly uprooted. Direct delivery available across Southwest.',
          category: 'Harvest Update',
          crop_tag: 'White Cassava',
          price_info: '₦32,000 / Ton',
          moq: '2 Tons',
          emoji: '🥔'
        },
        farmerToken
      );
      console.log('Farmer create status:', fRes.status, '(Expected 201)');
      const newPostId = fRes.data.post.id;
      console.log('New Post ID:', newPostId);

      console.log('\n3. Testing Buyer commenting on farmer post:');
      const cRes = await request(
        'POST',
        `/api/posts/${newPostId}/comments`,
        { text: 'Can you deliver 5 tons to Abeokuta?' },
        buyerToken
      );
      console.log('Comment status:', cRes.status, 'Comment text:', cRes.data.comment.text);
      if (cRes.status !== 200 && cRes.status !== 201) throw new Error('Comment failed');

      console.log('\n4. Testing Buyer leaving 5-star review:');
      const rRes = await request(
        'POST',
        `/api/posts/${newPostId}/reviews`,
        {
          rating: 5,
          title: 'Top-tier cassava quality',
          comment: 'Very low water content, high starch yield. Highly recommended farmer.'
        },
        buyerToken
      );
      console.log('Review status:', rRes.status, 'Review rating:', rRes.data.review.rating);
      if (rRes.status !== 200 && rRes.status !== 201) throw new Error('Review failed');

      console.log('\n5. Testing Buyer liking the post:');
      const lRes = await request('POST', `/api/posts/${newPostId}/like`, null, buyerToken);
      console.log('Like status:', lRes.status, 'Likes count:', lRes.data.likes_count, 'Liked:', lRes.data.liked);
      if (lRes.status !== 200 || !lRes.data.liked) throw new Error('Like failed');

      console.log('\n6. Testing Farmer deleting own post:');
      const dRes = await request('DELETE', `/api/posts/${newPostId}`, null, farmerToken);
      console.log('Delete status:', dRes.status, 'Message:', dRes.data.message);
      if (dRes.status !== 200) throw new Error('Delete failed');

      console.log('\n🎉 ALL 6 POST, COMMENT, REVIEW, LIKE & DELETE TESTS PASSED!');
      server.close(() => process.exit(0));
    } catch (err) {
      console.error('❌ Test failed:', err);
      server.close(() => process.exit(1));
    }
  });
}

runTests();

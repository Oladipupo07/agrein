// Agrein Seller Posts, Buyer Comments & Reviews Controller
const fs = require('fs');
const path = require('path');
const { getSupabaseAdmin } = require('../utils/supabaseClient');

const POSTS_FILE = path.join(__dirname, '../../data/posts.json');

// Initial seed posts so the feed has realistic community content right away
const INITIAL_POSTS = [
  {
    id: 'post_1001',
    seller_id: 'usr-admin-bello',
    seller_name: 'Ibrahim Bello Musa',
    farm_name: 'Bello Agro Farms Nigeria Ltd.',
    seller_location: 'Oyo • Saki West',
    seller_verified: true,
    title: '🌾 Fresh Harvest Alert: 500 Bags of Grade-A Yellow Maize Ready for Dispatch!',
    content: 'We just concluded mechanical shelling of our late-season yellow maize in Saki West. Tested moisture level is 12.5% (optimal for long storage and poultry feed milling). Zero stone, winnowed and pre-bagged in clean 100kg Agrein-branded sacks. All bulk orders dispatched with traceable escrow protection.',
    category: 'Harvest Update',
    crop_tag: 'Yellow Maize',
    price_info: '₦42,000 / 100kg Bag',
    moq: '5 Bags',
    emoji: '🌽',
    likes_count: 18,
    liked_by: ['buyer1@example.com'],
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    comments: [
      {
        id: 'cmt_1',
        author_id: 'usr-buyer-fatima',
        author_name: 'Fatima Aliyu',
        author_role: 'BUYER',
        author_location: 'Lagos • Ikeja',
        text: 'Hello Alhaji Bello, can you deliver 25 bags directly to our feed store in Ikeja, Lagos?',
        created_at: new Date(Date.now() - 3600000 * 6).toISOString()
      },
      {
        id: 'cmt_2',
        author_id: 'usr-admin-bello',
        author_name: 'Ibrahim Bello Musa',
        author_role: 'FARMER',
        author_location: 'Oyo • Saki West',
        text: 'Yes Madam Fatima! Delivery to Lagos takes 24 to 36 hours via our verified logistics partner. You can lock order in escrow right now.',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString()
      }
    ],
    reviews: [
      {
        id: 'rev_1',
        buyer_id: 'usr-buyer-emeka',
        buyer_name: 'Emeka Okafor',
        buyer_location: 'Abuja • Gwagwalada',
        rating: 5,
        review_title: 'Exceptional dry grain quality and prompt delivery',
        comment: 'Received 10 bags in Abuja. Grain was bone dry, no weevils or dust. The escrow release mechanism gave our business 100% security.',
        verified_purchase: true,
        created_at: new Date(Date.now() - 3600000 * 12).toISOString()
      }
    ]
  },
  {
    id: 'post_1002',
    seller_id: 'usr-farmer-benue',
    seller_name: 'Terungwa Akume',
    farm_name: 'Benue Green Valley Farms',
    seller_location: 'Benue • Gboko',
    seller_verified: true,
    title: '🍠 Premium White Yam Tubers (Pona Variety) Harvested This Week!',
    content: 'Huge tubers fresh from the fertile Benue riverbank soils. Ideal for wholesale food caterers, hotels, and retail markets. Pona variety with sweet fluffy texture. Hand-sorted to ensure zero rotten tubers.',
    category: 'Harvest Update',
    crop_tag: 'White Yam',
    price_info: '₦18,000 / Set of 10 Tubers',
    moq: '2 Sets',
    emoji: '🍠',
    likes_count: 24,
    liked_by: [],
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    comments: [
      {
        id: 'cmt_3',
        author_id: 'usr-buyer-chidi',
        author_name: 'Chef Chidi Martins',
        author_role: 'BUYER',
        author_location: 'Rivers • Port Harcourt',
        text: 'Are these tubers suitable for pounded yam in our commercial restaurant kitchen?',
        created_at: new Date(Date.now() - 3600000 * 10).toISOString()
      },
      {
        id: 'cmt_4',
        author_id: 'usr-farmer-benue',
        author_name: 'Terungwa Akume',
        author_role: 'FARMER',
        author_location: 'Benue • Gboko',
        text: 'Absolutely! Pona yams are renowned for their high starch and smooth pounding texture.',
        created_at: new Date(Date.now() - 3600000 * 8).toISOString()
      }
    ],
    reviews: [
      {
        id: 'rev_2',
        buyer_id: 'usr-buyer-zainab',
        buyer_name: 'Zainab Balogun',
        buyer_location: 'Lagos • Surulere',
        rating: 5,
        review_title: 'Very big sweet tubers!',
        comment: 'Ordered 5 sets for household and extended family. Clean tubers, delicious taste. Will order again next month.',
        verified_purchase: true,
        created_at: new Date(Date.now() - 3600000 * 14).toISOString()
      }
    ]
  },
  {
    id: 'post_1003',
    seller_id: 'usr-farmer-edo',
    seller_name: 'Osasere Obaseki',
    farm_name: 'Edo Palm Plantation Cooperative',
    seller_location: 'Edo • Ovia North-East',
    seller_verified: true,
    title: '🛢️ 100% Unadulterated Pure Grade-A Red Palm Oil - Fresh Press',
    content: 'Cold-settled, zero water or artificial color additives. Passed NAFDAC farmgate inspection. Rich red beta-carotene clarity with traditional aromatic scent. Packaged in brand-new sealed food-grade 25L jerrycans.',
    category: 'Bulk Offer',
    crop_tag: 'Red Palm Oil',
    price_info: '₦35,000 / 25L Jerrycan',
    moq: '1 Jerrycan',
    emoji: '🛢️',
    likes_count: 31,
    liked_by: [],
    created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    comments: [],
    reviews: [
      {
        id: 'rev_3',
        buyer_id: 'usr-buyer-bisi',
        buyer_name: 'Bisi Adeleke',
        buyer_location: 'Oyo • Ibadan',
        rating: 5,
        review_title: 'Authentic palm oil from Edo',
        comment: 'Hard to find authentic unadulterated palm oil nowadays. This is pure quality. Fried plantain and soups taste wonderful.',
        verified_purchase: true,
        created_at: new Date(Date.now() - 3600000 * 20).toISOString()
      }
    ]
  }
];

function loadPosts() {
  try {
    if (!fs.existsSync(POSTS_FILE)) {
      const dataDir = path.dirname(POSTS_FILE);
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      fs.writeFileSync(POSTS_FILE, JSON.stringify(INITIAL_POSTS, null, 2), 'utf8');
      return INITIAL_POSTS;
    }
    const raw = fs.readFileSync(POSTS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_POSTS;
  } catch (err) {
    console.warn('[postController] loadPosts fallback:', err.message);
    return INITIAL_POSTS;
  }
}

function savePosts(posts) {
  try {
    const dataDir = path.dirname(POSTS_FILE);
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[postController] savePosts error:', err.message);
    return false;
  }
}

const postController = {
  // GET /api/posts - Fetch all posts with comments and reviews
  async getAllPosts(req, res) {
    try {
      const { seller_id, crop, category, q } = req.query;
      let posts = loadPosts();

      if (seller_id) {
        posts = posts.filter(p => p.seller_id === seller_id);
      }
      if (category && category !== 'ALL') {
        posts = posts.filter(p => p.category?.toUpperCase() === category.toUpperCase());
      }
      if (crop) {
        posts = posts.filter(p => p.crop_tag?.toLowerCase().includes(crop.toLowerCase()));
      }
      if (q) {
        const query = q.toLowerCase();
        posts = posts.filter(p =>
          (p.title && p.title.toLowerCase().includes(query)) ||
          (p.content && p.content.toLowerCase().includes(query)) ||
          (p.crop_tag && p.crop_tag.toLowerCase().includes(query)) ||
          (p.seller_name && p.seller_name.toLowerCase().includes(query)) ||
          (p.farm_name && p.farm_name.toLowerCase().includes(query)) ||
          (p.seller_location && p.seller_location.toLowerCase().includes(query))
        );
      }

      // Compute average rating for each post
      posts.forEach(p => {
        const revs = p.reviews || [];
        if (revs.length > 0) {
          const sum = revs.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
          p.avg_rating = Number((sum / revs.length).toFixed(1));
          p.reviews_count = revs.length;
        } else {
          p.avg_rating = 5.0;
          p.reviews_count = 0;
        }
        p.comments_count = (p.comments || []).length;
      });

      // Sort newest first
      posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      res.json({
        success: true,
        total: posts.length,
        posts
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /api/posts - Seller publishes a new farm post/update
  async createPost(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const role = (user.role || '').toUpperCase();
      if (role !== 'FARMER' && role !== 'SELLER' && role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Only sellers and farmers can publish harvest updates.' });
      }

      const { title, content, category, crop_tag, price_info, moq, emoji } = req.body;
      if (!title || !content) {
        return res.status(400).json({ success: false, message: 'Post title and description are required.' });
      }

      // Look up seller profile details from Supabase or cached user
      let sellerName = user.full_name || user.email;
      let farmName = user.farm_name || 'Agrein Farm Producer';
      let sellerLocation = (user.state && user.lga) ? `${user.state} • ${user.lga}` : (user.state || 'Nigeria');
      let isVerified = user.verificationStatus === 'APPROVED' || user.is_verified;

      const sb = getSupabaseAdmin();
      if (sb && user.id) {
        try {
          const { data: prof } = await sb.from('profiles').select('full_name, state, lga, is_verified, verification_status').eq('id', user.id).maybeSingle();
          if (prof) {
            sellerName = prof.full_name || sellerName;
            sellerLocation = (prof.state && prof.lga) ? `${prof.state} • ${prof.lga}` : (prof.state || sellerLocation);
            isVerified = prof.is_verified || prof.verification_status === 'APPROVED';
          }
          const { data: farm } = await sb.from('farmer_profiles').select('farm_name, farm_state, farm_lga').eq('user_id', user.id).maybeSingle();
          if (farm && farm.farm_name) {
            farmName = farm.farm_name;
            if (farm.farm_state) sellerLocation = `${farm.farm_state} • ${farm.farm_lga || ''}`;
          }
        } catch (_) {}
      }

      const newPost = {
        id: 'post_' + Date.now(),
        seller_id: user.id || `usr-${Date.now()}`,
        seller_name: sellerName,
        farm_name: farmName,
        seller_location: sellerLocation,
        seller_verified: Boolean(isVerified),
        title: title.trim(),
        content: content.trim(),
        category: category || 'Harvest Update',
        crop_tag: crop_tag ? crop_tag.trim() : null,
        price_info: price_info ? price_info.trim() : null,
        moq: moq ? moq.trim() : null,
        emoji: emoji || '🌾',
        likes_count: 0,
        liked_by: [],
        comments: [],
        reviews: [],
        created_at: new Date().toISOString()
      };

      const posts = loadPosts();
      posts.unshift(newPost);
      savePosts(posts);

      res.status(201).json({
        success: true,
        message: 'Farm update published successfully to marketplace feed!',
        post: newPost
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /api/posts/:id/comments - Add a comment to a post
  async addComment(req, res) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ success: false, message: 'Authentication required.' });

      const { id } = req.params;
      const { text } = req.body;
      if (!text || !text.trim()) {
        return res.status(400).json({ success: false, message: 'Comment text is required.' });
      }

      const posts = loadPosts();
      const post = posts.find(p => p.id === id);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found.' });
      }

      if (!post.comments) post.comments = [];

      let authorName = user.full_name || user.email.split('@')[0];
      let authorLocation = (user.state && user.lga) ? `${user.state} • ${user.lga}` : (user.state || 'Nigeria');
      
      const sb = getSupabaseAdmin();
      if (sb && user.id) {
        try {
          const { data: prof } = await sb.from('profiles').select('full_name, state, lga').eq('id', user.id).maybeSingle();
          if (prof && prof.full_name) authorName = prof.full_name;
          if (prof && prof.state) authorLocation = `${prof.state} • ${prof.lga || ''}`;
        } catch (_) {}
      }

      const newComment = {
        id: 'cmt_' + Date.now(),
        author_id: user.id || user.email,
        author_name: authorName,
        author_role: (user.role || 'BUYER').toUpperCase(),
        author_location: authorLocation,
        text: text.trim(),
        created_at: new Date().toISOString()
      };

      post.comments.push(newComment);
      savePosts(posts);

      res.status(201).json({
        success: true,
        message: 'Comment added successfully.',
        comment: newComment
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /api/posts/:id/reviews - Buyer leaves a review & star rating
  async addReview(req, res) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ success: false, message: 'Authentication required.' });

      const { id } = req.params;
      const { rating, review_title, comment } = req.body;
      const numericRating = Math.max(1, Math.min(5, parseInt(rating) || 5));

      if (!comment || !comment.trim()) {
        return res.status(400).json({ success: false, message: 'Review details are required.' });
      }

      const posts = loadPosts();
      const post = posts.find(p => p.id === id);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found.' });
      }

      if (!post.reviews) post.reviews = [];

      let buyerName = user.full_name || user.email.split('@')[0];
      let buyerLocation = (user.state && user.lga) ? `${user.state} • ${user.lga}` : (user.state || 'Nigeria');

      const sb = getSupabaseAdmin();
      if (sb && user.id) {
        try {
          const { data: prof } = await sb.from('profiles').select('full_name, state, lga').eq('id', user.id).maybeSingle();
          if (prof && prof.full_name) buyerName = prof.full_name;
          if (prof && prof.state) buyerLocation = `${prof.state} • ${prof.lga || ''}`;
        } catch (_) {}
      }

      const newReview = {
        id: 'rev_' + Date.now(),
        buyer_id: user.id || user.email,
        buyer_name: buyerName,
        buyer_location: buyerLocation,
        rating: numericRating,
        review_title: review_title ? review_title.trim() : 'Verified Buyer Review',
        comment: comment.trim(),
        verified_purchase: true,
        created_at: new Date().toISOString()
      };

      post.reviews.unshift(newReview);
      savePosts(posts);

      res.status(201).json({
        success: true,
        message: '⭐ Thank you! Your review and rating have been published.',
        review: newReview
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /api/posts/:id/like - Toggle like on a post
  async toggleLike(req, res) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ success: false, message: 'Authentication required.' });

      const { id } = req.params;
      const posts = loadPosts();
      const post = posts.find(p => p.id === id);
      if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

      if (!post.liked_by) post.liked_by = [];
      const userKey = user.email || user.id;
      const index = post.liked_by.indexOf(userKey);

      let liked = false;
      if (index >= 0) {
        post.liked_by.splice(index, 1);
        post.likes_count = Math.max(0, (post.likes_count || 1) - 1);
      } else {
        post.liked_by.push(userKey);
        post.likes_count = (post.likes_count || 0) + 1;
        liked = true;
      }

      savePosts(posts);

      res.json({
        success: true,
        liked,
        likes_count: post.likes_count
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // DELETE /api/posts/:id - Delete post
  async deletePost(req, res) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ success: false, message: 'Authentication required.' });

      const { id } = req.params;
      let posts = loadPosts();
      const post = posts.find(p => p.id === id);
      if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

      // Owner or Admin
      const isOwner = post.seller_id === user.id || post.seller_name === user.full_name;
      const isAdmin = user.role === 'ADMIN';
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ success: false, message: 'You can only delete your own posts.' });
      }

      posts = posts.filter(p => p.id !== id);
      savePosts(posts);

      res.json({
        success: true,
        message: 'Post deleted successfully.'
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = postController;


import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';

// Environment variables
const useMock = !process.env.DATABASE_URL;

let pool: Pool | null = null;
if (!useMock) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('supabase') ? { rejectUnauthorized: false } : false
  });
}

// Memory database for fallback mode, pre-seeded
let users: any[] = [
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    email: 'admin@agrein.com',
    password_hash: bcrypt.hashSync('password123', 10),
    full_name: 'Chidi Egwu',
    phone_number: '+2348012345678',
    role: 'admin',
    status: 'active',
    avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=admin',
    created_at: new Date()
  },
  {
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    email: 'farmer.kole@agrein.com',
    password_hash: bcrypt.hashSync('password123', 10),
    full_name: 'Kole Adebayo',
    phone_number: '+2348023456789',
    role: 'farmer',
    status: 'active',
    avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=kole',
    created_at: new Date()
  },
  {
    id: 'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    email: 'farmer.fatima@agrein.com',
    password_hash: bcrypt.hashSync('password123', 10),
    full_name: 'Fatima Bello',
    phone_number: '+2348034567890',
    role: 'farmer',
    status: 'active',
    avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=fatima',
    created_at: new Date()
  },
  {
    id: 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    email: 'buyer.emeka@agrein.com',
    password_hash: bcrypt.hashSync('password123', 10),
    full_name: 'Emeka Okafor',
    phone_number: '+2348045678901',
    role: 'buyer',
    status: 'active',
    avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=emeka',
    created_at: new Date()
  },
  {
    id: 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
    email: 'delivery.tunde@agrein.com',
    password_hash: bcrypt.hashSync('password123', 10),
    full_name: 'Tunde Alao',
    phone_number: '+2348056789012',
    role: 'delivery_partner',
    status: 'active',
    avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=tunde',
    created_at: new Date()
  }
];

let categories: any[] = [
  { id: 1, name: 'Fruits', description: 'Fresh agricultural fruits straight from orchards.', image_url: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Vegetables', description: 'Organic and fresh vegetables grown by local farmers.', image_url: 'https://images.unsplash.com/photo-1566385101042-1a010c129fa6?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Grains', description: 'Rice, maize, beans, millet, and other stable grains.', image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Livestock', description: 'Cattle, sheep, goats, and pigs raised under standard conditions.', image_url: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=400' },
  { id: 5, name: 'Poultry', description: 'Fresh eggs, chickens, turkeys, and other domestic fowls.', image_url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=400' },
  { id: 6, name: 'Seafood', description: 'Fresh and smoked fish, shrimps, crabs, and other aquatic products.', image_url: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&q=80&w=400' },
  { id: 7, name: 'Dairy', description: 'Fresh milk, butter, cheese, and local wara.', image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400' },
  { id: 8, name: 'Cash Crops', description: 'Cocoa, oil palm, rubber, cotton, and cashews for domestic and export markets.', image_url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=400' }
];

let farmers: any[] = [
  {
    user_id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    farm_name: 'Green Horizon Farm',
    farm_address: 'Plot 45, Farm Settlement Road, Ikorodu',
    state: 'Lagos',
    verification_status: 'approved',
    payout_details: { bank_name: 'Access Bank', account_number: '0123456789', account_name: 'Kole Adebayo' },
    ratings: 4.8,
    balance: 150000.00,
    created_at: new Date()
  },
  {
    user_id: 'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    farm_name: 'Kano Grain Empire',
    farm_address: 'KM 12, Hadejia Road, Kano',
    state: 'Kano',
    verification_status: 'pending',
    payout_details: { bank_name: 'GTBank', account_number: '0987654321', account_name: 'Fatima Bello' },
    ratings: 0.0,
    balance: 0.00,
    created_at: new Date()
  }
];

let buyers: any[] = [
  {
    user_id: 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    delivery_address: 'Flat 4B, Pine Court, Lekki Phase 1',
    state: 'Lagos',
    balance: 50000.00,
    created_at: new Date()
  }
];

let products: any[] = [
  {
    id: 'p1eebc99-9c0b-4ef8-bb6d-6bb9bd380f11',
    farmer_id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    name: 'Local Stone-Free Rice (Ofada)',
    description: 'Premium quality local Ofada rice. Grown and processed in Ikorodu. Hand-sorted, 100% stone-free, rich in nutrients, and delicious.',
    category_id: 3,
    price: 25000.00,
    quantity: 50.00,
    quantity_unit: 'bags',
    availability_status: 'in_stock',
    delivery_estimate: '1-2 days',
    rating: 4.7,
    image_urls: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600'],
    created_at: new Date()
  },
  {
    id: 'p2eebc99-9c0b-4ef8-bb6d-6bb9bd380f22',
    farmer_id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    name: 'Fresh Roma Tomatoes (Crate)',
    description: 'A basket/crate of fresh, firm, and fully ripe red Roma tomatoes. Excellent for stews, sauces, and salads. Directly harvested on order day.',
    category_id: 2,
    price: 12000.00,
    quantity: 20.00,
    quantity_unit: 'crates',
    availability_status: 'in_stock',
    delivery_estimate: 'Same day',
    rating: 4.9,
    image_urls: ['https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600'],
    created_at: new Date()
  },
  {
    id: 'p3eebc99-9c0b-4ef8-bb6d-6bb9bd380f33',
    farmer_id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    name: 'Sweet Seedless Oranges (Bag)',
    description: 'Bag of naturally sweetened seedless oranges. Juicy and loaded with Vitamin C. Cleaned and packed.',
    category_id: 1,
    price: 8000.00,
    quantity: 35.00,
    quantity_unit: 'bags',
    availability_status: 'in_stock',
    delivery_estimate: '1-2 days',
    rating: 4.5,
    image_urls: ['https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=600'],
    created_at: new Date()
  },
  {
    id: 'p4eebc99-9c0b-4ef8-bb6d-6bb9bd380f44',
    farmer_id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    name: 'Healthy Male Goat (Medium)',
    description: 'Medium-sized healthy male goat. Vaccinated and pasture-fed. Weight approx. 20kg. Suitable for ceremonies or direct meat processing.',
    category_id: 4,
    price: 35000.00,
    quantity: 10.00,
    quantity_unit: 'pieces',
    availability_status: 'in_stock',
    delivery_estimate: '2-3 days',
    rating: 4.8,
    image_urls: ['https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&q=80&w=600'],
    created_at: new Date()
  }
];

let orders: any[] = [];
let orderItems: any[] = [];
let transactions: any[] = [
  {
    id: 't1eebc99-9c0b-4ef8-bb6d-6bb9bd380t11',
    order_id: null,
    user_id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    amount: 150000.00,
    transaction_type: 'payout',
    status: 'success',
    reference: 'PAY-INIT-101',
    created_at: new Date()
  }
];

let reviews: any[] = [
  {
    id: 'r1eebc99-9c0b-4ef8-bb6d-6bb9bd380e11',
    product_id: 'p2eebc99-9c0b-4ef8-bb6d-6bb9bd380f22',
    reviewer_id: 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    rating: 5,
    comment: 'Super fresh tomatoes! Will definitely buy again.',
    created_at: new Date()
  },
  {
    id: 'r2eebc99-9c0b-4ef8-bb6d-6bb9bd380e22',
    product_id: 'p1eebc99-9c0b-4ef8-bb6d-6bb9bd380f11',
    reviewer_id: 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    rating: 4,
    comment: 'Very clean rice. Found no stones at all. Good texture when cooked.',
    created_at: new Date()
  }
];

let notifications: any[] = [
  {
    id: 'n1eebc99-9c0b-4ef8-bb6d-6bb9bd380d11',
    user_id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    title: 'Welcome to Agrein!',
    message: 'Your farmer account has been approved. You can now start listing products and earning.',
    is_read: false,
    created_at: new Date()
  }
];

let deliveries: any[] = [];
let messages: any[] = [
  {
    id: 'm1',
    sender_id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', // Kole
    receiver_id: 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', // Emeka
    content: 'Hello Emeka, your tomatoes order will be shipped fresh tomorrow morning.',
    is_read: true,
    created_at: new Date(Date.now() - 3600000)
  },
  {
    id: 'm2',
    sender_id: 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', // Emeka
    receiver_id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', // Kole
    content: 'Perfect, thank you! Please make sure they are well packed.',
    is_read: false,
    created_at: new Date()
  }
];

// Helper to generate UUIDs in mock mode
const uuid = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// The DB query interface
export const db = {
  // Query wrapper
  async query(text: string, params: any[] = []): Promise<any> {
    if (!useMock && pool) {
      const res = await pool.query(text, params);
      return res;
    }
    
    // In mock mode, we intercept specific simple SQL statements or log queries
    console.log(`[MOCK DB] Query: ${text}`, params);
    return { rows: [] };
  },

  // Custom ORM methods for mock/real operation
  users: {
    async findById(id: string) {
      if (!useMock && pool) {
        const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return res.rows[0];
      }
      return users.find(u => u.id === id) || null;
    },

    async findByEmail(email: string) {
      if (!useMock && pool) {
        const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return res.rows[0];
      }
      return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    },

    async create(email: string, passwordHash: string, fullName: string, phoneNumber: string, role: string) {
      const id = uuid();
      const newUser = {
        id,
        email,
        password_hash: passwordHash,
        full_name: fullName,
        phone_number: phoneNumber,
        role,
        status: 'active',
        avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(fullName)}`,
        created_at: new Date(),
        updated_at: new Date()
      };

      if (!useMock && pool) {
        await pool.query(
          'INSERT INTO users (id, email, password_hash, full_name, phone_number, role) VALUES ($1, $2, $3, $4, $5, $6)',
          [id, email, passwordHash, fullName, phoneNumber, role]
        );
        return newUser;
      }

      users.push(newUser);
      return newUser;
    },

    async update(id: string, updates: any) {
      if (!useMock && pool) {
        const keys = Object.keys(updates);
        const values = Object.values(updates);
        const setString = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
        const queryText = `UPDATE users SET ${setString}, updated_at = NOW() WHERE id = $1 RETURNING *`;
        const res = await pool.query(queryText, [id, ...values]);
        return res.rows[0];
      }

      const user = users.find(u => u.id === id);
      if (user) {
        Object.assign(user, updates, { updated_at: new Date() });
      }
      return user;
    },

    async listAll() {
      if (!useMock && pool) {
        const res = await pool.query('SELECT id, email, full_name, phone_number, role, status, avatar_url, created_at FROM users');
        return res.rows;
      }
      return users.map(u => ({
        id: u.id,
        email: u.email,
        full_name: u.full_name,
        phone_number: u.phone_number,
        role: u.role,
        status: u.status,
        avatar_url: u.avatar_url,
        created_at: u.created_at
      }));
    }
  },

  farmers: {
    async findById(userId: string) {
      if (!useMock && pool) {
        const res = await pool.query(
          'SELECT f.*, u.full_name, u.email, u.phone_number, u.avatar_url FROM farmers f JOIN users u ON f.user_id = u.id WHERE f.user_id = $1',
          [userId]
        );
        return res.rows[0];
      }
      const farmer = farmers.find(f => f.user_id === userId);
      const user = users.find(u => u.id === userId);
      if (!farmer || !user) return null;
      return { ...farmer, full_name: user.full_name, email: user.email, phone_number: user.phone_number, avatar_url: user.avatar_url };
    },

    async create(userId: string, farmName: string, farmAddress: string, state: string, payoutDetails: any) {
      const newFarmer = {
        user_id: userId,
        farm_name: farmName,
        farm_address: farmAddress,
        state,
        verification_status: 'pending',
        payout_details: payoutDetails || {},
        ratings: 0.0,
        balance: 0.00,
        created_at: new Date()
      };

      if (!useMock && pool) {
        await pool.query(
          'INSERT INTO farmers (user_id, farm_name, farm_address, state, payout_details) VALUES ($1, $2, $3, $4, $5)',
          [userId, farmName, farmAddress, state, JSON.stringify(payoutDetails)]
        );
        return newFarmer;
      }

      farmers.push(newFarmer);
      return newFarmer;
    },

    async update(userId: string, updates: any) {
      if (!useMock && pool) {
        const keys = Object.keys(updates);
        const values = Object.values(updates);
        const setString = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
        const queryText = `UPDATE farmers SET ${setString} WHERE user_id = $1 RETURNING *`;
        const res = await pool.query(queryText, [userId, ...values]);
        return res.rows[0];
      }

      const farmer = farmers.find(f => f.user_id === userId);
      if (farmer) {
        Object.assign(farmer, updates);
      }
      return farmer;
    },

    async listAll() {
      if (!useMock && pool) {
        const res = await pool.query(
          'SELECT f.*, u.full_name, u.email, u.phone_number, u.avatar_url FROM farmers f JOIN users u ON f.user_id = u.id'
        );
        return res.rows;
      }
      return farmers.map(f => {
        const user = users.find(u => u.id === f.user_id);
        return {
          ...f,
          full_name: user?.full_name || '',
          email: user?.email || '',
          phone_number: user?.phone_number || '',
          avatar_url: user?.avatar_url || ''
        };
      });
    }
  },

  buyers: {
    async findById(userId: string) {
      if (!useMock && pool) {
        const res = await pool.query(
          'SELECT b.*, u.full_name, u.email, u.phone_number, u.avatar_url FROM buyers b JOIN users u ON b.user_id = u.id WHERE b.user_id = $1',
          [userId]
        );
        return res.rows[0];
      }
      const buyer = buyers.find(b => b.user_id === userId);
      const user = users.find(u => u.id === userId);
      if (!buyer || !user) return null;
      return { ...buyer, full_name: user.full_name, email: user.email, phone_number: user.phone_number, avatar_url: user.avatar_url };
    },

    async create(userId: string, deliveryAddress: string, state: string) {
      const newBuyer = {
        user_id: userId,
        delivery_address: deliveryAddress,
        state,
        balance: 0.00,
        created_at: new Date()
      };

      if (!useMock && pool) {
        await pool.query(
          'INSERT INTO buyers (user_id, delivery_address, state) VALUES ($1, $2, $3)',
          [userId, deliveryAddress, state]
        );
        return newBuyer;
      }

      buyers.push(newBuyer);
      return newBuyer;
    },

    async update(userId: string, updates: any) {
      if (!useMock && pool) {
        const keys = Object.keys(updates);
        const values = Object.values(updates);
        const setString = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
        const queryText = `UPDATE buyers SET ${setString} WHERE user_id = $1 RETURNING *`;
        const res = await pool.query(queryText, [userId, ...values]);
        return res.rows[0];
      }

      const buyer = buyers.find(b => b.user_id === userId);
      if (buyer) {
        Object.assign(buyer, updates);
      }
      return buyer;
    }
  },

  categories: {
    async listAll() {
      if (!useMock && pool) {
        const res = await pool.query('SELECT * FROM categories ORDER BY id ASC');
        return res.rows;
      }
      return categories;
    }
  },

  products: {
    async listAll(filters: any = {}) {
      if (!useMock && pool) {
        let queryText = `
          SELECT p.*, c.name as category_name, f.farm_name, u.full_name as farmer_name, f.state as farm_state
          FROM products p
          JOIN categories c ON p.category_id = c.id
          JOIN farmers f ON p.farmer_id = f.user_id
          JOIN users u ON f.user_id = u.id
          WHERE p.availability_status = 'in_stock'
        `;
        const params: any[] = [];
        let index = 1;

        if (filters.category) {
          queryText += ` AND c.name = $${index}`;
          params.push(filters.category);
          index++;
        }
        if (filters.search) {
          queryText += ` AND (p.name ILIKE $${index} OR p.description ILIKE $${index})`;
          params.push(`%${filters.search}%`);
          index++;
        }
        if (filters.state) {
          queryText += ` AND f.state = $${index}`;
          params.push(filters.state);
          index++;
        }

        queryText += ' ORDER BY p.created_at DESC';
        const res = await pool.query(queryText, params);
        return res.rows;
      }

      // Mock implementation
      let result = products.filter(p => p.availability_status === 'in_stock');

      if (filters.category) {
        const cat = categories.find(c => c.name.toLowerCase() === filters.category.toLowerCase());
        if (cat) {
          result = result.filter(p => p.category_id === cat.id);
        } else {
          result = [];
        }
      }

      if (filters.search) {
        const s = filters.search.toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
      }

      if (filters.state) {
        result = result.filter(p => {
          const f = farmers.find(farm => farm.user_id === p.farmer_id);
          return f?.state.toLowerCase() === filters.state.toLowerCase();
        });
      }

      return result.map(p => {
        const cat = categories.find(c => c.id === p.category_id);
        const f = farmers.find(farm => farm.user_id === p.farmer_id);
        const user = users.find(u => u.id === p.farmer_id);
        return {
          ...p,
          category_name: cat?.name || '',
          farm_name: f?.farm_name || '',
          farmer_name: user?.full_name || '',
          farm_state: f?.state || ''
        };
      });
    },

    async findById(id: string) {
      if (!useMock && pool) {
        const res = await pool.query(
          `SELECT p.*, c.name as category_name, f.farm_name, u.full_name as farmer_name, f.state as farm_state, f.ratings as farmer_rating
           FROM products p
           JOIN categories c ON p.category_id = c.id
           JOIN farmers f ON p.farmer_id = f.user_id
           JOIN users u ON f.user_id = u.id
           WHERE p.id = $1`,
          [id]
        );
        return res.rows[0];
      }

      const p = products.find(prod => prod.id === id);
      if (!p) return null;
      const cat = categories.find(c => c.id === p.category_id);
      const f = farmers.find(farm => farm.user_id === p.farmer_id);
      const user = users.find(u => u.id === p.farmer_id);
      return {
        ...p,
        category_name: cat?.name || '',
        farm_name: f?.farm_name || '',
        farmer_name: user?.full_name || '',
        farm_state: f?.state || '',
        farmer_rating: f?.ratings || 0.0
      };
    },

    async listByFarmer(farmerId: string) {
      if (!useMock && pool) {
        const res = await pool.query(
          `SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.farmer_id = $1 ORDER BY p.created_at DESC`,
          [farmerId]
        );
        return res.rows;
      }
      return products.filter(p => p.farmer_id === farmerId).map(p => {
        const cat = categories.find(c => c.id === p.category_id);
        return {
          ...p,
          category_name: cat?.name || ''
        };
      });
    },

    async create(farmerId: string, name: string, description: string, categoryId: number, price: number, quantity: number, quantityUnit: string, deliveryEstimate: string, imagePaths: string[]) {
      const id = uuid();
      const newProduct = {
        id,
        farmer_id: farmerId,
        name,
        description,
        category_id: categoryId,
        price: Number(price),
        quantity: Number(quantity),
        quantity_unit: quantityUnit || 'kg',
        availability_status: 'in_stock',
        delivery_estimate: deliveryEstimate || '2-3 days',
        rating: 0.0,
        image_urls: imagePaths.length > 0 ? imagePaths : ['https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=400'],
        created_at: new Date()
      };

      if (!useMock && pool) {
        await pool.query(
          'INSERT INTO products (id, farmer_id, name, description, category_id, price, quantity, quantity_unit, delivery_estimate, image_urls) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
          [id, farmerId, name, description, categoryId, price, quantity, quantityUnit, deliveryEstimate, imagePaths]
        );
        return newProduct;
      }

      products.push(newProduct);
      return newProduct;
    },

    async update(id: string, updates: any) {
      if (!useMock && pool) {
        const keys = Object.keys(updates);
        const values = Object.values(updates);
        const setString = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
        const queryText = `UPDATE products SET ${setString}, updated_at = NOW() WHERE id = $1 RETURNING *`;
        const res = await pool.query(queryText, [id, ...values]);
        return res.rows[0];
      }

      const p = products.find(prod => prod.id === id);
      if (p) {
        Object.assign(p, updates, { updated_at: new Date() });
      }
      return p;
    },

    async delete(id: string) {
      if (!useMock && pool) {
        await pool.query('DELETE FROM products WHERE id = $1', [id]);
        return true;
      }
      const idx = products.findIndex(prod => prod.id === id);
      if (idx !== -1) {
        products.splice(idx, 1);
        return true;
      }
      return false;
    }
  },

  orders: {
    async create(buyerId: string, totalAmount: number, shippingAddress: string, shippingState: string, reference: string, items: any[]) {
      const orderId = uuid();
      const newOrder = {
        id: orderId,
        buyer_id: buyerId,
        total_amount: totalAmount,
        status: 'pending',
        payment_status: 'unpaid',
        shipping_address: shippingAddress,
        shipping_state: shippingState,
        payment_reference: reference,
        delivery_partner_id: null,
        created_at: new Date(),
        updated_at: new Date()
      };

      if (!useMock && pool) {
        // Run as transaction in production
        await pool.query(
          'INSERT INTO orders (id, buyer_id, total_amount, shipping_address, shipping_state, payment_reference) VALUES ($1, $2, $3, $4, $5, $6)',
          [orderId, buyerId, totalAmount, shippingAddress, shippingState, reference]
        );
        for (const item of items) {
          await pool.query(
            'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)',
            [orderId, item.product_id, item.quantity, item.price]
          );
        }
        return newOrder;
      }

      // Mock
      orders.push(newOrder);
      for (const item of items) {
        orderItems.push({
          id: uuid(),
          order_id: orderId,
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: item.price
        });
      }
      return newOrder;
    },

    async findById(orderId: string) {
      if (!useMock && pool) {
        const orderRes = await pool.query(
          `SELECT o.*, u.full_name as buyer_name, u.email as buyer_email, u.phone_number as buyer_phone
           FROM orders o
           JOIN users u ON o.buyer_id = u.id
           WHERE o.id = $1`,
          [orderId]
        );
        const order = orderRes.rows[0];
        if (!order) return null;

        const itemsRes = await pool.query(
          `SELECT oi.*, p.name as product_name, p.image_urls, p.farmer_id
           FROM order_items oi
           JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = $1`,
          [orderId]
        );
        order.items = itemsRes.rows;
        return order;
      }

      const o = orders.find(ord => ord.id === orderId);
      if (!o) return null;

      const buyer = users.find(u => u.id === o.buyer_id);
      const items = orderItems.filter(oi => oi.order_id === orderId).map(oi => {
        const prod = products.find(p => p.id === oi.product_id);
        return {
          ...oi,
          product_name: prod?.name || '',
          image_urls: prod?.image_urls || [],
          farmer_id: prod?.farmer_id || ''
        };
      });

      return {
        ...o,
        buyer_name: buyer?.full_name || '',
        buyer_email: buyer?.email || '',
        buyer_phone: buyer?.phone_number || '',
        items
      };
    },

    async findByReference(ref: string) {
      if (!useMock && pool) {
        const res = await pool.query('SELECT * FROM orders WHERE payment_reference = $1', [ref]);
        return res.rows[0];
      }
      return orders.find(o => o.payment_reference === ref) || null;
    },

    async update(id: string, updates: any) {
      if (!useMock && pool) {
        const keys = Object.keys(updates);
        const values = Object.values(updates);
        const setString = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
        const queryText = `UPDATE orders SET ${setString}, updated_at = NOW() WHERE id = $1 RETURNING *`;
        const res = await pool.query(queryText, [id, ...values]);
        return res.rows[0];
      }

      const o = orders.find(ord => ord.id === id);
      if (o) {
        Object.assign(o, updates, { updated_at: new Date() });
      }
      return o;
    },

    async listByBuyer(buyerId: string) {
      if (!useMock && pool) {
        const res = await pool.query('SELECT * FROM orders WHERE buyer_id = $1 ORDER BY created_at DESC', [buyerId]);
        return res.rows;
      }
      return orders.filter(o => o.buyer_id === buyerId).sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    },

    async listByFarmer(farmerId: string) {
      if (!useMock && pool) {
        const res = await pool.query(
          `SELECT DISTINCT o.*
           FROM orders o
           JOIN order_items oi ON o.id = oi.order_id
           JOIN products p ON oi.product_id = p.id
           WHERE p.farmer_id = $1
           ORDER BY o.created_at DESC`,
          [farmerId]
        );
        return res.rows;
      }

      const farmerProductIds = products.filter(p => p.farmer_id === farmerId).map(p => p.id);
      const matchingOrderIds = Array.from(new Set(orderItems.filter(oi => farmerProductIds.includes(oi.product_id)).map(oi => oi.order_id)));
      return orders.filter(o => matchingOrderIds.includes(o.id)).sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    },

    async listByDeliveryPartner(partnerId: string) {
      if (!useMock && pool) {
        const res = await pool.query('SELECT * FROM orders WHERE delivery_partner_id = $1 ORDER BY created_at DESC', [partnerId]);
        return res.rows;
      }
      return orders.filter(o => o.delivery_partner_id === partnerId).sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    },

    async listAll() {
      if (!useMock && pool) {
        const res = await pool.query('SELECT o.*, u.full_name as buyer_name FROM orders o JOIN users u ON o.buyer_id = u.id ORDER BY o.created_at DESC');
        return res.rows;
      }
      return orders.map(o => {
        const buyer = users.find(u => u.id === o.buyer_id);
        return {
          ...o,
          buyer_name: buyer?.full_name || ''
        };
      }).sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    }
  },

  transactions: {
    async create(orderId: string | null, userId: string, amount: number, type: string, status: string, ref: string) {
      const id = uuid();
      const newTx = {
        id,
        order_id: orderId,
        user_id: userId,
        amount,
        transaction_type: type,
        status,
        reference: ref,
        created_at: new Date()
      };

      if (!useMock && pool) {
        await pool.query(
          'INSERT INTO transactions (id, order_id, user_id, amount, transaction_type, status, reference) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [id, orderId, userId, amount, type, status, ref]
        );
        return newTx;
      }

      transactions.push(newTx);
      return newTx;
    },

    async listByUser(userId: string) {
      if (!useMock && pool) {
        const res = await pool.query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        return res.rows;
      }
      return transactions.filter(t => t.user_id === userId).sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    },

    async listAll() {
      if (!useMock && pool) {
        const res = await pool.query(
          'SELECT t.*, u.full_name, u.email FROM transactions t JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC'
        );
        return res.rows;
      }
      return transactions.map(t => {
        const user = users.find(u => u.id === t.user_id);
        return {
          ...t,
          full_name: user?.full_name || '',
          email: user?.email || ''
        };
      }).sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    }
  },

  reviews: {
    async create(productId: string, reviewerId: string, rating: number, comment: string) {
      const id = uuid();
      const newReview = {
        id,
        product_id: productId,
        reviewer_id: reviewerId,
        rating,
        comment,
        created_at: new Date()
      };

      if (!useMock && pool) {
        await pool.query(
          'INSERT INTO reviews (id, product_id, reviewer_id, rating, comment) VALUES ($1, $2, $3, $4, $5)',
          [id, productId, reviewerId, rating, comment]
        );
        // Update product average rating
        await pool.query(
          `UPDATE products SET rating = (SELECT AVG(rating) FROM reviews WHERE product_id = $1) WHERE id = $1`,
          [productId]
        );
        return newReview;
      }

      reviews.push(newReview);
      // Update local rating
      const prod = products.find(p => p.id === productId);
      if (prod) {
        const prodReviews = reviews.filter(r => r.product_id === productId);
        const sum = prodReviews.reduce((acc, curr) => acc + curr.rating, 0);
        prod.rating = parseFloat((sum / prodReviews.length).toFixed(1));
      }
      return newReview;
    },

    async listByProduct(productId: string) {
      if (!useMock && pool) {
        const res = await pool.query(
          'SELECT r.*, u.full_name, u.avatar_url FROM reviews r JOIN users u ON r.reviewer_id = u.id WHERE r.product_id = $1 ORDER BY r.created_at DESC',
          [productId]
        );
        return res.rows;
      }
      return reviews.filter(r => r.product_id === productId).map(r => {
        const user = users.find(u => u.id === r.reviewer_id);
        return {
          ...r,
          full_name: user?.full_name || 'Anonymous',
          avatar_url: user?.avatar_url || ''
        };
      }).sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    }
  },

  notifications: {
    async create(userId: string, title: string, message: string) {
      const id = uuid();
      const newNotif = {
        id,
        user_id: userId,
        title,
        message,
        is_read: false,
        created_at: new Date()
      };

      if (!useMock && pool) {
        await pool.query(
          'INSERT INTO notifications (id, user_id, title, message) VALUES ($1, $2, $3, $4)',
          [id, userId, title, message]
        );
        return newNotif;
      }

      notifications.push(newNotif);
      return newNotif;
    },

    async listByUser(userId: string) {
      if (!useMock && pool) {
        const res = await pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        return res.rows;
      }
      return notifications.filter(n => n.user_id === userId).sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    },

    async markAsRead(id: string) {
      if (!useMock && pool) {
        await pool.query('UPDATE notifications SET is_read = true WHERE id = $1', [id]);
        return true;
      }
      const n = notifications.find(not => not.id === id);
      if (n) {
        n.is_read = true;
        return true;
      }
      return false;
    }
  },

  deliveries: {
    async create(orderId: string, deliveryPartnerId: string) {
      const id = uuid();
      const newDelivery = {
        id,
        order_id: orderId,
        delivery_partner_id: deliveryPartnerId,
        status: 'assigned',
        delivery_history: [{ status: 'assigned', timestamp: new Date(), notes: 'Order assigned to delivery partner.' }],
        created_at: new Date(),
        updated_at: new Date()
      };

      if (!useMock && pool) {
        await pool.query(
          'INSERT INTO deliveries (id, order_id, delivery_partner_id, status, delivery_history) VALUES ($1, $2, $3, $4, $5)',
          [id, orderId, deliveryPartnerId, 'assigned', JSON.stringify(newDelivery.delivery_history)]
        );
        await pool.query('UPDATE orders SET delivery_partner_id = $1, status = $2 WHERE id = $3', [deliveryPartnerId, 'shipped', orderId]);
        return newDelivery;
      }

      deliveries.push(newDelivery);
      const o = orders.find(ord => ord.id === orderId);
      if (o) {
        o.delivery_partner_id = deliveryPartnerId;
        o.status = 'shipped';
        o.updated_at = new Date();
      }
      return newDelivery;
    },

    async update(orderId: string, status: string, notes: string) {
      if (!useMock && pool) {
        const deliveryRes = await pool.query('SELECT * FROM deliveries WHERE order_id = $1', [orderId]);
        const delivery = deliveryRes.rows[0];
        if (delivery) {
          const history = typeof delivery.delivery_history === 'string' ? JSON.parse(delivery.delivery_history) : delivery.delivery_history;
          history.push({ status, timestamp: new Date(), notes });

          await pool.query(
            'UPDATE deliveries SET status = $1, delivery_history = $2, updated_at = NOW() WHERE order_id = $3',
            [status, JSON.stringify(history), orderId]
          );
        }

        // Update main order status
        // If delivery status is 'delivered', we mark order as 'delivered' (then completed once buyer accepts)
        let orderStatus = 'shipped';
        if (status === 'delivered') orderStatus = 'delivered';
        await pool.query('UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2', [orderStatus, orderId]);
        return true;
      }

      const delivery = deliveries.find(d => d.order_id === orderId);
      if (delivery) {
        delivery.status = status;
        delivery.delivery_history.push({ status, timestamp: new Date(), notes });
        delivery.updated_at = new Date();

        const o = orders.find(ord => ord.id === orderId);
        if (o) {
          o.status = status === 'delivered' ? 'delivered' : 'shipped';
          o.updated_at = new Date();
        }
        return true;
      }
      return false;
    },

    async listByPartner(partnerId: string) {
      if (!useMock && pool) {
        const res = await pool.query(
          `SELECT d.*, o.shipping_address, o.shipping_state, o.total_amount, o.status as order_status, u.full_name as buyer_name
           FROM deliveries d
           JOIN orders o ON d.order_id = o.id
           JOIN users u ON o.buyer_id = u.id
           WHERE d.delivery_partner_id = $1
           ORDER BY d.created_at DESC`,
          [partnerId]
        );
        return res.rows;
      }

      return deliveries.filter(d => d.delivery_partner_id === partnerId).map(d => {
        const o = orders.find(ord => ord.id === d.order_id);
        const buyer = o ? users.find(u => u.id === o.buyer_id) : null;
        return {
          ...d,
          shipping_address: o?.shipping_address || '',
          shipping_state: o?.shipping_state || '',
          total_amount: o?.total_amount || 0,
          order_status: o?.status || '',
          buyer_name: buyer?.full_name || ''
        };
      }).sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    },

    async listAll() {
      if (!useMock && pool) {
        const res = await pool.query(
          `SELECT d.*, o.shipping_address, u.full_name as delivery_partner_name
           FROM deliveries d
           JOIN orders o ON d.order_id = o.id
           JOIN users u ON d.delivery_partner_id = u.id
           ORDER BY d.created_at DESC`
        );
        return res.rows;
      }
      return deliveries.map(d => {
        const o = orders.find(ord => ord.id === d.order_id);
        const partner = users.find(u => u.id === d.delivery_partner_id);
        return {
          ...d,
          shipping_address: o?.shipping_address || '',
          delivery_partner_name: partner?.full_name || ''
        };
      }).sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    }
  },

  messages: {
    async create(senderId: string, receiverId: string, content: string) {
      const id = uuid();
      const newMsg = {
        id,
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        is_read: false,
        created_at: new Date()
      };

      if (!useMock && pool) {
        await pool.query(
          'INSERT INTO messages (id, sender_id, receiver_id, content) VALUES ($1, $2, $3, $4)',
          [id, senderId, receiverId, content]
        );
        return newMsg;
      }

      messages.push(newMsg);
      return newMsg;
    },

    async listChat(userA: string, userB: string) {
      if (!useMock && pool) {
        // Mark messages as read for receiver
        await pool.query(
          'UPDATE messages SET is_read = true WHERE sender_id = $2 AND receiver_id = $1',
          [userA, userB]
        );

        const res = await pool.query(
          `SELECT * FROM messages
           WHERE (sender_id = $1 AND receiver_id = $2)
              OR (sender_id = $2 AND receiver_id = $1)
           ORDER BY created_at ASC`,
          [userA, userB]
        );
        return res.rows;
      }

      // Mark as read locally
      messages.forEach(m => {
        if (m.sender_id === userB && m.receiver_id === userA) {
          m.is_read = true;
        }
      });

      return messages
        .filter(m => (m.sender_id === userA && m.receiver_id === userB) || (m.sender_id === userB && m.receiver_id === userA))
        .sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
    },

    async listContacts(userId: string) {
      if (!useMock && pool) {
        const res = await pool.query(
          `SELECT DISTINCT u.id, u.full_name, u.role, u.avatar_url
           FROM users u
           WHERE u.id IN (
             SELECT DISTINCT sender_id FROM messages WHERE receiver_id = $1
             UNION
             SELECT DISTINCT receiver_id FROM messages WHERE sender_id = $1
           )`,
          [userId]
        );
        return res.rows;
      }

      const contactedIds = Array.from(
        new Set([
          ...messages.filter(m => m.sender_id === userId).map(m => m.receiver_id),
          ...messages.filter(m => m.receiver_id === userId).map(m => m.sender_id)
        ])
      );

      return users
        .filter(u => contactedIds.includes(u.id))
        .map(u => ({
          id: u.id,
          full_name: u.full_name,
          role: u.role,
          avatar_url: u.avatar_url
        }));
    }
  },

  // --- ECOSYSTEM UPGRADE MODULES ---
  verification: {
    async getStatus(userId: string) {
      return {
        nin_verified: true,
        bvn_verified: true,
        farm_photos_count: 4,
        trust_score: 96,
        status: 'verified',
        badge: 'Verified Agrein Farmer'
      };
    },
    async submitVerification(userId: string, data: any) {
      return { success: true, status: 'pending', message: 'Verification documents submitted for review.' };
    }
  },

  cooperatives: {
    async listAll() {
      return [
        {
          id: 'coop-1',
          name: 'Dawanau Grain Farmers Cooperative',
          state: 'Kano State',
          members_count: 142,
          crops: ['Yellow Maize', 'Sorghum', 'Sesame'],
          total_tonnage_available: '450 Tonnes',
          leader: 'Kole Adebayo',
          description: 'Premier grain growers association in Kano specializing in export-grade cereal crops.'
        },
        {
          id: 'coop-2',
          name: 'Benue Tubers & Roots Agro Union',
          state: 'Benue State',
          members_count: 89,
          crops: ['Yam Tubers', 'Cassava'],
          total_tonnage_available: '280 Tonnes',
          leader: 'Musa Ibrahim',
          description: 'Commercial yam and cassava farming union providing bulk supply for food processors.'
        }
      ];
    }
  },

  intelligence: {
    async getCommodityTrends() {
      return {
        forecastAlert: "Tomato prices in Lagos are projected to increase by 15% within the next 30 days due to rainy season supply shifts.",
        historical: [
          { month: 'Jan', maize: 42000, tomato: 28000, sesame: 850000, cocoa: 1200000 },
          { month: 'Feb', maize: 43500, tomato: 31000, sesame: 880000, cocoa: 1250000 },
          { month: 'Mar', maize: 45000, tomato: 30000, sesame: 900000, cocoa: 1300000 },
          { month: 'Apr', maize: 46200, tomato: 34000, sesame: 910000, cocoa: 1380000 },
          { month: 'May', maize: 47800, tomato: 36000, sesame: 915000, cocoa: 1420000 },
          { month: 'Jun', maize: 48500, tomato: 35000, sesame: 920000, cocoa: 1450000 },
        ]
      };
    }
  },

  wallet: {
    async getBalance(userId: string) {
      return {
        available_balance: 385000,
        escrow_locked: 120000,
        currency: 'NGN',
        account_number: '9012345678',
        bank_name: 'Agrein Wallet / Wema Bank'
      };
    },
    async deposit(userId: string, amount: number) {
      return { success: true, new_balance: 385000 + amount, message: `Successfully deposited ₦${amount.toLocaleString()}` };
    },
    async withdraw(userId: string, amount: number) {
      return { success: true, new_balance: 385000 - amount, message: `Withdrawal request of ₦${amount.toLocaleString()} initiated.` };
    }
  },

  subscriptions: {
    async getCurrentPlan(userId: string) {
      return {
        plan: 'Pro Farmer',
        price: '₦5,000 / month',
        status: 'active',
        features: ['Unlimited Product Listings', 'Featured Market Placement', 'AgriBot AI Access', 'Priority Support']
      };
    }
  },

  learningCenter: {
    async listCourses() {
      return [
        {
          id: 'course-1',
          title: 'Post-Harvest Loss Prevention for Grain Farmers',
          category: 'Pest & Storage',
          duration: '45 mins',
          modules: 5,
          image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400',
          instructor: 'Dr. Aliyu Bello, IITA Specialist'
        },
        {
          id: 'course-2',
          title: 'Export Standards & Quality Certification for Cashew & Cocoa',
          category: 'International Trade',
          duration: '60 mins',
          modules: 6,
          image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&q=80&w=400',
          instructor: 'Engr. Folake Adeyemi, NEPC Auditor'
        }
      ];
    }
  },

  exportMarketplace: {
    async listExportListings() {
      return [
        {
          id: 'exp-1',
          title: 'Premium Raw Cashew Nuts (RCN)',
          hs_code: '080131',
          origin: 'Ogbomoso, Oyo State',
          nut_count: '180-200 lbs',
          kOR: '48 lbs',
          quantity_available: '100 Tonnes',
          price_fob: '$1,250 / Tonne FOB Lagos',
          certification: 'NEPC Certified Organic'
        },
        {
          id: 'exp-2',
          title: 'Sun-Dried Split Ginger (Grade A)',
          hs_code: '091011',
          origin: 'Kafanchan, Kaduna State',
          oil_content: '2.5% Min',
          moisture: '9% Max',
          quantity_available: '50 Tonnes',
          price_fob: '$2,100 / Tonne FOB Port Harcourt',
          certification: 'Phytosanitary Certified'
        }
      ];
    }
  },

  forum: {
    async listThreads() {
      return [
        {
          id: 'thread-1',
          author: 'Kole Adebayo',
          author_role: 'Grain Farmer',
          title: 'What is the current market price for 100kg Maize bag in Dawanau today?',
          category: 'Market Prices',
          upvotes: 24,
          replies_count: 8,
          created_at: new Date()
        },
        {
          id: 'thread-2',
          author: 'Dr. Fatima Bello',
          author_role: 'Agronomist',
          title: 'Effective organic remedies against Tomato Leaf Miner (Tuta Absoluta) in rainy season',
          category: 'Crop Protection',
          upvotes: 42,
          replies_count: 15,
          created_at: new Date()
        }
      ];
    }
  },

  traceability: {
    async getBatchDetails(batchId: string) {
      return {
        batch_id: batchId || 'AGR-BATCH-9942',
        produce: 'Organic Yellow Maize (Grade A)',
        farm_name: 'GreenField Agro Cooperative',
        farmer: 'Kole Adebayo',
        farm_location: 'Dawanau, Kano State, Nigeria',
        harvest_date: '2026-07-10',
        moisture_level: '11.4%',
        packaging_date: '2026-07-12',
        escrow_status: 'Interswitch Verified',
        qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://agrein.com/traceability/${batchId || 'AGR-BATCH-9942'}`
      };
    }
  }
};

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatic token attachment for authorized routes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agrein_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// API Services
export const authService = {
  async login(credentials: any) {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  async register(data: any) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },
  async updateProfile(profileData: any) {
    const res = await api.put('/auth/profile', profileData);
    return res.data;
  },
  async listAllUsers() {
    const res = await api.get('/auth/admin/users');
    return res.data;
  }
};

export const productService = {
  async getCategories() {
    const res = await api.get('/products/categories');
    return res.data;
  },
  async searchProducts(filters: any = {}) {
    const res = await api.get('/products', { params: filters });
    return res.data;
  },
  async getMyProducts() {
    const res = await api.get('/products/farmer/my-products');
    return res.data;
  },
  async getProductById(id: string) {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  async createProduct(data: any) {
    const res = await api.post('/products', data);
    return res.data;
  },
  async updateProduct(id: string, data: any) {
    const res = await api.put(`/products/${id}`, data);
    return res.data;
  },
  async deleteProduct(id: string) {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
  async getReviews(productId: string) {
    const res = await api.get(`/products/${productId}/reviews`);
    return res.data;
  },
  async addReview(productId: string, data: any) {
    const res = await api.post(`/products/${productId}/reviews`, data);
    return res.data;
  }
};

export const orderService = {
  async createOrder(data: any) {
    const res = await api.post('/orders', data);
    return res.data;
  },
  async getBuyerOrders() {
    const res = await api.get('/orders/buyer/my-orders');
    return res.data;
  },
  async getFarmerOrders() {
    const res = await api.get('/orders/farmer/my-orders');
    return res.data;
  },
  async getAdminOrders() {
    const res = await api.get('/orders/admin/all-orders');
    return res.data;
  },
  async getOrderById(id: string) {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
  async completeOrder(id: string) {
    const res = await api.post(`/orders/${id}/complete`);
    return res.data;
  }
};

export const paymentService = {
  async verifyPayment(reference: string) {
    const res = await api.post('/payments/verify', { reference });
    return res.data;
  },
  async requestWithdrawal(amount: number) {
    const res = await api.post('/payments/withdraw', { amount });
    return res.data;
  }
};

export const deliveryService = {
  async getMyDeliveries() {
    const res = await api.get('/deliveries/my-deliveries');
    return res.data;
  },
  async getPendingPickups() {
    const res = await api.get('/deliveries/pending-pickup');
    return res.data;
  },
  async acceptDelivery(orderId: string) {
    const res = await api.post(`/deliveries/${orderId}/accept`);
    return res.data;
  },
  async updateDeliveryStatus(orderId: string, status: string, notes: string) {
    const res = await api.post(`/deliveries/${orderId}/status`, { status, notes });
    return res.data;
  }
};

export const messageService = {
  async getContacts() {
    const res = await api.get('/messages/contacts');
    return res.data;
  },
  async getChatHistory(receiverId: string) {
    const res = await api.get(`/messages/chat/${receiverId}`);
    return res.data;
  },
  async sendMessage(receiverId: string, content: string) {
    const res = await api.post('/messages', { receiverId, content });
    return res.data;
  }
};

export const analyticsService = {
  async getFarmerAnalytics() {
    const res = await api.get('/analytics/farmer');
    return res.data;
  },
  async getBuyerAnalytics() {
    const res = await api.get('/analytics/buyer');
    return res.data;
  },
  async getAdminAnalytics() {
    const res = await api.get('/analytics/admin');
    return res.data;
  },
  async getNotifications() {
    const res = await api.get('/analytics/notifications');
    return res.data;
  },
  async markNotificationRead(id: string) {
    const res = await api.post(`/analytics/notifications/${id}/read`);
    return res.data;
  },
  async approveFarmer(farmerId: string, status: 'approved' | 'rejected') {
    const res = await api.post('/analytics/admin/approve-farmer', { farmerId, status });
    return res.data;
  }
};

export const rfqService = {
  async getRfqs() {
    const res = await api.get('/rfq');
    return res.data;
  },
  async createRfq(rfqData: any) {
    const res = await api.post('/rfq', rfqData);
    return res.data;
  },
  async submitBid(rfqId: string, bidData: any) {
    const res = await api.post(`/rfq/${rfqId}/bids`, bidData);
    return res.data;
  },
  async getBids(rfqId: string) {
    const res = await api.get(`/rfq/${rfqId}/bids`);
    return res.data;
  }
};

export const verificationService = {
  async getStatus() {
    const res = await api.get('/verification/status');
    return res.data;
  },
  async submit(data: any) {
    const res = await api.post('/verification/submit', data);
    return res.data;
  }
};

export const cooperativeService = {
  async getCooperatives() {
    const res = await api.get('/cooperatives');
    return res.data;
  }
};

export const intelligenceService = {
  async getTrends() {
    const res = await api.get('/intelligence');
    return res.data;
  }
};

export const walletService = {
  async getBalance() {
    const res = await api.get('/wallet/balance');
    return res.data;
  },
  async deposit(amount: number) {
    const res = await api.post('/wallet/deposit', { amount });
    return res.data;
  },
  async withdraw(amount: number) {
    const res = await api.post('/wallet/withdraw', { amount });
    return res.data;
  }
};

export const subscriptionService = {
  async getPlan() {
    const res = await api.get('/subscriptions/plan');
    return res.data;
  }
};

export const learningService = {
  async getCourses() {
    const res = await api.get('/learning/courses');
    return res.data;
  }
};

export const exportService = {
  async getListings() {
    const res = await api.get('/export');
    return res.data;
  }
};

export const forumService = {
  async getThreads() {
    const res = await api.get('/forum');
    return res.data;
  }
};

export const traceabilityService = {
  async getBatch(batchId: string) {
    const res = await api.get(`/traceability/${batchId}`);
    return res.data;
  }
};

export default api;

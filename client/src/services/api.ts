import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchProducts = async (params?: any) => {
  const response = await API.get('/products', { params });
  return response.data;
};

export const fetchProductById = async (id: string) => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

export const initializeInterswitchPayment = async (data: {
  amount: number;
  email: string;
  channel: string;
  orderId?: string;
  isWalletFunding?: boolean;
}) => {
  const response = await API.post('/payments/initialize', data);
  return response.data;
};

export const verifyInterswitchPayment = async (transactionRef: string, amount: number) => {
  const response = await API.post('/payments/verify', { transactionRef, amount });
  return response.data;
};

export const releaseEscrowFunds = async (transactionRef: string, farmerId: string) => {
  const response = await API.post('/payments/escrow/release', { transactionRef, farmerId });
  return response.data;
};

export const fetchWalletBalance = async () => {
  const response = await API.get('/wallet/balance');
  return response.data;
};

export const depositWallet = async (amount: number, interswitchRef?: string) => {
  const response = await API.post('/wallet/deposit', { amount, interswitchRef });
  return response.data;
};

export const withdrawWallet = async (amount: number, bankCode: string, accountNumber: string) => {
  const response = await API.post('/wallet/withdraw', { amount, bankCode, accountNumber });
  return response.data;
};

export const fetchRFQs = async () => {
  const response = await API.get('/rfq');
  return response.data;
};

export const createRFQ = async (rfqData: any) => {
  const response = await API.post('/rfq', rfqData);
  return response.data;
};

export const submitRFQBid = async (rfqId: string, bidData: any) => {
  const response = await API.post(`/rfq/${rfqId}/bids`, bidData);
  return response.data;
};

export const fetchCommodityPrices = async () => {
  const response = await API.get('/ai/commodity-prices');
  return response.data;
};

export const diagnoseCropDisease = async (cropType: string, notes: string, imageUrl?: string) => {
  const response = await API.post('/ai/diagnose-crop', { cropType, notes, imageUrl });
  return response.data;
};

export const askAiAssistant = async (query: string) => {
  const response = await API.post('/ai/assistant-chat', { query });
  return response.data;
};

export const fetchDeliveries = async () => {
  const response = await API.get('/logistics');
  return response.data;
};

export const calculateLogisticsFee = async (data: any) => {
  const response = await API.post('/logistics/calculate-fee', data);
  return response.data;
};

export const fetchForumPosts = async () => {
  const response = await API.get('/community/posts');
  return response.data;
};

export const fetchCooperatives = async () => {
  const response = await API.get('/cooperatives');
  return response.data;
};

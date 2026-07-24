export type UserRole = 'farmer' | 'buyer' | 'delivery_partner' | 'exporter' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  phoneNumber?: string;
}

export interface Farmer {
  id: string;
  farmName: string;
  location: string;
  state: string;
  trustScore: number;
  isVerified: boolean;
  ninVerified?: boolean;
  bvnVerified?: boolean;
}

export interface TraceabilityItem {
  stage: string;
  location: string;
  date: string;
  status: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  pricePerUnit: number;
  unit: string;
  availableStock: number;
  minOrderQuantity: number;
  farmer: Farmer;
  isOrganic: boolean;
  isBulkAvailable: boolean;
  harvestDate: string;
  imageUrl: string;
  qrCode: string;
  traceability: TraceabilityItem[];
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'escrow_hold' | 'escrow_release' | 'refund';
  amount: number;
  reference: string;
  interswitchRef?: string;
  description: string;
  status: 'success' | 'pending' | 'failed';
  date: string;
}

export interface Wallet {
  availableBalance: number;
  escrowBalance: number;
  currency: string;
  transactions: WalletTransaction[];
}

export interface RFQBid {
  bidId: string;
  farmerName: string;
  offeredPrice: number;
  offeredQuantity: number;
  fulfillmentDate: string;
  status: 'submitted' | 'accepted' | 'rejected';
  notes: string;
}

export interface RFQ {
  id: string;
  buyerName: string;
  buyerType: string;
  cropName: string;
  quantityRequired: number;
  unit: string;
  targetPricePerUnit: number;
  deliveryLocation: string;
  deadlineDate: string;
  status: 'open' | 'negotiating' | 'awarded' | 'closed';
  description: string;
  bidsCount: number;
  bids: RFQBid[];
}

export interface CommodityPrice {
  commodity: string;
  unit: string;
  currentPrice: number;
  previousPrice: number;
  change: string;
  trend: 'up' | 'down' | 'stable';
  forecastNextMonth: number;
  recommendation: string;
}

export interface Cooperative {
  id: string;
  name: string;
  registrationNumber: string;
  state: string;
  membersCount: number;
  leaderName: string;
  sharedStockTons: number;
  description: string;
}

export interface ForumPost {
  id: string;
  author: string;
  role: string;
  title: string;
  category: string;
  content: string;
  upvotes: number;
  commentsCount: number;
  createdAt: string;
}

import { Router, Response } from 'express';
import { db } from '../services/db';
import { authenticateToken, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

// 1. Farmer Analytics
router.get('/farmer', authenticateToken, requireRole(['farmer']), async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const farmerId = req.user.id;
    const farmerProfile = await db.farmers.findById(farmerId);
    const myProducts = await db.products.listByFarmer(farmerId);
    const myOrders = await db.orders.listByFarmer(farmerId);
    const myTransactions = await db.transactions.listByUser(farmerId);

    // Calculate revenue metrics
    const totalEarnings = farmerProfile ? Number(farmerProfile.balance) : 0;
    const completedOrders = myOrders.filter((o: any) => o.status === 'completed');
    const totalSales = completedOrders.reduce((acc: number, curr: any) => acc + Number(curr.total_amount), 0);

    // Mock Sales Trends (Last 6 Months)
    const monthlySales = [
      { month: 'Jan', sales: totalSales * 0.1, revenue: totalSales * 0.1 * 0.95 },
      { month: 'Feb', sales: totalSales * 0.15, revenue: totalSales * 0.15 * 0.95 },
      { month: 'Mar', sales: totalSales * 0.2, revenue: totalSales * 0.2 * 0.95 },
      { month: 'Apr', sales: totalSales * 0.12, revenue: totalSales * 0.12 * 0.95 },
      { month: 'May', sales: totalSales * 0.25, revenue: totalSales * 0.25 * 0.95 },
      { month: 'Jun', sales: totalSales * 0.18, revenue: totalSales * 0.18 * 0.95 }
    ];

    // Product performance
    const productPerformance = myProducts.map((p: any) => {
      // Find orders matching this product
      // We will mock this or read it from our db
      const quantitySold = Math.floor(Math.random() * 20) + 5; // mock sold
      return {
        name: p.name,
        price: p.price,
        stock: p.quantity,
        sold: quantitySold,
        revenue: quantitySold * Number(p.price)
      };
    }).sort((a: any, b: any) => b.revenue - a.revenue).slice(0, 5);

    res.json({
      metrics: {
        balance: totalEarnings,
        totalSales,
        ordersCount: myOrders.length,
        productsCount: myProducts.length,
        rating: farmerProfile ? Number(farmerProfile.ratings) : 0.0
      },
      monthlySales,
      productPerformance,
      recentTransactions: myTransactions.slice(0, 5)
    });
  } catch (error) {
    console.error('Farmer analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch farmer analytics' });
  }
});

// 2. Buyer Analytics
router.get('/buyer', authenticateToken, requireRole(['buyer']), async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const buyerId = req.user.id;
    const buyerProfile = await db.buyers.findById(buyerId);
    const myOrders = await db.orders.listByBuyer(buyerId);
    const myTransactions = await db.transactions.listByUser(buyerId);

    const totalSpent = myOrders
      .filter((o: any) => o.payment_status === 'paid' || o.payment_status === 'verified')
      .reduce((acc: number, curr: any) => acc + Number(curr.total_amount), 0);

    res.json({
      metrics: {
        totalSpent,
        ordersCount: myOrders.length,
        walletBalance: buyerProfile ? Number(buyerProfile.balance) : 0
      },
      recentOrders: myOrders.slice(0, 5),
      recentTransactions: myTransactions.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch buyer analytics' });
  }
});

// 3. Admin Analytics
router.get('/admin', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const allUsers = await db.users.listAll();
    const allFarmers = await db.farmers.listAll();
    const allOrders = await db.orders.listAll();
    const allTransactions = await db.transactions.listAll();

    // Split stats
    const totalUsers = allUsers.length;
    const pendingFarmers = allFarmers.filter((f: any) => f.verification_status === 'pending');
    
    const paidOrders = allOrders.filter((o: any) => o.payment_status === 'paid' || o.payment_status === 'verified');
    const totalSalesVol = paidOrders.reduce((acc: number, curr: any) => acc + Number(curr.total_amount), 0);
    const totalCommission = totalSalesVol * 0.05; // 5% fee

    // Revenue history mock
    const monthlyRevenue = [
      { month: 'Jan', sales: totalSalesVol * 0.1, commission: totalCommission * 0.1 },
      { month: 'Feb', sales: totalSalesVol * 0.15, commission: totalCommission * 0.15 },
      { month: 'Mar', sales: totalSalesVol * 0.2, commission: totalCommission * 0.2 },
      { month: 'Apr', sales: totalSalesVol * 0.12, commission: totalCommission * 0.12 },
      { month: 'May', sales: totalSalesVol * 0.25, commission: totalCommission * 0.25 },
      { month: 'Jun', sales: totalSalesVol * 0.18, commission: totalCommission * 0.18 }
    ];

    res.json({
      metrics: {
        totalUsers,
        farmersCount: allFarmers.length,
        pendingFarmersCount: pendingFarmers.length,
        totalSalesVolume: totalSalesVol,
        platformCommission: totalCommission,
        ordersCount: allOrders.length
      },
      pendingFarmersList: pendingFarmers.map(f => ({
        userId: f.user_id,
        farmName: f.farm_name,
        fullName: f.full_name,
        state: f.state,
        phone: f.phone_number,
        email: f.email,
        createdAt: f.created_at
      })),
      monthlyRevenue,
      recentTransactions: allTransactions.slice(0, 10),
      recentOrders: allOrders.slice(0, 5)
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch admin analytics' });
  }
});

// 4. Admin Action: Approve/Reject Farmer
router.post('/admin/approve-farmer', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res: Response) => {
  const { farmerId, status } = req.body; // status: 'approved' | 'rejected'

  if (!farmerId || !status || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Farmer ID and valid status are required' });
  }

  try {
    await db.farmers.update(farmerId, { verification_status: status });

    await db.notifications.create(
      farmerId,
      status === 'approved' ? 'Farmer Profile Approved!' : 'Farmer Profile Rejected',
      status === 'approved'
        ? 'Congratulations, your farm profile has been approved! You can now start listing products and selling.'
        : 'Your farm profile verification was not approved. Please review your details or contact support.'
    );

    res.json({ success: true, message: `Farmer profile has been ${status}.` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update farmer status' });
  }
});

// 5. Get Notifications for User
router.get('/notifications', authenticateToken, async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const list = await db.notifications.listByUser(req.user.id);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// 6. Mark Notification as Read
router.post('/notifications/:id/read', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await db.notifications.markAsRead(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

export default router;

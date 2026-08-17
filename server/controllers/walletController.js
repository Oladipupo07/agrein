// Agrein Digital Wallet & Escrow Controller

let mockWallet = {
  userId: 'usr-farmer-01',
  availableBalance: 1485000,
  escrowHeldBalance: 320000,
  currency: 'NGN',
  transactions: [
    { id: 'txn-991', type: 'escrow_release', amount: 1350000, desc: 'Release for Order #AGR-61029 (Kano Grains)', date: '2026-08-01', status: 'completed' },
    { id: 'txn-992', type: 'deposit', amount: 500000, desc: 'Interswitch Webpay Direct Deposit', date: '2026-08-03', status: 'completed' },
    { id: 'txn-993', type: 'withdrawal', amount: 365000, desc: 'Payout to First Bank (Acc: 3048912044)', date: '2026-08-06', status: 'completed' }
  ]
};

exports.getWalletBalance = (req, res) => {
  res.json({ success: true, wallet: mockWallet });
};

exports.requestWithdrawal = (req, res) => {
  const { amount, bankName, accountNumber } = req.body;
  if (amount > mockWallet.availableBalance) {
    return res.status(400).json({ success: false, message: 'Insufficient available wallet balance' });
  }

  mockWallet.availableBalance -= amount;
  const newTxn = {
    id: `txn-${Date.now()}`,
    type: 'withdrawal',
    amount,
    desc: `Interswitch Payout to ${bankName} (${accountNumber})`,
    date: new Date().toISOString().split('T')[0],
    status: 'completed'
  };
  mockWallet.transactions.unshift(newTxn);

  res.json({ success: true, message: 'Interswitch instant payout processed', wallet: mockWallet });
};

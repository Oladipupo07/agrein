import { Router, Request, Response } from 'express';

export const walletRouter = Router();

// Mock wallet store
const mockWallet = {
  userId: 'usr_buyer_77',
  availableBalance: 450000.00,
  escrowBalance: 120000.00,
  currency: 'NGN',
  transactions: [
    {
      id: 'tx_101',
      type: 'deposit',
      amount: 500000.00,
      reference: 'AGR_ISW_1721811200',
      interswitchRef: 'ISW_PAY_8839210',
      description: 'Wallet Deposit via Interswitch Webpay',
      status: 'success',
      date: '2026-07-20T10:00:00Z',
    },
    {
      id: 'tx_102',
      type: 'escrow_hold',
      amount: 120000.00,
      reference: 'AGR_ESC_992101',
      interswitchRef: 'ISW_PAY_8839441',
      description: 'Escrow hold for 50 Bags of Hybrid Maize',
      status: 'success',
      date: '2026-07-22T14:30:00Z',
    },
    {
      id: 'tx_103',
      type: 'withdrawal',
      amount: 50000.00,
      reference: 'AGR_WTH_441209',
      interswitchRef: 'ISW_TRF_1029311',
      description: 'Payout to First Bank (Acc: ****4921)',
      status: 'success',
      date: '2026-07-23T11:15:00Z',
    },
  ],
};

/**
 * GET /api/wallet/balance
 */
walletRouter.get('/balance', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: mockWallet,
  });
});

/**
 * POST /api/wallet/deposit
 */
walletRouter.post('/deposit', (req: Request, res: Response) => {
  const { amount, interswitchRef, reference } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid deposit amount required' });
  }

  const newTx = {
    id: `tx_${Date.now()}`,
    type: 'deposit',
    amount: Number(amount),
    reference: reference || `AGR_ISW_${Date.now()}`,
    interswitchRef: interswitchRef || `ISW_REF_${Date.now()}`,
    description: 'Wallet funding via Interswitch',
    status: 'success',
    date: new Date().toISOString(),
  };

  mockWallet.availableBalance += Number(amount);
  mockWallet.transactions.unshift(newTx);

  res.json({
    success: true,
    message: 'Wallet funded successfully via Interswitch',
    data: mockWallet,
  });
});

/**
 * POST /api/wallet/withdraw
 */
walletRouter.post('/withdraw', (req: Request, res: Response) => {
  const { amount, bankCode, accountNumber } = req.body;
  if (!amount || amount > mockWallet.availableBalance) {
    return res.status(400).json({ error: 'Insufficient available wallet balance' });
  }

  mockWallet.availableBalance -= Number(amount);
  const newTx = {
    id: `tx_${Date.now()}`,
    type: 'withdrawal',
    amount: Number(amount),
    reference: `AGR_WTH_${Date.now()}`,
    interswitchRef: `ISW_TRF_${Date.now()}`,
    description: `Withdrawal to ${accountNumber} (${bankCode || 'GTBank'})`,
    status: 'success',
    date: new Date().toISOString(),
  };

  mockWallet.transactions.unshift(newTx);

  res.json({
    success: true,
    message: 'Withdrawal request submitted for processing via Interswitch Transfer API',
    data: mockWallet,
  });
});

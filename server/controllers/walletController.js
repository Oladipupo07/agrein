// Agrein Digital Wallet & Escrow Controller
// Phase C: backed by public.wallets + public.wallet_transactions.

const supabase = require('../utils/supabaseClient');

async function loadOrCreateWallet(userId) {
  // Upsert a zero-balance wallet so reads always succeed on first contact.
  await supabase.from('wallets').upsert({ user_id: userId }, { onConflict: 'user_id' });
  const { data } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  return data;
}

exports.getWalletBalance = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: 'Login required.' });

    const wallet = await loadOrCreateWallet(req.user.id);
    const { data: txns } = await supabase
      .from('wallet_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    const filteredTxns = (txns || []).filter((t) => t.wallet_id === (wallet && wallet.id));
    return res.json({
      success: true,
      wallet: {
        userId: req.user.id,
        availableBalance: Number(wallet ? wallet.available_balance : 0),
        escrowHeldBalance: Number(wallet ? wallet.escrow_held_balance : 0),
        currency: (wallet && wallet.currency) || 'NGN',
        transactions: filteredTxns.map((t) => ({
          id: t.id,
          type: t.type,
          amount: Number(t.amount),
          desc: t.description,
          date: (t.created_at || '').slice(0, 10),
          status: t.status
        }))
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.requestWithdrawal = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: 'Login required.' });

    const { amount, bankName, accountNumber } = req.body || {};
    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) {
      return res.status(400).json({ success: false, message: 'amount must be a positive number.' });
    }

    const wallet = await loadOrCreateWallet(req.user.id);
    if (!wallet || Number(wallet.available_balance) < amountNum) {
      return res.status(400).json({ success: false, message: 'Insufficient available wallet balance.' });
    }

    const reference = `WDL-${Date.now()}`;
    await supabase.from('wallets')
      .update({ available_balance: Number(wallet.available_balance) - amountNum })
      .eq('id', wallet.id);
    await supabase.from('wallet_transactions').insert({
      wallet_id: wallet.id,
      type: 'withdrawal',
      amount: amountNum,
      reference,
      description: `Payout to ${bankName || 'bank'} (${accountNumber || '—'})`,
      status: 'pending'
    });

    const updated = await loadOrCreateWallet(req.user.id);
    return res.json({
      success: true,
      message: 'Payout submitted',
      wallet: {
        userId: req.user.id,
        availableBalance: Number(updated.available_balance),
        escrowHeldBalance: Number(updated.escrow_held_balance),
        currency: updated.currency || 'NGN',
        transactions: []
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

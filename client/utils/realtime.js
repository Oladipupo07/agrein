// Agrein realtime subscriptions. One entry point: window.realtime.subscribe(user, view)
// tears down previous channels, then opens channels relevant to the caller.
// Each postgres_changes event refetches the matching slice via
// window.__AGREIN_REALTIME_REFETCH__(sliceName).

(function () {
  const channels = new Map();

  function teardown() {
    const supa = window.supabaseClient;
    if (!supa) return;
    channels.forEach((ch) => {
      try { supa.removeChannel(ch); } catch (_) { /* noop */ }
    });
    channels.clear();
  }

  function bind(table, event, filter, slice, label) {
    const supa = window.supabaseClient;
    if (!supa || !supa.channel) return;
    const ch = supa
      .channel(`${label}-${Math.random().toString(36).slice(2, 8)}`)
      .on(
        'postgres_changes',
        { event: event || '*', schema: 'public', table, filter: filter || undefined },
        () => {
          if (typeof window.__AGREIN_REALTIME_REFETCH__ === 'function') {
            try { window.__AGREIN_REALTIME_REFETCH__(slice); }
            catch (e) { console.warn(`[realtime] refetch(${slice}) failed:`, e.message); }
          }
        }
      )
      .subscribe();
    channels.set(label, ch);
  }

  function subscribe(user, view) {
    teardown();
    if (!user || !user.id) return;

    // Public marketplace product listings (everyone listening — no user filter).
    bind('products', '*', null, 'products', 'products-public');

    // Per-user orders: participant where filter would need an OR. Supabase JS
    // doesn't support OR filters directly in postgres_changes client-side, so
    // we use the simpler `buyer_id=eq.<uuid>` filter and rely on the same
    // channel mirrored for `farmer_id` on each role.
    if (user.role === 'BUYER') {
      bind('orders', '*', `buyer_id=eq.${user.id}`, 'orders', `orders-buyer-${user.id}`);
      bind('wallet_transactions', 'INSERT', null, 'wallet', `wtx-${user.id}`);
      bind('buyer_disputes', '*', `buyer_id=eq.${user.id}`, 'disputes', `disputes-${user.id}`);
      bind('notifications', 'INSERT', `user_id=eq.${user.id}`, 'notifications', `notif-${user.id}`);
      bind('wallets', '*', `user_id=eq.${user.id}`, 'wallet', `wallet-${user.id}`);
      bind('rfqs', '*', `buyer_id=eq.${user.id}`, 'rfqs', `rfqs-${user.id}`);
    } else if (user.role === 'FARMER') {
      bind('orders', '*', `farmer_id=eq.${user.id}`, 'orders', `orders-farmer-${user.id}`);
      bind('wallet_transactions', 'INSERT', null, 'wallet', `wtx-${user.id}`);
      bind('wallets', '*', `user_id=eq.${user.id}`, 'wallet', `wallet-${user.id}`);
      bind('buyer_disputes', '*', `farmer_id=eq.${user.id}`, 'disputes', `disputes-${user.id}`);
      bind('notifications', 'INSERT', `user_id=eq.${user.id}`, 'notifications', `notif-${user.id}`);
      bind('farmer_verifications', '*', `user_id=eq.${user.id}`, 'verification', `ver-${user.id}`);
      bind('rfq_bids', '*', `farmer_id=eq.${user.id}`, 'rfqBids', `rfqbids-${user.id}`);
    } else if (user.role === 'ADMIN') {
      bind('farmer_verifications', '*', null, 'verificationQueue', 'admin-verifications');
      bind('buyer_disputes', '*', null, 'disputes', 'admin-disputes');
      bind('orders', '*', null, 'orders', 'admin-orders');
      bind('profiles', '*', null, 'registeredUsers', 'admin-profiles');
      bind('wallets', '*', null, 'adminWallets', 'admin-wallets');
      bind('notifications', 'INSERT', null, 'adminNotifications', 'admin-notif');
    }

    if (view === 'marketplace') {
      // Ensure the realtime UI refetches the catalog on any products change.
      // (Already bound above; this is just a no-op noting intent.)
    }
  }

  window.realtime = { subscribe, teardown };
})();

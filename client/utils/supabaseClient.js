// Agrein client-side Supabase client (anon key, subject to RLS).
// Loaded after the @supabase/supabase-js UMD script tag from index.html.

(function () {
  try {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      console.warn('[agrein] Supabase UMD not loaded; realtime disabled.');
      window.supabaseClient = null;
      return;
    }
    window.supabaseClient = window.supabase.createClient(
      'https://hjksxxwucfnubtcellbm.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqa3N4eHd1Y2ZudWJ0Y2VsbGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4ODQ4NDAsImV4cCI6MjEwMDQ2MDg0MH0.zCTkJK75X2LMVMvU4Maon34KZPLpd5FWhF2fWImLFKY'
    );
    console.log('[agrein] Supabase client ready.');
  } catch (err) {
    console.warn('[agrein] Failed to init Supabase client:', err.message);
    window.supabaseClient = null;
  }
})();

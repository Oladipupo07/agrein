const fs = require('fs');

let code = fs.readFileSync('public/farmer-onboarding.js', 'utf8');
const isCrlf = code.includes('\r\n');
const eol = isCrlf ? '\r\n' : '\n';

// 1. Add state variables at top if not present
if (!code.includes('iswNinVerified')) {
  code = code.replace(
    'let cropTags = [];',
    'let cropTags = [];' + eol +
    'let iswNinVerified = false;' + eol +
    'let iswNinData = null;' + eol +
    'let iswCacVerified = false;' + eol +
    'let iswCacData = null;'
  );
}

// 2. Add verification helper functions
const iswFunctions = `
async function verifyNinWithInterswitch() {
  const nin = (document.getElementById('ninNumber')?.value || '').trim();
  const fullName = (document.getElementById('fullName')?.value || '').trim();
  const dob = (document.getElementById('dateOfBirth')?.value || '').trim();
  const phone = (document.getElementById('phoneNumber')?.value || '').trim();
  const fb = document.getElementById('ninIswFeedback');
  const btn = document.getElementById('btnVerifyNin');

  if (!nin || nin.length !== 11) {
    if (fb) {
      fb.style.display = 'block';
      fb.innerHTML = '<div style="background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.3);color:var(--rose-400);padding:0.6rem 0.85rem;border-radius:8px;font-size:0.8rem"><i class="fa-solid fa-triangle-exclamation"></i> Please enter a valid 11-digit NIN first.</div>';
    }
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Checking Interswitch...';
  }

  try {
    const res = await fetch('/api/kyc/verify-nin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nin, fullName, dateOfBirth: dob, phone })
    });
    const result = await res.json();
    if (!res.ok || !result.verified) {
      throw new Error(result.message || 'Interswitch NIN verification failed.');
    }

    iswNinVerified = true;
    iswNinData = result.data;

    if (fb) {
      fb.style.display = 'block';
      fb.innerHTML = \`
        <div style="background:rgba(16,185,129,0.12);border:1px solid rgba(52,211,153,0.4);border-radius:8px;padding:0.75rem 1rem;font-size:0.82rem;color:var(--text-main)">
          <div style="display:flex;align-items:center;gap:0.4rem;font-weight:700;color:var(--emerald-400)">
            <i class="fa-solid fa-circle-check"></i>
            <span>Verified via Interswitch NIMC Identity Gateway</span>
          </div>
          <div style="margin-top:0.35rem;font-size:0.78rem;color:var(--text-muted);line-height:1.4">
            <strong>Matched Record:</strong> \${escapeHtml(iswNinData.details?.fullName || fullName || 'Identity Confirmed')}<br>
            <strong>Gateway Ref:</strong> <span style="font-family:monospace;color:var(--sky-400)">\${escapeHtml(iswNinData.reference)}</span> • Status: <strong>ACTIVE</strong>
          </div>
        </div>
      \`;
    }
  } catch (err) {
    if (fb) {
      fb.style.display = 'block';
      fb.innerHTML = \`<div style="background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.3);color:var(--rose-400);padding:0.6rem 0.85rem;border-radius:8px;font-size:0.8rem"><i class="fa-solid fa-triangle-exclamation"></i> \${escapeHtml(err.message)}</div>\`;
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-shield-halved" style="color:var(--emerald-400)"></i> Verify with Interswitch';
    }
  }
}

async function verifyCacWithInterswitch() {
  const cac = (document.getElementById('cacNumber')?.value || '').trim();
  const farmName = (document.getElementById('farmName')?.value || '').trim();
  const fb = document.getElementById('cacIswFeedback');
  const btn = document.getElementById('btnVerifyCac');

  if (!cac || cac.length < 5) {
    if (fb) {
      fb.style.display = 'block';
      fb.innerHTML = '<div style="background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.3);color:var(--rose-400);padding:0.6rem 0.85rem;border-radius:8px;font-size:0.8rem"><i class="fa-solid fa-triangle-exclamation"></i> Please enter a valid CAC registration number (e.g. RC123456 or BN123456).</div>';
    }
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Checking CAC Registry...';
  }

  try {
    const res = await fetch('/api/kyc/verify-cac', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cacNumber: cac, companyName: farmName })
    });
    const result = await res.json();
    if (!res.ok || !result.verified) {
      throw new Error(result.message || 'Interswitch CAC verification failed.');
    }

    iswCacVerified = true;
    iswCacData = result.data;

    if (fb) {
      fb.style.display = 'block';
      fb.innerHTML = \`
        <div style="background:rgba(16,185,129,0.12);border:1px solid rgba(52,211,153,0.4);border-radius:8px;padding:0.75rem 1rem;font-size:0.82rem;color:var(--text-main)">
          <div style="display:flex;align-items:center;gap:0.4rem;font-weight:700;color:var(--emerald-400)">
            <i class="fa-solid fa-circle-check"></i>
            <span>Verified via Interswitch Corporate Affairs Commission Gateway</span>
          </div>
          <div style="margin-top:0.35rem;font-size:0.78rem;color:var(--text-muted);line-height:1.4">
            <strong>Registered Business:</strong> \${escapeHtml(iswCacData.companyName || farmName)}<br>
            <strong>Registration Number:</strong> \${escapeHtml(iswCacData.cacNumber)} • Status: <strong>ACTIVE</strong><br>
            <strong>Gateway Ref:</strong> <span style="font-family:monospace;color:var(--sky-400)">\${escapeHtml(iswCacData.reference)}</span>
          </div>
        </div>
      \`;
    }
  } catch (err) {
    if (fb) {
      fb.style.display = 'block';
      fb.innerHTML = \`<div style="background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.3);color:var(--rose-400);padding:0.6rem 0.85rem;border-radius:8px;font-size:0.8rem"><i class="fa-solid fa-triangle-exclamation"></i> \${escapeHtml(err.message)}</div>\`;
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-building-shield" style="color:var(--emerald-400)"></i> Verify CAC with Interswitch';
    }
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
`.replace(/\n/g, eol);

if (!code.includes('verifyNinWithInterswitch')) {
  code += eol + iswFunctions;
}

// 3. Update buildReview to show Interswitch status
code = code.replace(
  /'NIN': maskNin\(document\.getElementById\('ninNumber'\)\.value\),/,
  "'NIN': maskNin(document.getElementById('ninNumber').value) + (iswNinVerified ? ' ✓ [Interswitch Verified]' : ' [Pending Check]'),"
);

code = code.replace(
  /'CAC Number': document\.getElementById\('cacNumber'\)\.value \|\| 'Not registered'/,
  "'CAC Number': (document.getElementById('cacNumber').value ? (document.getElementById('cacNumber').value + (iswCacVerified ? ' ✓ [Interswitch Verified]' : '')) : 'Not registered')"
);

fs.writeFileSync('public/farmer-onboarding.js', code, 'utf8');
console.log('farmer-onboarding.js patched successfully!');


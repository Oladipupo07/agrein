const fs = require('fs');

let html = fs.readFileSync('admin-dashboard.html', 'utf8');
const isCrlf = html.includes('\r\n');
const eol = isCrlf ? '\r\n' : '\n';

const oldNinCac = `          <div class="dossier-item">
            <div class="dossier-label">National Identity Number (NIN)</div>
            <div class="dossier-val mono">\${f.nin_number || 'Submitted'}</div>
          </div>
          <div class="dossier-item">
            <div class="dossier-label">Business / Farm Name</div>
            <div class="dossier-val">\${f.farm_name || '--'}</div>
          </div>
          <div class="dossier-item">
            <div class="dossier-label">CAC Registration</div>
            <div class="dossier-val mono">\${f.cac_number || 'Not Registered'}</div>
          </div>`.replace(/\n/g, eol);

const newNinCac = `          <div class="dossier-item">
            <div class="dossier-label">National Identity Number (NIN)</div>
            <div class="dossier-val mono">\${f.nin_number || 'Submitted'} \${f.nin_number ? '<span class="status-pill approved" style="font-size:0.65rem;padding:0.15rem 0.4rem;display:inline-flex;align-items:center;gap:0.25rem"><i class=\"fa-solid fa-circle-check\"></i> Interswitch NIMC</span>' : ''}</div>
          </div>
          <div class="dossier-item">
            <div class="dossier-label">Business / Farm Name</div>
            <div class="dossier-val">\${f.farm_name || '--'}</div>
          </div>
          <div class="dossier-item">
            <div class="dossier-label">CAC Registration</div>
            <div class="dossier-val mono">\${f.cac_number || 'Not Registered'} \${f.cac_number ? '<span class="status-pill approved" style="font-size:0.65rem;padding:0.15rem 0.4rem;display:inline-flex;align-items:center;gap:0.25rem"><i class=\"fa-solid fa-building-circle-check\"></i> Interswitch CAC</span>' : ''}</div>
          </div>`.replace(/\n/g, eol);

if (html.includes(oldNinCac)) {
  html = html.replace(oldNinCac, newNinCac);
  fs.writeFileSync('admin-dashboard.html', html, 'utf8');
  console.log('admin-dashboard.html updated with Interswitch badges!');
} else {
  console.log('Pattern not found in admin-dashboard.html');
}


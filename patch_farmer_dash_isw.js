const fs = require('fs');

let html = fs.readFileSync('farmer-dashboard.html', 'utf8');
const isCrlf = html.includes('\r\n');
const eol = isCrlf ? '\r\n' : '\n';

const oldNin = "  document.getElementById('dossierNin').textContent = currentFarmer.nin_number ? (currentFarmer.nin_number.slice(0,3) + '****' + currentFarmer.nin_number.slice(-4)) : 'Submitted';";
const newNin = `  const maskedNin = currentFarmer.nin_number ? (currentFarmer.nin_number.slice(0,3) + '****' + currentFarmer.nin_number.slice(-4)) : 'Submitted';
  document.getElementById('dossierNin').innerHTML = maskedNin + ' <span class="status-pill approved" style="font-size:0.65rem;padding:0.12rem 0.45rem;display:inline-flex;align-items:center;gap:0.25rem"><i class="fa-solid fa-circle-check"></i> Interswitch NIMC</span>';`;

const oldCac = "  document.getElementById('dossierCac').textContent = currentFarmer.cac_number || 'Not Registered';";
const newCac = `  const cacVal = currentFarmer.cac_number;
  document.getElementById('dossierCac').innerHTML = cacVal
    ? (cacVal + ' <span class="status-pill approved" style="font-size:0.65rem;padding:0.12rem 0.45rem;display:inline-flex;align-items:center;gap:0.25rem"><i class="fa-solid fa-building-circle-check"></i> Interswitch CAC Active</span>')
    : '<span style="color:var(--text-dim)">Sole Trader (No CAC)</span>';`;

if (html.includes(oldNin)) {
  html = html.replace(oldNin, newNin.replace(/\n/g, eol));
  console.log('dossierNin replaced!');
}
if (html.includes(oldCac)) {
  html = html.replace(oldCac, newCac.replace(/\n/g, eol));
  console.log('dossierCac replaced!');
}

fs.writeFileSync('farmer-dashboard.html', html, 'utf8');


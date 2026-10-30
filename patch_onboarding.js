const fs = require('fs');

let html = fs.readFileSync('farmer-onboarding.html', 'utf8');
const isCrlf = html.includes('\r\n');
const eol = isCrlf ? '\r\n' : '\n';

// Replace NIN block
const ninOld = html.match(/<div class="form-group">\s*<label class="form-label">National Identification Number \(NIN\)[\s\S]*?id="ninNumber"[\s\S]*?<\/div>\s*<\/div>/);
if (ninOld) {
  const ninNew = `<div class="form-group">
          <label class="form-label">National Identification Number (NIN) <span class="req">*</span></label>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            <div class="input-wrap" style="flex:1;min-width:220px"><i class="input-icon fa-solid fa-fingerprint"></i><input class="form-input" id="ninNumber" type="text" placeholder="12345678901" maxlength="11" oninput="formatNin(this)" autocomplete="off"></div>
            <button type="button" class="btn-secondary" id="btnVerifyNin" onclick="verifyNinWithInterswitch()" style="white-space:nowrap;padding:0.6rem 1rem;font-size:0.82rem;font-weight:700">
              <i class="fa-solid fa-shield-halved" style="color:var(--emerald-400)"></i> Verify with Interswitch
            </button>
          </div>
          <div class="field-hint"><i class="fa-solid fa-circle-info"></i> Real-time 11-digit identity verification via Interswitch NIMC Gateway</div>
          <div id="ninIswFeedback" style="margin-top:0.65rem;display:none"></div>
        </div>`.replace(/\n/g, eol);

  html = html.replace(ninOld[0], ninNew);
  console.log('NIN replaced successfully');
} else {
  console.log('NIN regex match failed');
}

// Replace CAC block
const cacOld = html.match(/<div class="form-group">\s*<label class="form-label">CAC Registration Number[\s\S]*?id="cacNumber"[\s\S]*?<\/div>\s*<\/div>/);
if (cacOld) {
  const cacNew = `<div class="form-group">
          <label class="form-label">CAC Registration Number <span class="opt">Optional</span></label>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            <div class="input-wrap" style="flex:1;min-width:220px"><i class="input-icon fa-solid fa-hashtag"></i><input class="form-input" id="cacNumber" type="text" placeholder="RC1234567 or BN1234567"></div>
            <button type="button" class="btn-secondary" id="btnVerifyCac" onclick="verifyCacWithInterswitch()" style="white-space:nowrap;padding:0.6rem 1rem;font-size:0.82rem;font-weight:700">
              <i class="fa-solid fa-building-shield" style="color:var(--emerald-400)"></i> Verify CAC with Interswitch
            </button>
          </div>
          <div class="field-hint"><i class="fa-solid fa-circle-info"></i> Query Nigerian Corporate Affairs Commission registry in real-time via Interswitch Gateway</div>
          <div id="cacIswFeedback" style="margin-top:0.65rem;display:none"></div>
        </div>`.replace(/\n/g, eol);

  html = html.replace(cacOld[0], cacNew);
  console.log('CAC replaced successfully');
} else {
  console.log('CAC regex match failed');
}

fs.writeFileSync('farmer-onboarding.html', html, 'utf8');

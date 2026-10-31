// Agrein Farmer Onboarding JS
const API = '/api';
let currentStep = 1;
let selectedGender = 'male';
let selectedFarmType = 'Crop';
let cropTags = [];
let iswNinVerified = false;
let iswNinData = null;
let iswCacVerified = false;
let iswCacData = null;

// Nigerian States and LGAs data
const statesLgas = {
  "Abia": ["Aba North","Aba South","Arochukwu","Bende","Ikwuano","Isiala Ngwa North","Isiala Ngwa South","Isuikwuato","Obi Ngwa","Ohafia","Osisioma","Ugwunagbo","Ukwa East","Ukwa West","Umuahia North","Umuahia South","Umu Nneochi"],
  "Adamawa": ["Demsa","Fufore","Ganye","Girei","Gombi","Guyuk","Hong","Jada","Lamurde","Madagali","Maiha","Mayo Belwa","Michika","Mubi North","Mubi South","Numan","Shelleng","Song","Toungo","Yola North","Yola South"],
  "Akwa Ibom": ["Abak","Eastern Obolo","Eket","Esit Eket","Essien Udim","Etim Ekpo","Etinan","Ibeno","Ibesikpo Asutan","Ibiono-Ibom","Ika","Ikono","Ikot Abasi","Ikot Ekpene","Ini","Itu","Mbo","Mkpat-Enin","Nsit-Atai","Nsit-Ibom","Nsit-Ubium","Obot Akara","Okobo","Onna","Oron","Oruk Anam","Udung-Uko","Ukanafun","Uruan","Urue-Offong/Oruko","Uyo"],
  "Anambra": ["Aguata","Awka North","Awka South","Ayamelum","Dunukofia","Ekwusigo","Idemili North","Idemili South","Ihiala","Njikoka","Nnewi North","Nnewi South","Ogbaru","Onitsha North","Onitsha South","Orumba North","Orumba South","Oyi"],
  "Bauchi": ["Alkaleri","Bauchi","Bogoro","Damban","Darazo","Dass","Ganjuwa","Giade","Itas/Gadau","Jama'are","Katagum","Kirfi","Misau","Ningi","Shira","Tafawa Balewa","Toro","Warji","Zaki"],
  "Bayelsa": ["Brass","Ekeremor","Kolokuma/Opokuma","Nembe","Ogbia","Sagbama","Southern Ijaw","Yenagoa"],
  "Benue": ["Ado","Agatu","Apa","Buruku","Gboko","Guma","Gwer East","Gwer West","Katsina-Ala","Konshisha","Kwande","Logo","Makurdi","Obi","Ogbadibo","Ohimini","Oju","Okpokwu","Otukpo","Tarka","Ukum","Ushongo","Vandeikya"],
  "Borno": ["Abadam","Askira/Uba","Bama","Bayo","Biu","Chibok","Damboa","Dikwa","Gubio","Guzamala","Gwoza","Hawul","Jere","Kaga","Kala/Balge","Konduga","Kukawa","Kwaya Kusar","Mafa","Magumeri","Maiduguri","Marte","Mobbar","Monguno","Ngala","Nganzai","Shani"],
  "Cross River": ["Abi","Akamkpa","Akpabuyo","Bakassi","Bekwarra","Biase","Boki","Calabar Municipal","Calabar South","Etung","Ikom","Obanliku","Obubra","Obudu","Odukpani","Ogoja","Yakuur","Yala"],
  "Delta": ["Aniocha North","Aniocha South","Bomadi","Burutu","Ethiope East","Ethiope West","Ika North East","Ika South","Isoko North","Isoko South","Ndokwa East","Ndokwa West","Okpe","Oshimili North","Oshimili South","Patani","Sapele","Udu","Ughelli North","Ughelli South","Ukwuani","Uvwie","Warri North","Warri South","Warri South West"],
  "Ebonyi": ["Abakaliki","Afikpo North","Afikpo South","Ezza North","Ezza South","Ikwo","Ishielu","Ivo","Izzi","Ohaozara","Ohaukwu","Onicha"],
  "Edo": ["Akoko-Edo","Egor","Esan Central","Esan North-East","Esan South-East","Esan West","Etsako Central","Etsako East","Etsako West","Igueben","Ikpoba Okha","Orhionmwon","Oredo","Ovia North-East","Ovia South-West","Owan East","Owan West","Uhunmwonde"],
  "Ekiti": ["Ado Ekiti","Efon","Ekiti East","Ekiti South-West","Ekiti West","Emure","Gbonyin","Ido/Osi","Ijero","Ikere","Ikole","Ilejemeje","Irepodun/Ifelodun","Ise/Orun","Moba","Oye"],
  "Enugu": ["Aninri","Awgu","Enugu East","Enugu North","Enugu South","Ezeagu","Igbo Etiti","Igbo Eze North","Igbo Eze South","Isi Uzo","Nkanu East","Nkanu West","Nsukka","Oji River","Udenu","Udi","Uzo-Uwani"],
  "FCT": ["Abaji","Bwari","Gwagwalada","Kuje","Kwali","Municipal Area Council"],
  "Gombe": ["Akko","Balanga","Billiri","Dukku","Funakaye","Gombe","Kaltungo","Kwami","Nafada","Shomgom","Yamaltu/Deba"],
  "Imo": ["Aboh Mbaise","Ahiazu Mbaise","Ehime Mbano","Ezinihitte","Ideato North","Ideato South","Ihitte/Uboma","Ikeduru","Isiala Mbano","Isu","Mbaitoli","Ngor Okpala","Njaba","Nkwerre","Nwangele","Obowo","Oguta","Ohaji/Egbema","Okigwe","Orlu","Orsu","Oru East","Oru West","Owerri Municipal","Owerri North","Owerri West","Unuimo"],
  "Jigawa": ["Auyo","Babura","Biriniwa","Birnin Kudu","Buji","Dutse","Gagarawa","Garki","Gumel","Guri","Gwaram","Gwiwa","Hadejia","Jahun","Kafin Hausa","Kaugama","Kazaure","Kiri Kasama","Kiyawa","Maigatari","Malam Madori","Miga","Ringim","Roni","Sule Tankarkar","Taura","Yankwashi"],
  "Kaduna": ["Birnin Gwari","Chikun","Giwa","Igabi","Ikara","Jaba","Jema'a","Kachia","Kaduna North","Kaduna South","Kagarko","Kajuru","Kaura","Kauru","Kubau","Kudan","Lere","Makarfi","Sabon Gari","Sanga","Soba","Zangon Kataf","Zaria"],
  "Kano": ["Ajingi","Albasu","Bagwai","Bebeji","Bichi","Bunkure","Dala","Dambatta","Dawakin Kudu","Dawakin Tofa","Doguwa","Fagge","Gabasawa","Garko","Garun Mallam","Gaya","Gezawa","Gwale","Gwarzo","Kabo","Kano Municipal","Karaye","Kibiya","Kiru","Kumbotso","Kunchi","Kura","Madobi","Makoda","Minjibir","Nasarawa","Rano","Rimin Gado","Rogo","Shanono","Sumaila","Takai","Tarauni","Tofa","Tsanyawa","Tudun Wada","Ungogo","Warawa","Wudil"],
  "Katsina": ["Bakori","Batagarawa","Batsari","Baure","Bindawa","Charanchi","Dan Musa","Dandume","Danja","Daura","Dutsi","Dutsin Ma","Faskari","Funtua","Ingawa","Jibia","Kafur","Kaita","Kankara","Kankia","Katsina","Kurfi","Kusada","Mai Adua","Malumfashi","Mani","Mashi","Matazu","Musawa","Rimi","Sabuwa","Safana","Sandamu","Zango"],
  "Kebbi": ["Aleiro","Arewa Dandi","Argungu","Augie","Bagudo","Birnin Kebbi","Bunza","Dandi","Fakai","Gwandu","Jega","Kalgo","Koko/Besse","Maiyama","Ngaski","Sakaba","Shanga","Suru","Wasagu/Danko","Yauri","Zuru"],
  "Kogi": ["Adavi","Ajaokuta","Ankpa","Bassa","Dekina","Ibaji","Idah","Igalamela Odolu","Ijumu","Kabba/Bunu","Kogi","Lokoja","Mopa Muro","Ofu","Ogori/Magongo","Okehi","Okene","Olamaboro","Omala","Yagba East","Yagba West"],
  "Kwara": ["Asa","Baruten","Edu","Ekiti (Kwara)","Ifelodun","Ilorin East","Ilorin South","Ilorin West","Irepodun","Isin","Kaiama","Moro","Offa","Oke Ero","Oyun","Pategi"],
  "Lagos": ["Agege","Ajeromi-Ifelodun","Alimosho","Amuwo-Odofin","Apapa","Badagry","Epe","Eti-Osa","Ibeju-Lekki","Ifako-Ijaiye","Ikeja","Ikorodu","Kosofe","Lagos Island","Lagos Mainland","Mushin","Ojo","Oshodi-Isolo","Shomolu","Surulere"],
  "Nasarawa": ["Akwanga","Awe","Doma","Karu","Keana","Keffi","Kokona","Lafia","Nasarawa","Nasarawa Egon","Obi","Toto","Wamba"],
  "Niger": ["Agaie","Agwara","Bida","Borgu","Bosso","Chanchaga","Edati","Gbako","Gurara","Katcha","Kontagora","Lapai","Lavun","Magama","Mariga","Mashegu","Mokwa","Moya","Paikoro","Rafi","Rijau","Shiroro","Suleja","Tafa","Wushishi"],
  "Ogun": ["Abeokuta North","Abeokuta South","Ado-Odo/Ota","Egbado North","Egbado South","Ewekoro","Ifo","Ijebu East","Ijebu North","Ijebu North East","Ijebu Ode","Ikenne","Imeko Afon","Ipokia","Obafemi Owode","Odeda","Odogbolu","Ogun Waterside","Remo North","Shagamu"],
  "Ondo": ["Akoko North-East","Akoko North-West","Akoko South-East","Akoko South-West","Akure North","Akure South","Ese Odo","Idanre","Ifedore","Ilaje","Ile Oluji/Okeigbo","Irele","Odigbo","Okitipupa","Ondo East","Ondo West","Ose","Owo"],
  "Osun": ["Aiyedade","Aiyedire","Atakumosa East","Atakumosa West","Boluwaduro","Boripe","Ede North","Ede South","Egbedore","Ejigbo","Ife Central","Ife East","Ife North","Ife South","Ifedayo","Ifelodun","Ila","Ilesa East","Ilesa West","Irepodun","Irewole","Isokan","Iwo","Obokun","Odo Otin","Ola Oluwa","Olorunda","Oriade","Orolu","Osogbo"],
  "Oyo": ["Afijio","Akinyele","Atiba","Atisbo","Egbeda","Ibadan North","Ibadan North-East","Ibadan North-West","Ibadan South-East","Ibadan South-West","Ibarapa Central","Ibarapa East","Ibarapa North","Ido","Irepo","Iseyin","Itesiwaju","Iwajowa","Kajola","Lagelu","Ogbomosho North","Ogbomosho South","Ogo Oluwa","Olorunsogo","Oluyole","Ona Ara","Orelope","Orire","Oyo East","Oyo West","Saki East","Saki West","Surulere (Oyo)"],
  "Plateau": ["Barkin Ladi","Bassa","Bokkos","Jos East","Jos North","Jos South","Kanam","Kanke","Langtang North","Langtang South","Mangu","Mikang","Pankshin","Qua'an Pan","Riyom","Shendam","Wase"],
  "Rivers": ["Abua/Odual","Ahoada East","Ahoada West","Akuku-Toru","Andoni","Asari-Toru","Bonny","Degema","Eleme","Emohua","Etche","Gokana","Ikwerre","Khana","Obio/Akpor","Ogba/Egbema/Ndoni","Ogu/Bolo","Okrika","Omuma","Opobo/Nkoro","Oyigbo","Port Harcourt","Tai"],
  "Sokoto": ["Binji","Bodinga","Dange Shuni","Gada","Goronyo","Gudu","Gwadabawa","Illela","Isa","Kebbe","Kware","Rabah","Sabon Birni","Shagari","Silame","Sokoto North","Sokoto South","Tambuwal","Tangaza","Tureta","Wamako","Wurno","Yabo"],
  "Taraba": ["Ardo Kola","Bali","Donga","Gashaka","Gassol","Ibi","Jalingo","Karim Lamido","Kumi","Lau","Sardauna","Takum","Ussa","Wukari","Yorro","Zing"],
  "Yobe": ["Bade","Bursari","Damaturu","Fika","Fune","Geidam","Gujba","Gulani","Jakusko","Karasuwa","Machina","Nangere","Nguru","Potiskum","Tarmua","Yunusari","Yusufari"],
  "Zamfara": ["Anka","Bakura","Birnin Magaji/Kiyaw","Bukkuyum","Bungudu","Gummi","Gusau","Kaura Namoda","Maradun","Maru","Shinkafi","Talata Mafara","Tsafe","Zurmi"]
};

function populateStates() {
  const selects = ['stateSelect', 'farmStateSelect'];
  selects.forEach(function(id) {
    const el = document.getElementById(id);
    if (!el) return;
    Object.keys(statesLgas).sort().forEach(function(state) {
      const opt = document.createElement('option');
      opt.value = state;
      opt.textContent = state;
      el.appendChild(opt);
    });
  });
}

function populateLGA(state, targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.innerHTML = '<option value="">-- Select LGA --</option>';
  const lgas = statesLgas[state] || [];
  lgas.forEach(function(lga) {
    const opt = document.createElement('option');
    opt.value = lga;
    opt.textContent = lga;
    el.appendChild(opt);
  });
}

function toggleTheme() {
  const curr = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = curr === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('agrein_theme', next);
}

function selectGender(g) {
  selectedGender = g;
  ['Male','Female','Other'].forEach(function(id) {
    const el = document.getElementById('gender' + id);
    if (el) el.classList.toggle('selected', id.toLowerCase() === g);
  });
}

function selectFarmType(type) {
  selectedFarmType = type;
  const map = { Crop: 'ftCrop', Livestock: 'ftLivestock', Mixed: 'ftMixed', Aquaculture: 'ftAquaculture' };
  Object.keys(map).forEach(function(k) {
    const el = document.getElementById(map[k]);
    if (el) el.classList.toggle('selected', k === type);
  });
}

function formatNin(input) {
  input.value = input.value.replace(/\D/g, '').slice(0, 11);
}

function formatBvn(input) {
  input.value = input.value.replace(/\D/g, '').slice(0, 11);
}

function addCropTag(e) {
  if (e.key !== 'Enter' && e.key !== ',') return;
  e.preventDefault();
  const input = document.getElementById('cropsInput');
  const val = (input.value || '').trim().replace(/,$/, '');
  if (!val) return;
  cropTags.push(val);
  input.value = '';
  renderCropTags();
}

function removeCrop(i) {
  cropTags.splice(i, 1);
  renderCropTags();
}

function renderCropTags() {
  const container = document.getElementById('cropsTags');
  if (!container) return;
  container.innerHTML = cropTags.map(function(tag, i) {
    return '<span class="crop-tag">' + tag + '<button onclick="removeCrop(' + i + ')" type="button">x</button></span>';
  }).join('');
}

function toggleNoCac(checked) {
  const cacInput = document.getElementById('cacNumber');
  if (cacInput) {
    cacInput.disabled = checked;
    if (checked) cacInput.value = '';
  }
}

function updateProgress(step) {
  const pct = Math.round(((step - 1) / 5) * 100);
  const bar = document.getElementById('progressBar');
  const pctEl = document.getElementById('progressPct');
  if (bar) bar.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct + '%';

  for (let i = 1; i <= 5; i++) {
    const nav = document.getElementById('stepNav' + i);
    if (!nav) continue;
    nav.classList.remove('active', 'done');
    if (i < step) nav.classList.add('done');
    else if (i === step) nav.classList.add('active');
  }
}

function showPanel(num) {
  document.querySelectorAll('.step-panel').forEach(function(p) { p.classList.remove('active'); });
  const panel = document.getElementById('panel' + num) || document.getElementById('panelSuccess');
  if (panel) panel.classList.add('active');
  currentStep = num;
  updateProgress(num);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showErr(stepNum, msg) {
  const errEl = document.getElementById('err' + stepNum);
  const msgEl = document.getElementById('errMsg' + stepNum);
  if (errEl) errEl.classList.remove('hidden');
  if (msgEl) msgEl.textContent = msg;
}

function hideErr(stepNum) {
  const errEl = document.getElementById('err' + stepNum);
  if (errEl) errEl.classList.add('hidden');
}

function validateStep(step) {
  hideErr(step);
  if (step === 1) {
    const fullName = (document.getElementById('fullName') || {}).value?.trim();
    const phone = document.getElementById('phoneNumber').value.trim();
    if (!fullName) { showErr(1, 'Full legal detail name is required.'); return false; }
    const dob = document.getElementById('dateOfBirth').value;
    const addr = document.getElementById('homeAddress').value.trim();
    const state = document.getElementById('stateSelect').value;
    const lga = document.getElementById('lgaSelect').value;
    if (!phone) { showErr(1, 'Phone number is required.'); return false; }
    if (!dob) { showErr(1, 'Date of birth is required.'); return false; }
    if (!addr) { showErr(1, 'Home address is required.'); return false; }
    if (!state) { showErr(1, 'Please select your state.'); return false; }
    if (!lga) { showErr(1, 'Please select your LGA.'); return false; }
  }
  if (step === 2) {
    const nin = document.getElementById('ninNumber').value.trim();
    if (!nin || nin.length !== 11) { showErr(2, 'A valid 11-digit NIN is required.'); return false; }
  }
  if (step === 3) {
    const farmName = document.getElementById('farmName').value.trim();
    const farmState = document.getElementById('farmStateSelect').value;
    const farmLga = document.getElementById('farmLgaSelect').value;
    const farmLocation = (document.getElementById('farmLocation') || {}).value?.trim();
    const yrs = document.getElementById('yearsExp').value;
    if (!farmLocation) { showErr(3, 'Farm / Business location address is required.'); return false; }
    if (!farmName) { showErr(3, 'Farm name is required.'); return false; }
    if (!farmState) { showErr(3, 'Please select your farm state.'); return false; }
    if (!farmLga) { showErr(3, 'Please select your farm LGA.'); return false; }
    if (!yrs && yrs !== '0') { showErr(3, 'Years of experience is required.'); return false; }
  }
  return true;
}

function nextStep(step) {
  if (!validateStep(step)) return;
  if (step === 4) {
    buildReview();
    showPanel(5);
    return;
  }
  showPanel(step + 1);
}

function prevStep(step) {
  showPanel(step - 1);
}

function buildReview() {
  const r = {
    personal: {
      'Legal Name': document.getElementById('fullName')?.value || '-',
      'Phone': document.getElementById('phoneNumber').value,
      'Date of Birth': document.getElementById('dateOfBirth').value,
      'Gender': selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1),
      'Address': document.getElementById('homeAddress').value,
      'State': document.getElementById('stateSelect').value,
      'LGA': document.getElementById('lgaSelect').value
    },
    identity: {
      'NIN': maskNin(document.getElementById('ninNumber').value) + (iswNinVerified ? ' ✓ [Verified]' : ' [Pending Check]'),
      'BVN': document.getElementById('bvnNumber').value ? maskNin(document.getElementById('bvnNumber').value) : 'Not provided'
    },
    farm: {
      'Farm Name': document.getElementById('farmName').value,
      'Farm State': document.getElementById('farmStateSelect').value,
      'Farm LGA': document.getElementById('farmLgaSelect').value,
      'Business Location': (document.getElementById('farmLocation')?.value || '-'),
      'Farm Size': (document.getElementById('farmSize').value || 'Not specified') + (document.getElementById('farmSize').value ? ' acres' : ''),
      'Farm Type': selectedFarmType,
      'Years of Experience': document.getElementById('yearsExp').value + ' yrs',
      'Crops/Products': cropTags.length > 0 ? cropTags.join(', ') : 'Not specified',
      'Plans to Sell': document.getElementById('intendedProducts').value || 'Not specified'
    },
    business: {
      'CAC Number': (document.getElementById('cacNumber').value ? (document.getElementById('cacNumber').value + (iswCacVerified ? ' ✓ [Verified]' : '')) : 'Not registered')
    }
  };

  renderReviewSection('reviewPersonal', r.personal);
  renderReviewSection('reviewIdentity', r.identity);
  renderReviewSection('reviewFarm', r.farm);
  renderReviewSection('reviewBusiness', r.business);
}

function maskNin(val) {
  if (!val) return '';
  return val.slice(0, 3) + '****' + val.slice(-4);
}

function renderReviewSection(id, data) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = Object.entries(data).map(function(kv) {
    return '<div class="review-item"><div class="review-key">' + kv[0] + '</div><div class="review-val">' + (kv[1] || '-') + '</div></div>';
  }).join('');
}

function toggleSubmitBtn() {
  const chk = document.getElementById('declarationCheck');
  const btn = document.getElementById('submitBtn');
  if (btn) btn.disabled = !chk.checked;
}

async function submitOnboarding() {
  const token = localStorage.getItem('agrein_token');
  if (!token) {
    alert('Session expired. Please log in again.');
    window.location.href = '/login';
    return;
  }

  const btn = document.getElementById('submitBtn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-circle-notch" style="animation:spin .8s linear infinite"></i> Submitting...'; }

  const payload = {
    full_name: (document.getElementById('fullName') || {}).value?.trim(),
    phone_number: document.getElementById('phoneNumber').value.trim(),
    date_of_birth: document.getElementById('dateOfBirth').value,
    gender: selectedGender,
    address: document.getElementById('homeAddress').value.trim(),
    state: document.getElementById('stateSelect').value,
    lga: document.getElementById('lgaSelect').value,
    nin_number: document.getElementById('ninNumber').value.trim(),
    bvn_number: document.getElementById('bvnNumber').value.trim() || null,
    farm_name: document.getElementById('farmName').value.trim(),
    farm_state: document.getElementById('farmStateSelect').value,
    farm_lga: document.getElementById('farmLgaSelect').value,
    farm_location: (document.getElementById('farmLocation') || {}).value?.trim(),
    farm_size_acres: parseFloat(document.getElementById('farmSize').value) || 0,
    farm_type: selectedFarmType,
    crops_produced: cropTags,
    years_experience: parseInt(document.getElementById('yearsExp').value) || 1,
    intended_products: document.getElementById('intendedProducts').value.trim(),
    cac_number: document.getElementById('cacNumber').value.trim() || null
  };

  try {
    const res = await fetch(API + '/farmer/onboarding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Submission failed.');

    try {
      const stored = JSON.parse(localStorage.getItem('agrein_user') || '{}');
      stored.full_name = payload.full_name || stored.full_name;
      stored.phone_number = payload.phone_number || stored.phone_number;
      stored.state = payload.state || stored.state;
      stored.lga = payload.lga || stored.lga;
      stored.address = payload.address || stored.address;
      stored.farm_name = payload.farm_name || stored.farm_name;
      stored.farm_location = payload.farm_location || stored.farm_location;
      stored.farm_state = payload.farm_state || stored.farm_state;
      stored.farm_lga = payload.farm_lga || stored.farm_lga;
      stored.cac_number = payload.cac_number || stored.cac_number;
      stored.verification_status = 'PENDING_REVIEW';
      localStorage.setItem('agrein_user', JSON.stringify(stored));
    } catch (_) {}

    // Show success screen
    document.querySelectorAll('.step-panel').forEach(function(p) { p.classList.remove('active'); });
    const success = document.getElementById('panelSuccess');
    if (success) success.classList.add('active');
    document.getElementById('progressBar').style.width = '100%';
    document.getElementById('progressPct').textContent = '100%';
    for (let i = 1; i <= 5; i++) {
      const nav = document.getElementById('stepNav' + i);
      if (nav) { nav.classList.remove('active'); nav.classList.add('done'); }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    const errEl = document.getElementById('err5');
    const msgEl = document.getElementById('errMsg5');
    if (errEl) errEl.classList.remove('hidden');
    if (msgEl) msgEl.textContent = err.message;
    if (btn) {
      const chk = document.getElementById('declarationCheck');
      btn.disabled = !chk.checked;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i><span>Submit for Review</span>';
    }
  }
}

function initNavSession() {
  const userRaw = localStorage.getItem('agrein_user');
  if (userRaw) {
    try {
      const u = JSON.parse(userRaw);
      const nameEl = document.getElementById('fullName');
      if (nameEl && !nameEl.value && u.full_name) {
        nameEl.value = u.full_name;
      }
    } catch (_) {}
  }
  const navEl = document.getElementById('navSession');
  if (!navEl) return;
  if (!userRaw) {
    navEl.innerHTML = '<a href="/login" style="color:#34d399;text-decoration:none;font-size:.75rem;font-weight:700">Sign In</a>';
    return;
  }
  try {
    const u = JSON.parse(userRaw);
    const name = u.full_name || u.email || 'Farmer';
    navEl.innerHTML = '<span style="font-size:.75rem;color:#94a3b8">Logged in as <strong style="color:#34d399">' + name + '</strong></span>';
  } catch (_) {
    navEl.textContent = '';
  }
}

window.addEventListener('DOMContentLoaded', function() {
  populateStates();
  updateProgress(1);

  // Guard: if not logged in, redirect to login
  const token = localStorage.getItem('agrein_token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  // Decode JWT payload (no signature verification — display only)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Accept FARMER (server role for sellers) and SELLER (UI alias)
    const role = (payload.role || '').toUpperCase();
    if (role && role !== 'FARMER' && role !== 'SELLER') {
      // Buyers and admins don't belong here
      window.location.href = '/';
      return;
    }
  } catch (_) {
    // Malformed token — let server validate on submit
  }

  initNavSession();

  // Pre-fill phone number from stored profile if available
  const userRaw = localStorage.getItem('agrein_user');
  if (userRaw) {
    try {
      const u = JSON.parse(userRaw);
      if (u.phone_number) {
        const phoneEl = document.getElementById('phoneNumber');
        if (phoneEl) phoneEl.value = u.phone_number;
      }
    } catch (_) {}
  }
});


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
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Verifying...';
  }

  try {
    const res = await fetch('/api/kyc/verify-nin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nin, fullName, dateOfBirth: dob, phone })
    });
    const result = await res.json();
    if (!res.ok || !result.verified) {
      throw new Error(result.message || 'NIN verification failed.');
    }

    iswNinVerified = true;
    iswNinData = result.data;

    if (fb) {
      fb.style.display = 'block';
      fb.innerHTML = `
        <div style="background:rgba(16,185,129,0.12);border:1px solid rgba(52,211,153,0.4);border-radius:8px;padding:0.75rem 1rem;font-size:0.82rem;color:var(--text-main)">
          <div style="display:flex;align-items:center;gap:0.4rem;font-weight:700;color:var(--emerald-400)">
            <i class="fa-solid fa-circle-check"></i>
            <span>NIN Verified Successfully</span>
          </div>
          <div style="margin-top:0.35rem;font-size:0.78rem;color:var(--text-muted);line-height:1.4">
            <strong>Matched Record:</strong> ${escapeHtml(iswNinData.details?.fullName || fullName || 'Identity Confirmed')}<br>
            <strong>Reference:</strong> <span style="font-family:monospace;color:var(--emerald-600)">${escapeHtml(iswNinData.reference)}</span> • Status: <strong>ACTIVE</strong>
          </div>
        </div>
      `;
    }
  } catch (err) {
    if (fb) {
      fb.style.display = 'block';
      fb.innerHTML = `<div style="background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.3);color:var(--rose-400);padding:0.6rem 0.85rem;border-radius:8px;font-size:0.8rem"><i class="fa-solid fa-triangle-exclamation"></i> ${escapeHtml(err.message)}</div>`;
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Verify';
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
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Verifying...';
  }

  try {
    const res = await fetch('/api/kyc/verify-cac', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cacNumber: cac, companyName: farmName })
    });
    const result = await res.json();
    if (!res.ok || !result.verified) {
      throw new Error(result.message || 'CAC verification failed.');
    }

    iswCacVerified = true;
    iswCacData = result.data;

    if (fb) {
      fb.style.display = 'block';
      fb.innerHTML = `
        <div style="background:rgba(16,185,129,0.12);border:1px solid rgba(52,211,153,0.4);border-radius:8px;padding:0.75rem 1rem;font-size:0.82rem;color:var(--text-main)">
          <div style="display:flex;align-items:center;gap:0.4rem;font-weight:700;color:var(--emerald-400)">
            <i class="fa-solid fa-circle-check"></i>
            <span>CAC Registration Verified</span>
          </div>
          <div style="margin-top:0.35rem;font-size:0.78rem;color:var(--text-muted);line-height:1.4">
            <strong>Registered Business:</strong> ${escapeHtml(iswCacData.companyName || farmName)}<br>
            <strong>Registration Number:</strong> ${escapeHtml(iswCacData.cacNumber)} • Status: <strong>ACTIVE</strong><br>
            <strong>Reference:</strong> <span style="font-family:monospace;color:var(--emerald-600)">${escapeHtml(iswCacData.reference)}</span>
          </div>
        </div>
      `;
    }
  } catch (err) {
    if (fb) {
      fb.style.display = 'block';
      fb.innerHTML = `<div style="background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.3);color:var(--rose-400);padding:0.6rem 0.85rem;border-radius:8px;font-size:0.8rem"><i class="fa-solid fa-triangle-exclamation"></i> ${escapeHtml(err.message)}</div>`;
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-building-shield"></i> Verify';
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

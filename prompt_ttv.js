const GAS_URL = 'https://script.google.com/macros/s/AKfycbxdIpHkaifXYDS3Xs28xwLyp-fIoFYV-FJYaMeO_sP1x46NOviDziGFJ5CCFRUJMQks9Q/exec';

let characters = [];
let presets = [];
let favorites = [];

function toggleFavorite(){
  const select = document.getElementById('preset_select');
  if(select.value === ''){
    alert('Pilih preset dulu!');
    return;
  }
  const index = select.value;
  const preset = presets[index];
  preset.favorite = !preset.favorite;
  // Update ke GAS
  const xhr = new XMLHttpRequest();
  xhr.open('POST', GAS_URL, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        loadPresets(); // Reload
        alert('Favorit diupdate! ⭐');
      } else {
        alert('Error updating favorite: ' + xhr.status + ' - ' + xhr.responseText);
      }
    }
  };
  xhr.send('action=updateFavorite&index=' + index + '&favorite=' + preset.favorite);
}



function loadPresets(){
  const xhr = new XMLHttpRequest();
  xhr.open('POST', GAS_URL, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          presets = response.filter(p => !p.favorite);
          favorites = response.filter(p => p.favorite);
          updatePresetSelect();
        } catch (e) {
          alert('Error parsing presets: ' + e.message);
        }
      } else {
        alert('Error loading presets: ' + xhr.status + ' - ' + xhr.responseText);
      }
    }
  };
  xhr.send('action=getPresets');
}

function updateCharSelect(){
  const select = document.getElementById('char_select');
  select.innerHTML = '<option value="">Pilih Karakter...</option>';
  characters.forEach((item, index) => {
    if(item.char_id){
      select.innerHTML += `<option value="${index}">${item.char_id}</option>`;
    }
  });
}

function loadCharacter(){
  const selectedIndex = document.getElementById('char_select').value;
  if(selectedIndex !== ''){
    const item = characters[selectedIndex];
    alert('Karakter ' + item.char_id + ' dipilih. Isi detail lalu generate prompt.');
  }
}

function savePreset(){
  const name = document.getElementById('preset_name').value.trim();
  if(!name){
    alert('Masukkan nama preset!');
    return;
  }
  const preset = {
    name: name,
    dialog_select: document.getElementById('dialog_select').value,
    dialog_custom: document.getElementById('dialog_custom').value,
    dialog_voice_over: document.getElementById('dialog_voice_over').value,
    rasio_video: getFieldValue('rasio_video'),
    gaya_seni_inti: getFieldValue('gaya_seni_inti'),
    aliran_artistik: getFieldValue('aliran_artistik'),
    palet_warna: getFieldValue('palet_warna'),
    pencahayaan: getFieldValue('pencahayaan'),
    arketipe_karakter: getFieldValue('arketipe_karakter'),
    spesies_bentuk: getFieldValue('spesies_bentuk'),
    atribut_unik: getFieldValue('atribut_unik'),
    genre_musik: getFieldValue('genre_musik'),
    desain_suara: getFieldValue('desain_suara'),
    mood_dominan: getFieldValue('mood_dominan'),
    tekstur_kualitas: getFieldValue('tekstur_kualitas'),
    komposisi_bidikan: getFieldValue('komposisi_bidikan'),
    sudut_kamera: getFieldValue('sudut_kamera'),
    pergerakan_kamera: getFieldValue('pergerakan_kamera'),
    lensa_fokus: getFieldValue('lensa_fokus'),
    genre_lingkungan: getFieldValue('genre_lingkungan'),
    lokasi_spesifik: getFieldValue('lokasi_spesifik'),
    skala_arsitektur: getFieldValue('skala_arsitektur'),
    favorite: document.getElementById('preset_favorite').checked
  };
  // Cek jika nama sudah ada
  const existingIndex = presets.findIndex(p => p.name === name);
  if(existingIndex !== -1){
    if(confirm(`Preset dengan nama "${name}" sudah ada. Anda ingin update presetnya?`)){
      presets[existingIndex] = preset;
      alert('Preset diupdate! 💾');
    } else {
      return; // Batal save
    }
  } else {
    presets.push(preset);
    alert('Preset disimpan! 💾');
  }
  // Simpan ke GAS
  const xhr = new XMLHttpRequest();
  xhr.open('POST', GAS_URL, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        loadPresets(); // Reload dari GAS
      } else {
        alert('Error saving preset: ' + xhr.status + ' - ' + xhr.responseText);
      }
    }
  };
  xhr.send('action=updatePreset&data=' + encodeURIComponent(JSON.stringify(preset)));
}
function loadPresets(){
  const xhr = new XMLHttpRequest();
  xhr.open('POST', GAS_URL, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          presets = response.filter(p => !p.favorite);
          favorites = response.filter(p => p.favorite);
          updatePresetSelect();
        } catch (e) {
          alert('Error parsing presets: ' + e.message);
        }
      } else {
        alert('Error loading presets: ' + xhr.status + ' - ' + xhr.responseText);
      }
    }
  };
  xhr.send('action=getPresets');
}

function updatePresetSelect(){
  const list = document.getElementById('preset_list');
  if(!list) return; // Cek jika element ada
  list.innerHTML = '';
  // Favorit dulu
  if(favorites.length > 0){
    list.innerHTML += '<h4>⭐ Favorit Preset</h4>';
    favorites.forEach((fav, index) => {
      list.innerHTML += `
        <div style="display: flex; align-items: center; justify-content: space-between; margin: 5px 0; padding: 5px; border-bottom: 1px solid #e5e7eb;">
          <span>${fav.name}</span>
          <div>
            <input type="checkbox" checked onchange="toggleFavorite(${index}, true)">
            <button class="btn" onclick="loadPresetFromList(${index}, true)">Load</button>
          </div>
        </div>
      `;
    });
  }
  // Preset biasa
  if(presets.length > 0){
    list.innerHTML += '<h4>📂 Preset Biasa</h4>';
    presets.forEach((preset, index) => {
      list.innerHTML += `
        <div style="display: flex; align-items: center; justify-content: space-between; margin: 5px 0; padding: 5px; border-bottom: 1px solid #e5e7eb;">
          <span>${preset.name}</span>
          <div>
            <input type="checkbox" onchange="toggleFavorite(${index}, false)">
            <button class="btn" onclick="loadPresetFromList(${index}, false)">Load</button>
          </div>
        </div>
      `;
    });
  }
  if(favorites.length === 0 && presets.length === 0){
    list.innerHTML = '<p>Tidak ada preset.</p>';
  }
}

  
function loadPreset(){
  const select = document.getElementById('preset_select');
  const favSelect = document.getElementById('favorite_select');
  let preset;
  if(select.value !== ''){
    preset = presets[select.value];
  } else if(favSelect.value !== ''){
    preset = favorites[favSelect.value];
  } else {
    return;
  }
  // Load ke form
  document.getElementById('dialog_select').value = preset.data.dialog_select;
  toggleDialog();
  document.getElementById('dialog_custom').value = preset.data.dialog_custom;
  document.getElementById('dialog_voice_over').value = preset.data.dialog_voice_over;
  setDropdown('rasio_video', preset.data.rasio_video);
  setDropdown('gaya_seni_inti', preset.data.gaya_seni_inti);
  setDropdown('aliran_artistik', preset.data.aliran_artistik);
  setDropdown('palet_warna', preset.data.palet_warna);
  setDropdown('pencahayaan', preset.data.pencahayaan);
  setDropdown('arketipe_karakter', preset.data.arketipe_karakter);
  setDropdown('spesies_bentuk', preset.data.spesies_bentuk);
  setDropdown('atribut_unik', preset.data.atribut_unik);
  setDropdown('genre_musik', preset.data.genre_musik);
  setDropdown('desain_suara', preset.data.desain_suara);
  setDropdown('mood_dominan', preset.data.mood_dominan);
  setDropdown('tekstur_kualitas', preset.data.tekstur_kualitas);
  setDropdown('komposisi_bidikan', preset.data.komposisi_bidikan);
  setDropdown('sudut_kamera', preset.data.sudut_kamera);
  setDropdown('pergerakan_kamera', preset.data.pergerakan_kamera);
  setDropdown('lensa_fokus', preset.data.lensa_fokus);
  setDropdown('genre_lingkungan', preset.data.genre_lingkungan);
  setDropdown('lokasi_spesifik', preset.data.lokasi_spesifik);
  setDropdown('skala_arsitektur', preset.data.skala_arsitektur);
  alert('Preset dimuat! 📂');
}

function randomizeOptions(){
  const selects = [
    'rasio_video_select', 'gaya_seni_inti_select', 'aliran_artistik_select', 'palet_warna_select',
    'pencahayaan_select', 'arketipe_karakter_select', 'spesies_bentuk_select', 'atribut_unik_select',
    'genre_musik_select', 'desain_suara_select', 'mood_dominan_select', 'tekstur_kualitas_select',
    'komposisi_bidikan_select', 'sudut_kamera_select', 'pergerakan_kamera_select', 'lensa_fokus_select',
    'genre_lingkungan_select', 'lokasi_spesifik_select', 'skala_arsitektur_select'
  ];
  selects.forEach(id => {
    const select = document.getElementById(id);
    const options = select.options;
    const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1; // Skip first empty
    select.selectedIndex = randomIndex;
    toggleCustom(id.replace('_select', ''));
  });
  // Random dialog
  const dialogs = ['diam', 'custom', 'voice_over'];
  document.getElementById('dialog_select').value = dialogs[Math.floor(Math.random() * dialogs.length)];
  toggleDialog();
  alert('Options diacak! 🎲');
}

function loadRandomPreset(){
  const allPresets = presets.concat(favorites);
  if(allPresets.length === 0){
    alert('Tidak ada preset!');
    return;
  }
  const randomIndex = Math.floor(Math.random() * allPresets.length);
  const preset = allPresets[randomIndex];
  // Load seperti loadPreset
  document.getElementById('dialog_select').value = preset.data.dialog_select;
  toggleDialog();
  document.getElementById('dialog_custom').value = preset.data.dialog_custom;
  document.getElementById('dialog_voice_over').value = preset.data.dialog_voice_over;
  setDropdown('rasio_video', preset.data.rasio_video);
  setDropdown('gaya_seni_inti', preset.data.gaya_seni_inti);
  setDropdown('aliran_artistik', preset.data.aliran_artistik);
  setDropdown('palet_warna', preset.data.palet_warna);
  setDropdown('pencahayaan', preset.data.pencahayaan);
  setDropdown('arketipe_karakter', preset.data.arketipe_karakter);
  setDropdown('spesies_bentuk', preset.data.spesies_bentuk);
  setDropdown('atribut_unik', preset.data.atribut_unik);
  setDropdown('genre_musik', preset.data.genre_musik);
  setDropdown('desain_suara', preset.data.desain_suara);
  setDropdown('mood_dominan', preset.data.mood_dominan);
  setDropdown('tekstur_kualitas', preset.data.tekstur_kualitas);
  setDropdown('komposisi_bidikan', preset.data.komposisi_bidikan);
  setDropdown('sudut_kamera', preset.data.sudut_kamera);
  setDropdown('pergerakan_kamera', preset.data.pergerakan_kamera);
  setDropdown('lensa_fokus', preset.data.lensa_fokus);
  setDropdown('genre_lingkungan', preset.data.genre_lingkungan);
  setDropdown('lokasi_spesifik', preset.data.lokasi_spesifik);
  setDropdown('skala_arsitektur', preset.data.skala_arsitektur);
  alert('Preset acak dimuat! 🎯');
}

function generatePrompt(){
  const selectedIndex = document.getElementById('char_select').value;
  if(selectedIndex === ''){
    alert('Pilih karakter dulu!');
    return;
  }
  const char = characters[selectedIndex];
  const dialogSelect = document.getElementById('dialog_select').value;
  let dialog = '';
  if(dialogSelect === 'custom'){
    dialog = document.getElementById('dialog_custom').value.trim();
  } else if(dialogSelect === 'voice_over'){
    dialog = 'Voice Over: ' + document.getElementById('dialog_voice_over').value.trim();
  }

  // Collect optional fields
  const fields = {
    rasio_video: getFieldValue('rasio_video'),
    gaya_seni_inti: getFieldValue('gaya_seni_inti'),
    aliran_artistik: getFieldValue('aliran_artistik'),
    palet_warna: getFieldValue('palet_warna'),
    pencahayaan: getFieldValue('pencahayaan'),
    arketipe_karakter: getFieldValue('arketipe_karakter'),
    spesies_bentuk: getFieldValue('spesies_bentuk'),
    atribut_unik: getFieldValue('atribut_unik'),
    genre_musik: getFieldValue('genre_musik'),
    desain_suara: getFieldValue('desain_suara'),
    mood_dominan: getFieldValue('mood_dominan'),
    tekstur_kualitas: getFieldValue('tekstur_kualitas'),
    komposisi_bidikan: getFieldValue('komposisi_bidikan'),
    sudut_kamera: getFieldValue('sudut_kamera'),
    pergerakan_kamera: getFieldValue('pergerakan_kamera'),
    lensa_fokus: getFieldValue('lensa_fokus'),
    genre_lingkungan: getFieldValue('genre_lingkungan'),
    lokasi_spesifik: getFieldValue('lokasi_spesifik'),
    skala_arsitektur: getFieldValue('skala_arsitektur')
  };

  // Build prompt in English, directly for video generation
  let prompt = `Create a cinematic video of a character named ${char.char_id}, with physical attributes ${char.attr_fisik}, wearing ${char.cloth_id}, speaking in a ${char.voice_id} voice, in a ${char.style_id} visual style.`;

  if(dialog){
    prompt += ` The character says: "${dialog}".`;
  }

  prompt += ' The video should be detailed and immersive.';

  // Add optional details if filled
  const details = [];
  for(const [key, value] of Object.entries(fields)){
    if(value){
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      details.push(`${label}: ${value}`);
    }
  }
  if(details.length > 0){
    prompt += ' Additional details: ' + details.join(', ') + '.';
  }

  document.getElementById('prompt_output').value = prompt;
  alert('Prompt Gemini Video berhasil di-generate! 🎬');
}

function copyPrompt(){
  const prompt = document.getElementById('prompt_output');
  prompt.select();
  document.execCommand('copy');
  alert('Prompt copied!');
}

function clearAll(){
  document.getElementById('preset_name').value = '';
  document.getElementById('preset_select').value = '';
  document.getElementById('favorite_select').value = '';
  document.getElementById('preset_favorite').checked = false;
  clearForm();
}

function clearForm(){
  document.getElementById('char_select').value = '';
  document.getElementById('dialog_select').value = 'diam';
  toggleDialog();
  ['rasio_video_select', 'gaya_seni_inti_select', 'aliran_artistik_select', 'palet_warna_select',
   'pencahayaan_select', 'arketipe_karakter_select', 'spesies_bentuk_select', 'atribut_unik_select',
   'genre_musik_select', 'desain_suara_select', 'mood_dominan_select', 'tekstur_kualitas_select',
   'komposisi_bidikan_select', 'sudut_kamera_select', 'pergerakan_kamera_select', 'lensa_fokus_select',
   'genre_lingkungan_select', 'lokasi_spesifik_select', 'skala_arsitektur_select'].forEach(id => {
    document.getElementById(id).value = '';
    toggleCustom(id.replace('_select', ''));
  });
}

function getFieldValue(field){
  const select = document.getElementById(field + '_select');
  const custom = document.getElementById(field + '_custom');
  return select.value === 'other' ? custom.value.trim() : select.value;
}

function setDropdown(field, value){
  const select = document.getElementById(field + '_select');
  const custom = document.getElementById(field + '_custom');
  const options = Array.from(select.options).map(opt => opt.value);
  if(options.includes(value)){
    select.value = value;
    custom.classList.add('hidden');
  } else {
    select.value = 'other';
    custom.value = value || '';
    custom.classList.remove('hidden');
  }
}

function toggleDialog(){
  const select = document.getElementById('dialog_select');
  const custom = document.getElementById('dialog_custom');
  const voice_over = document.getElementById('dialog_voice_over');
  if(select.value === 'custom'){
    custom.classList.remove('hidden');
    voice_over.classList.add('hidden');
  } else if(select.value === 'voice_over'){
    voice_over.classList.remove('hidden');
    custom.classList.add('hidden');
  } else {
    custom.classList.add('hidden');
    voice_over.classList.add('hidden');
  }
}

function toggleCustom(field){
  const select = document.getElementById(field + '_select');
  const custom = document.getElementById(field + '_custom');
  if(select.value === 'other'){
    custom.classList.remove('hidden');
  } else {
    custom.classList.add('hidden');
    custom.value = '';
  }
}

// Auto load data saat halaman buka
window.onload = function() {
  loadCharacters();
  loadPresets();
};

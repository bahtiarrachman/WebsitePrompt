// prompt_ttv.js - Update: Handle Optional, Dialog, English Prompt
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwmDzp1ifdkngq3e24lz_w1r5ZlnKH2yQtck_TFS8P_e7gQJI4fi4U1b6t15PTKFS6GiA/exec';

let characters = [];

function loadCharacters(){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', GAS_URL + '?action=getData', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.error) {
            alert('Error from GAS: ' + response.error);
            return;
          }
          characters = response;
          updateCharSelect();
          // alert('Karakter berhasil dimuat dari crud! 📥'); // Hapus ini
        } catch (e) {
          alert('Error parsing data: ' + e.message + ' - Response: ' + xhr.responseText);
        }
      } else {
        alert('Error loading data: ' + xhr.status + ' - ' + xhr.responseText);
      }
    }
  };
  xhr.send();
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
    alert('Karakter ' + item.char_id + ' dipilih. Isi detail TTV lalu generate prompt.');
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

function toggleDialog(){
  const select = document.getElementById('dialog_select');
  const custom = document.getElementById('dialog_custom');
  const voiceOver = document.getElementById('dialog_voice_over');
  if(select.value === 'custom'){
    custom.classList.remove('hidden');
    voiceOver.classList.add('hidden');
  } else if(select.value === 'voice_over'){
    voiceOver.classList.remove('hidden');
    custom.classList.add('hidden');
  } else {
    custom.classList.add('hidden');
    voiceOver.classList.add('hidden');
  }
}

function getFieldValue(field){
  const select = document.getElementById(field + '_select');
  const custom = document.getElementById(field + '_custom');
  return select.value === 'other' ? custom.value.trim() : select.value;
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

 // Build prompt in English, only include filled fields
  let prompt = `Generate a TTV (Text-to-Video) prompt for AI video generation.

Character Profile:
- ID: ${char.char_id}
- Physical Attributes: ${char.attr_fisik}
- Clothing: ${char.cloth_id}
- Voice: ${char.voice_id}
- Visual Style: ${char.style_id}`;

  if(dialog){
    prompt += `\n- Dialog: "${dialog}"`;
  }

  prompt += '\n\nTTV Details:';
  for(const [key, value] of Object.entries(fields)){
    if(value){
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      prompt += `\n- ${label}: ${value}`;
    }
  }

  prompt += '\n\nCreate a detailed, cinematic video prompt based on this.';

  document.getElementById('prompt_output').value = prompt;
  alert('Prompt Text To Video berhasil di-generate! 🎬');
}

function copyPrompt(){
  const prompt = document.getElementById('prompt_output');
  prompt.select();
  document.execCommand('copy');
  alert('Prompt berhasil di-copy ke clipboard! 📋');
}

// Auto load characters saat halaman buka
window.onload = function() {
  loadCharacters();
};

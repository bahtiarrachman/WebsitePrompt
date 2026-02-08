// prompt_ttv.js - Lengkap untuk prompt_ttv.html
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
          alert('Karakter berhasil dimuat dari crud! 📥');
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
    // Load karakter data ke form jika perlu, tapi di sini fokus generate prompt
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
  const gaya_seni_inti = getFieldValue('gaya_seni_inti');
  const aliran_artistik = getFieldValue('aliran_artistik');
  const palet_warna = getFieldValue('palet_warna');
  const pencahayaan = getFieldValue('pencahayaan');
  const arketipe_karakter = getFieldValue('arketipe_karakter');
  const spesies_bentuk = getFieldValue('spesies_bentuk');
  const atribut_unik = getFieldValue('atribut_unik');
  const genre_musik = getFieldValue('genre_musik');
  const desain_suara = getFieldValue('desain_suara');
  const mood_dominan = getFieldValue('mood_dominan');
  const tekstur_kualitas = getFieldValue('tekstur_kualitas');
  const komposisi_bidikan = getFieldValue('komposisi_bidikan');
  const sudut_kamera = getFieldValue('sudut_kamera');
  const pergerakan_kamera = getFieldValue('pergerakan_kamera');
  const lensa_fokus = getFieldValue('lensa_fokus');
  const genre_lingkungan = getFieldValue('genre_lingkungan');
  const lokasi_spesifik = getFieldValue('lokasi_spesifik');
  const skala_arsitektur = getFieldValue('skala_arsitektur');

  const prompt = `Generate a TTV (Text-to-Video) prompt for AI video generation.

Character Profile:
- ID: ${char.char_id}
- Atribut Fisik: ${char.attr_fisik}
- Pakaian: ${char.cloth_id}
- Suara: ${char.voice_id}
- Gaya Visual: ${char.style_id}

TTV Details:
- Gaya Seni Inti: ${gaya_seni_inti}
- Aliran Artistik: ${aliran_artistik}
- Palet Warna: ${palet_warna}
- Pencahayaan: ${pencahayaan}
- Arketipe Karakter: ${arketipe_karakter}
- Spesies/Bentuk: ${spesies_bentuk}
- Atribut Unik: ${atribut_unik}
- Genre Musik: ${genre_musik}
- Desain Suara: ${desain_suara}
- Mood Dominan: ${mood_dominan}
- Tekstur & Kualitas: ${tekstur_kualitas}
- Komposisi Bidikan: ${komposisi_bidikan}
- Sudut Kamera: ${sudut_kamera}
- Pergerakan Kamera: ${pergerakan_kamera}
- Lensa & Fokus: ${lensa_fokus}
- Genre Lingkungan: ${genre_lingkungan}
- Lokasi Spesifik: ${lokasi_spesifik}
- Skala & Arsitektur: ${skala_arsitektur}

Create a detailed, cinematic video prompt based on this.`;

  document.getElementById('prompt_output').value = prompt;
  alert('Prompt TTV berhasil di-generate! 🎬');
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
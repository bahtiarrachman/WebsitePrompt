// crud.js - Bagian 9/10: Script JavaScript Awal
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwmDzp1ifdkngq3e24lz_w1r5ZlnKH2yQtck_TFS8P_e7gQJI4fi4U1b6t15PTKFS6GiA/exec';

let data = [];
let editIndex = -1;

function switchMode(){
  const mode = document.getElementById('mode').value;
  const selectDiv = document.getElementById('select_existing');
  const addBtn = document.getElementById('add_btn');
  const updateBtn = document.getElementById('update_btn');
  if(mode === 'edit'){
    selectDiv.classList.remove('hidden');
    addBtn.style.display = 'none';
    updateBtn.style.display = 'inline-block';
    updateExistingSelect();
  } else {
    selectDiv.classList.add('hidden');
    addBtn.style.display = 'inline-block';
    updateBtn.style.display = 'none';
    clearForm();
  }
}

function updateExistingSelect(){
  const select = document.getElementById('existing_select');
  select.innerHTML = '<option value="">Pilih ID...</option>';
  data.forEach((item, index) => {
    if(item.char_id){
      select.innerHTML += `<option value="${index}">${item.char_id}</option>`;
    }
  });
}

function loadToForm(){
  const selectedIndex = document.getElementById('existing_select').value;
  if(selectedIndex !== ''){
    const item = data[selectedIndex];
    document.getElementById('char_id').value = item.char_id || '';
    document.getElementById('attr_fisik').value = item.attr_fisik || '';
    document.getElementById('cloth_id').value = item.cloth_id || '';
    document.getElementById('voice_id').value = item.voice_id || '';
    document.getElementById('style_id').value = item.style_id || '';
    setDropdown('gaya_seni_inti', item.gaya_seni_inti);
    setDropdown('aliran_artistik', item.aliran_artistik);
    setDropdown('palet_warna', item.palet_warna);
    setDropdown('pencahayaan', item.pencahayaan);
    setDropdown('arketipe_karakter', item.arketipe_karakter);
    setDropdown('spesies_bentuk', item.spesies_bentuk);
    setDropdown('atribut_unik', item.atribut_unik);
    setDropdown('genre_musik', item.genre_musik);
    setDropdown('desain_suara', item.desain_suara);
    setDropdown('mood_dominan', item.mood_dominan);
    setDropdown('tekstur_kualitas', item.tekstur_kualitas);
    setDropdown('komposisi_bidikan', item.komposisi_bidikan);
    setDropdown('sudut_kamera', item.sudut_kamera);
    setDropdown('pergerakan_kamera', item.pergerakan_kamera);
    setDropdown('lensa_fokus', item.lensa_fokus);
    setDropdown('genre_lingkungan', item.genre_lingkungan);
    setDropdown('lokasi_spesifik', item.lokasi_spesifik);
    setDropdown('skala_arsitektur', item.skala_arsitektur);
    editIndex = selectedIndex;
  }
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

function loadData(){
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
          data = response;
          updateExistingSelect();
          alert('Data berhasil dimuat dari Sheets! 📥');
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

function getFieldValue(field){
  const select = document.getElementById(field + '_select');
  const custom = document.getElementById(field + '_custom');
  return select.value === 'other' ? custom.value.trim() : select.value;
}

function isCharIdUnique(char_id, excludeIndex = -1){
  return !data.some((item, index) => item.char_id === char_id && index !== excludeIndex);
}

function addData(){
  const char_id = document.getElementById('char_id').value.trim();
  const attr_fisik = document.getElementById('attr_fisik').value.trim();
  const cloth_id = document.getElementById('cloth_id').value.trim();
  const voice_id = document.getElementById('voice_id').value.trim();
  const style_id = document.getElementById('style_id').value.trim();
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
  if(!char_id){
    alert('ID Karakter harus diisi!');
    return;
  }
  if(!isCharIdUnique(char_id)){
    alert('ID Karakter sudah ada! Pilih ID unik.');
    return;
  }
  const xhr = new XMLHttpRequest();
  xhr.open('GET', GAS_URL + '?action=addData&char_id=' + encodeURIComponent(char_id) + '&attr_fisik=' + encodeURIComponent(attr_fisik) + '&cloth_id=' + encodeURIComponent(cloth_id) + '&voice_id=' + encodeURIComponent(voice_id) + '&style_id=' + encodeURIComponent(style_id) + '&gaya_seni_inti=' + encodeURIComponent(gaya_seni_inti) + '&aliran_artistik=' + encodeURIComponent(aliran_artistik) + '&palet_warna=' + encodeURIComponent(palet_warna) + '&pencahayaan=' + encodeURIComponent(pencahayaan) + '&arketipe_karakter=' + encodeURIComponent(arketipe_karakter) + '&spesies_bentuk=' + encodeURIComponent(spesies_bentuk) + '&atribut_unik=' + encodeURIComponent(atribut_unik) + '&genre_musik=' + encodeURIComponent(genre_musik) + '&desain_suara=' + encodeURIComponent(desain_suara) + '&mood_dominan=' + encodeURIComponent(mood_dominan) + '&tekstur_kualitas=' + encodeURIComponent(tekstur_kualitas) + '&komposisi_bidikan=' + encodeURIComponent(komposisi_bidikan) + '&sudut_kamera=' + encodeURIComponent(sudut_kamera) + '&pergerakan_kamera=' + encodeURIComponent(pergerakan_kamera) + '&lensa_fokus=' + encodeURIComponent(lensa_fokus) + '&genre_lingkungan=' + encodeURIComponent(genre_lingkungan) + '&lokasi_spesifik=' + encodeURIComponent(lokasi_spesifik) + '&skala_arsitektur=' + encodeURIComponent(skala_arsitektur), true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        alert(xhr.responseText);
        loadData(); // Reload setelah add
      } else {
        alert('Error adding data: ' + xhr.status + ' - ' + xhr.responseText);
      }
    }
  };
  xhr.send();
}
// crud.js - Bagian 10/10: Script JavaScript Akhir
function updateData(){
  if(editIndex === -1){
    alert('Pilih data untuk edit dulu!');
    return;
  }
  const char_id = document.getElementById('char_id').value.trim();
  const attr_fisik = document.getElementById('attr_fisik').value.trim();
  const cloth_id = document.getElementById('cloth_id').value.trim();
  const voice_id = document.getElementById('voice_id').value.trim();
  const style_id = document.getElementById('style_id').value.trim();
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
  if(!char_id){
    alert('ID Karakter harus diisi!');
    return;
  }
  if(!isCharIdUnique(char_id, editIndex)){
    alert('ID Karakter sudah ada! Pilih ID unik.');
    return;
  }
  const xhr = new XMLHttpRequest();
  xhr.open('GET', GAS_URL + '?action=updateData&index=' + editIndex + '&char_id=' + encodeURIComponent(char_id) + '&attr_fisik=' + encodeURIComponent(attr_fisik) + '&cloth_id=' + encodeURIComponent(cloth_id) + '&voice_id=' + encodeURIComponent(voice_id) + '&style_id=' + encodeURIComponent(style_id) + '&gaya_seni_inti=' + encodeURIComponent(gaya_seni_inti) + '&aliran_artistik=' + encodeURIComponent(aliran_artistik) + '&palet_warna=' + encodeURIComponent(palet_warna) + '&pencahayaan=' + encodeURIComponent(pencahayaan) + '&arketipe_karakter=' + encodeURIComponent(arketipe_karakter) + '&spesies_bentuk=' + encodeURIComponent(spesies_bentuk) + '&atribut_unik=' + encodeURIComponent(atribut_unik) + '&genre_musik=' + encodeURIComponent(genre_musik) + '&desain_suara=' + encodeURIComponent(desain_suara) + '&mood_dominan=' + encodeURIComponent(mood_dominan) + '&tekstur_kualitas=' + encodeURIComponent(tekstur_kualitas) + '&komposisi_bidikan=' + encodeURIComponent(komposisi_bidikan) + '&sudut_kamera=' + encodeURIComponent(sudut_kamera) + '&pergerakan_kamera=' + encodeURIComponent(pergerakan_kamera) + '&lensa_fokus=' + encodeURIComponent(lensa_fokus) + '&genre_lingkungan=' + encodeURIComponent(genre_lingkungan) + '&lokasi_spesifik=' + encodeURIComponent(lokasi_spesifik) + '&skala_arsitektur=' + encodeURIComponent(skala_arsitektur), true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        alert(xhr.responseText);
        loadData();
        clearForm();
        editIndex = -1;
      } else {
        alert('Error updating data: ' + xhr.status + ' - ' + xhr.responseText);
      }
    }
  };
  xhr.send();
}

function deleteData(index){
  if(confirm('Yakin hapus data ini?')){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', GAS_URL + '?action=deleteData&index=' + index, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          alert(xhr.responseText);
          loadData();
        } else {
          alert('Error deleting data: ' + xhr.status + ' - ' + xhr.responseText);
        }
      }
    };
    xhr.send();
  }
}

function editData(index){
  const item = data[index];
  document.getElementById('char_id').value = item.char_id || '';
  document.getElementById('attr_fisik').value = item.attr_fisik || '';
  document.getElementById('cloth_id').value = item.cloth_id || '';
  document.getElementById('voice_id').value = item.voice_id || '';
  document.getElementById('style_id').value = item.style_id || '';
  setDropdown('gaya_seni_inti', item.gaya_seni_inti);
  setDropdown('aliran_artistik', item.aliran_artistik);
  setDropdown('palet_warna', item.palet_warna);
  setDropdown('pencahayaan', item.pencahayaan);
  setDropdown('arketipe_karakter', item.arketipe_karakter);
  setDropdown('spesies_bentuk', item.spesies_bentuk);
  setDropdown('atribut_unik', item.atribut_unik);
  setDropdown('genre_musik', item.genre_musik);
  setDropdown('desain_suara', item.desain_suara);
  setDropdown('mood_dominan', item.mood_dominan);
  setDropdown('tekstur_kualitas', item.tekstur_kualitas);
  setDropdown('komposisi_bidikan', item.komposisi_bidikan);
  setDropdown('sudut_kamera', item.sudut_kamera);
  setDropdown('pergerakan_kamera', item.pergerakan_kamera);
  setDropdown('lensa_fokus', item.lensa_fokus);
  setDropdown('genre_lingkungan', item.genre_lingkungan);
  setDropdown('lokasi_spesifik', item.lokasi_spesifik);
  setDropdown('skala_arsitektur', item.skala_arsitektur);
  editIndex = index;
  document.getElementById('mode').value = 'edit';
  switchMode();
  document.getElementById('existing_select').value = index;
}

function clearForm(){
  ['char_id','attr_fisik','cloth_id','voice_id','style_id'].forEach(id=>document.getElementById(id).value='');
  ['gaya_seni_inti_select','aliran_artistik_select','palet_warna_select','pencahayaan_select','arketipe_karakter_select','spesies_bentuk_select','atribut_unik_select','genre_musik_select','desain_suara_select','mood_dominan_select','tekstur_kualitas_select','komposisi_bidikan_select','sudut_kamera_select','pergerakan_kamera_select','lensa_fokus_select','genre_lingkungan_select','lokasi_spesifik_select','skala_arsitektur_select'].forEach(id=>{
    document.getElementById(id).value = '';
  });
  ['gaya_seni_inti_custom','aliran_artistik_custom','palet_warna_custom','pencahayaan_custom','arketipe_karakter_custom','spesies_bentuk_custom','atribut_unik_custom','genre_musik_custom','desain_suara_custom','mood_dominan_custom','tekstur_kualitas_custom','komposisi_bidikan_custom','sudut_kamera_custom','pergerakan_kamera_custom','lensa_fokus_custom','genre_lingkungan_custom','lokasi_spesifik_custom','skala_arsitektur_custom'].forEach(id=>{
    document.getElementById(id).value = '';
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById('existing_select').value = '';
  editIndex = -1;
  document.getElementById('mode').value = 'add';
  switchMode();
}

// Auto load data saat halaman buka
window.onload = function() {
  loadData();
};
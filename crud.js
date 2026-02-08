// crud.js - Lengkap dengan Glide untuk Carousel
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwmDzp1ifdkngq3e24lz_w1r5ZlnKH2yQtck_TFS8P_e7gQJI4fi4U1b6t15PTKFS6GiA/exec';

let data = [];
let editIndex = -1;
let glide;

function switchMode(){
  const mode = document.getElementById('mode').value;
  const selectDiv = document.getElementById('select_existing');
  const formSection = document.getElementById('form_section');
  const addBtn = document.getElementById('add_btn');
  const updateBtn = document.getElementById('update_btn');
  if(mode === 'edit'){
    selectDiv.classList.remove('hidden');
    formSection.classList.remove('hidden');
    addBtn.style.display = 'none';
    updateBtn.style.display = 'inline-block';
    updateExistingSelect();
  } else {
    selectDiv.classList.add('hidden');
    formSection.classList.remove('hidden');
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
    setDropdown('attr_fisik', item.attr_fisik);
    setDropdown('cloth_id', item.cloth_id);
    setDropdown('voice_id', item.voice_id);
    setDropdown('style_id', item.style_id);
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

function showPreview(field){
  var select = document.getElementById(field + '_select');
  var preview = document.getElementById(field + '_preview');
  var selectedOption = select.options[select.selectedIndex];
  var previewText = selectedOption.getAttribute('data-preview');
  if (previewText) {
    preview.innerHTML = previewText;
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }
}

function loadData(){
  console.log('Loading data...');
  const xhr = new XMLHttpRequest();
  xhr.open('GET', GAS_URL + '?action=getData', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      console.log('XHR status:', xhr.status);
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          console.log('Response:', response);
          if (response.error) {
            alert('Error from GAS: ' + response.error);
            return;
          }
          data = response;
          renderCards();
          updateExistingSelect();
          alert('Data berhasil dimuat dari Sheets! 📥');
        } catch (e) {
          console.error('Parse error:', e);
          alert('Error parsing data: ' + e.message + ' - Response: ' + xhr.responseText);
        }
      } else {
        console.error('Error loading data:', xhr.status, xhr.responseText);
        alert('Error loading data: ' + xhr.status + ' - ' + xhr.responseText);
      }
    }
  };
  xhr.send();
}

function renderCards(){
  console.log('Rendering cards, data length:', data.length);
  const cardsContainer = document.getElementById('character_cards');
  cardsContainer.innerHTML = '';
  if(data.length === 0){
    cardsContainer.innerHTML = '<li class="glide__slide"><div class="character-card"><p>Tidak ada data. Klik Load Data untuk muat dari Sheets.</p></div></li>';
    return;
  }
  data.forEach((item, index) => {
    const previewAttr = getPreviewText('attr_fisik', item.attr_fisik);
    const previewCloth = getPreviewText('cloth_id', item.cloth_id);
    const previewVoice = getPreviewText('voice_id', item.voice_id);
    const previewStyle = getPreviewText('style_id', item.style_id);
    cardsContainer.innerHTML += `
      <li class="glide__slide">
        <div class="character-card">
          <h3>${item.char_id || 'Kosong'}</h3>
          <p><strong>Atribut Fisik:</strong> ${item.attr_fisik || 'Kosong'} ${previewAttr}</p>
          <p><strong>Pakaian:</strong> ${item.cloth_id || 'Kosong'} ${previewCloth}</p>
          <p><strong>Suara:</strong> ${item.voice_id || 'Kosong'} ${previewVoice}</p>
          <p><strong>Gaya Visual:</strong> ${item.style_id || 'Kosong'} ${previewStyle}</p>
          <button onclick="editData(${index})" class="btn">✏️ Edit</button>
          <button onclick="deleteData(${index})" class="btn alt">🗑️ Delete</button>
        </div>
      </li>
    `;
  });
  // Inisialisasi Glide setelah render
  if(glide) glide.destroy();
  glide = new Glide('#glide', {
    type: 'carousel',
    perView: 1,
    breakpoints: {
      640: {
        perView: 2,
      },
      1024: {
        perView: 3,
      },
    },
  }).mount();
  console.log('Glide initialized');
}

function getPreviewText(field, value){
  const select = document.getElementById(field + '_select');
  const options = select.options;
  for(let i = 0; i < options.length; i++){
    if(options[i].value === value){
      return options[i].getAttribute('data-preview') || '';
    }
  }
  return '';
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
  const attr_fisik = getFieldValue('attr_fisik');
  const cloth_id = getFieldValue('cloth_id');
  const voice_id = getFieldValue('voice_id');
  const style_id = getFieldValue('style_id');
  if(!char_id){
    alert('ID Karakter harus diisi!');
    return;
  }
  if(!isCharIdUnique(char_id)){
    alert('ID Karakter sudah ada! Pilih ID unik.');
    return;
  }
  const xhr = new XMLHttpRequest();
  xhr.open('GET', GAS_URL + '?action=addData&char_id=' + encodeURIComponent(char_id) + '&attr_fisik=' + encodeURIComponent(attr_fisik) + '&cloth_id=' + encodeURIComponent(cloth_id) + '&voice_id=' + encodeURIComponent(voice_id) + '&style_id=' + encodeURIComponent(style_id), true);
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

function updateData(){
  if(editIndex === -1){
    alert('Pilih data untuk edit dulu!');
    return;
  }
  const char_id = document.getElementById('char_id').value.trim();
  const attr_fisik = getFieldValue('attr_fisik');
  const cloth_id = getFieldValue('cloth_id');
  const voice_id = getFieldValue('voice_id');
  const style_id = getFieldValue('style_id');
  if(!char_id){
    alert('ID Karakter harus diisi!');
    return;
  }
  if(!isCharIdUnique(char_id, editIndex)){
    alert('ID Karakter sudah ada! Pilih ID unik.');
    return;
  }
  const xhr = new XMLHttpRequest();
  xhr.open('GET', GAS_URL + '?action=updateData&index=' + editIndex + '&char_id=' + encodeURIComponent(char_id) + '&attr_fisik=' + encodeURIComponent(attr_fisik) + '&cloth_id=' + encodeURIComponent(cloth_id) + '&voice_id=' + encodeURIComponent(voice_id) + '&style_id=' + encodeURIComponent(style_id), true);
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
  setDropdown('attr_fisik', item.attr_fisik);
  setDropdown('cloth_id', item.cloth_id);
  setDropdown('voice_id', item.voice_id);
  setDropdown('style_id', item.style_id);
  editIndex = index;
  document.getElementById('mode').value = 'edit';
  switchMode();
  document.getElementById('existing_select').value = index;
}

function clearForm(){
  ['char_id'].forEach(id=>document.getElementById(id).value='');
  ['attr_fisik_select','cloth_id_select','voice_id_select','style_id_select'].forEach(id=>{
    document.getElementById(id).value = '';
  });
  ['attr_fisik_custom','cloth_id_custom','voice_id_custom','style_id_custom'].forEach(id=>{
    document.getElementById(id).value = '';
    document.getElementById(id).classList.add('hidden');
  });
  ['attr_fisik_preview','cloth_id_preview','voice_id_preview','style_id_preview'].forEach(id=>{
    document.getElementById(id).style.display = 'none';
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

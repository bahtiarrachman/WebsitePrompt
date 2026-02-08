// crud.js - Update: Tambah Swiper untuk Carousel Card
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwmDzp1ifdkngq3e24lz_w1r5ZlnKH2yQtck_TFS8P_e7gQJI4fi4U1b6t15PTKFS6GiA/exec';

let data = [];
let editIndex = -1;
let swiper;

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
          renderCards();
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

function renderCards(){
  const cardsContainer = document.getElementById('character_cards');
  cardsContainer.innerHTML = '';
  if(data.length === 0){
    cardsContainer.innerHTML = '<div class="swiper-slide"><div class="character-card"><p>Tidak ada data. Klik Load Data untuk muat dari Sheets.</p></div></div>';
    return;
  }
  data.forEach((item, index) => {
    const previewAttr = getPreviewText('attr_fisik', item.attr_fisik);
    const previewCloth = getPreviewText('cloth_id', item.cloth_id);
    const previewVoice = getPreviewText('voice_id', item.voice_id);
    const previewStyle = getPreviewText('style_id', item.style_id);
    cardsContainer.innerHTML += `
      <div class="swiper-slide">
        <div class="character-card">
          <h3>${item.char_id || 'Kosong'}</h3>
          <p><strong>Atribut Fisik:</strong> ${item.attr_fisik || 'Kosong'} ${previewAttr}</p>
          <p><strong>Pakaian:</strong> ${item.cloth_id || 'Kosong'} ${previewCloth}</p>
          <p><strong>Suara:</strong> ${item.voice_id || 'Kosong'} ${previewVoice}</p>
          <p><strong>Gaya Visual:</strong> ${item.style_id || 'Kosong'} ${previewStyle}</p>
          <button onclick="editData(${index})" class="btn">✏️ Edit</button>
          <button onclick="deleteData(${index})" class="btn alt">🗑️ Delete</button>
        </div>
      </div>
    `;
  });
  // Inisialisasi Swiper setelah render
  if(swiper) swiper.destroy();
  swiper = new Swiper('.mySwiper', {
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      640: {
        slides

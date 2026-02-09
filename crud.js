const GAS_URL = 'https://script.google.com/macros/s/AKfycbxsti7UJd2bLB6-vsIaja2uHaOxQY-i8PVUCsOQMAodHXqWowPda1TMG2t_FU1mM6gm_w/exec';

let data = [];
let editIndex = -1;

function updateExistingSelect(){
  const select = document.getElementById('existing_select');
  select.innerHTML = '<option value="">Pilih Karakter...</option>';
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
    document.getElementById('delete_btn').style.display = 'inline-block';
  } else {
    clearForm();
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
  xhr.open('POST', GAS_URL, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          data = response.map(row => ({
            char_id: row[0] || '',
            attr_fisik: row[1] || '',
            cloth_id: row[2] || '',
            voice_id: row[3] || '',
            style_id: row[4] || ''
          }));
          updateExistingSelect();
        } catch (e) {
          alert('Error parsing data: ' + e.message + ' - Response: ' + xhr.responseText);
        }
      } else {
        alert('Error loading data: ' + xhr.status + ' - ' + xhr.responseText);
      }
    }
  };
  xhr.send('action=getData');
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
  xhr.open('POST', GAS_URL, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        alert(xhr.responseText);
        loadData();
        clearForm();
      } else {
        alert('Error adding data: ' + xhr.status + ' - ' + xhr.responseText);
      }
    }
  };
  xhr.send('action=addData&char_id=' + encodeURIComponent(char_id) + '&attr_fisik=' + encodeURIComponent(attr_fisik) + '&cloth_id=' + encodeURIComponent(cloth_id) + '&voice_id=' + encodeURIComponent(voice_id) + '&style_id=' + encodeURIComponent(style_id));
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
  xhr.open('POST', GAS_URL, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
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
  xhr.send('action=updateData&index=' + editIndex + '&char_id=' + encodeURIComponent(char_id) + '&attr_fisik=' + encodeURIComponent(attr_fisik) + '&cloth_id=' + encodeURIComponent(cloth_id) + '&voice_id=' + encodeURIComponent(voice_id) + '&style_id=' + encodeURIComponent(style_id));
}

function deleteData(index){
  if(confirm('Yakin hapus data ini?')){
    const xhr = new XMLHttpRequest();
    xhr.open('POST', GAS_URL, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
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
    xhr.send('action=deleteData&index=' + index);
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
  switchMode();
}

function newCharacter(){
  clearForm();
  document.getElementById('existing_select').value = '';
  editIndex = -1;
  document.getElementById('delete_btn').style.display = 'none';
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
  document.getElementById('delete_btn').style.display = 'none';
}

function saveCharacter(){
  const char_id = document.getElementById('char_id').value.trim();
  const attr_fisik = getFieldValue('attr_fisik');
  const cloth_id = getFieldValue('cloth_id');
  const voice_id = getFieldValue('voice_id');
  const style_id = getFieldValue('style_id');
  if(!char_id){
    alert('ID Karakter harus diisi!');
    return;
  }
  if(editIndex === -1){
    addData();
  } else {
    updateData();
  }
}

function deleteCharacter(){
  if(editIndex === -1){
    alert('Pilih karakter dulu!');
    return;
  }
  deleteData(editIndex);
}

function switchMode(){
  // Jika ada mode edit/view, tambah logika di sini
}

// Auto load data saat halaman buka
window.onload = function() {
  loadData();
};

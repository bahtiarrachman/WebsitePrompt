// index.js - Bagian 5/30: Fungsi Generate dan Copy
function generatePrompt(){
  const tujuan = document.getElementById('tujuan_select').value;
  const deskripsi = document.getElementById('deskripsi').value.trim();
  const gaya = document.getElementById('gaya_select').value;
  const detail = document.getElementById('detail').value.trim();
  if(!tujuan || !deskripsi){
    alert('Pilih tujuan dan isi deskripsi!');
    return;
  }
  let prompt = `Generate a ${tujuan.toLowerCase()} of ${deskripsi}`;
  if(gaya){
    prompt += ` in ${gaya} style`;
  }
  if(detail){
    prompt += `. Additional details: ${detail}`;
  }
  prompt += '.';
  document.getElementById('prompt_output').value = prompt;
  alert('Prompt generated!');
}

function copyPrompt(){
  const prompt = document.getElementById('prompt_output');
  prompt.select();
  document.execCommand('copy');
  alert('Prompt copied!');
}

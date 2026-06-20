/* ==========================================================
   PBTips — script.js (halaman utama)
   Sekarang data tips diambil dari Supabase, bukan array statis.
   Hanya tips dengan status "approved" yang tampil di sini.
   ========================================================== */

// Data tips yang sudah di-approve, disimpan di memori browser
// setelah diambil dari Supabase. Dipakai ulang saat ganti filter.
let tipsData = [];
let currentFilter = 'all';

// ----------------------------------------------------------
// 1. AMBIL TIPS YANG SUDAH APPROVED DARI SUPABASE
// ----------------------------------------------------------
async function loadTips() {
  const grid = document.getElementById('tipsGrid');
  grid.innerHTML = '<p style="color:var(--muted); font-size:13px;">Memuat tips...</p>';

  const { data, error } = await supabaseClient
    .from('tips')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    grid.innerHTML = '<p style="color:#f87171; font-size:13px;">Gagal memuat data. Cek console / koneksi Supabase kamu.</p>';
    return;
  }

  tipsData = data;
  renderFilterBar();
  renderTips();
}

// ----------------------------------------------------------
// 2. AMBIL DAFTAR MAP UNIK DARI tipsData
// ----------------------------------------------------------
function getMaps() {
  return [...new Set(tipsData.map(t => t.map))].sort();
}

// ----------------------------------------------------------
// 3. RENDER TOMBOL FILTER MAP
// ----------------------------------------------------------
function renderFilterBar() {
  const maps = getMaps();
  const bar = document.getElementById('filterBar');
  let html = `<button class="filter-tab ${currentFilter === 'all' ? 'active' : ''}" onclick="setFilter('all', this)">Semua</button>`;
  html += maps.map(m => `<button class="filter-tab ${currentFilter === m ? 'active' : ''}" onclick="setFilter('${m.replace(/'/g, "\\'")}', this)">${m}</button>`).join('');
  bar.innerHTML = html;
}

function setFilter(map, el) {
  currentFilter = map;
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderTips();
}

// ----------------------------------------------------------
// 4. RENDER GRID KARTU TIPS
// ----------------------------------------------------------
function renderTips() {
  const filtered = currentFilter === 'all' ? tipsData : tipsData.filter(t => t.map === currentFilter);
  document.getElementById('tipCount').textContent = 'Menampilkan ' + filtered.length + ' spot';

  if (filtered.length === 0) {
    document.getElementById('tipsGrid').innerHTML = '<p style="color:var(--muted); font-size:13px;">Belum ada tips untuk filter ini.</p>';
    return;
  }

  document.getElementById('tipsGrid').innerHTML = filtered.map((t) => `
    <div class="tip-card">
      <div class="video-wrap">
        <div class="video-placeholder" onclick="openVideoModal('${t.video_id}', '${t.title.replace(/'/g, "\\'")}', '${t.description.replace(/'/g, "\\'")}')">
          <div class="play-btn"><i class="ti ti-player-play"></i></div>
          <div class="video-label">Klik untuk tonton</div>
        </div>
        <div class="map-badge"><i class="ti ti-map-pin" style="font-size:10px;"></i> ${t.map}</div>
        <div class="cat-badge cat-grenade">💣 Spam Bom</div>
      </div>
      <div class="card-body">
        <div class="card-title">${t.title}</div>
        <div class="card-desc">${t.description}</div>
        <div class="card-footer">
          <div class="card-author">
            <div class="author-avatar">${t.author[0]}</div>
            <div class="author-name">${t.author}</div>
          </div>
          <div class="card-likes" onclick="likeTip(${t.id}, this)">
            <i class="ti ti-heart"></i>
            <span>${t.likes}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Tambah jumlah like (disimpan permanen ke Supabase)
async function likeTip(id, el) {
  const num = el.querySelector('span');
  const newLikes = parseInt(num.textContent) + 1;

  num.textContent = newLikes;
  el.style.color = 'var(--orange)';

  const { error } = await supabaseClient
    .from('tips')
    .update({ likes: newLikes })
    .eq('id', id);

  if (error) console.error('Gagal update likes:', error);

  // sinkronkan juga ke data di memori biar konsisten saat re-render
  const tip = tipsData.find(t => t.id === id);
  if (tip) tip.likes = newLikes;
}

// ----------------------------------------------------------
// 5. MODAL VIDEO
// ----------------------------------------------------------
function openVideoModal(videoId, title, desc) {
  document.getElementById('vmodalFrame').src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
  document.getElementById('vmodalTitle').textContent = title;
  document.getElementById('vmodalDesc').textContent = desc;
  document.getElementById('vmodal').classList.add('show');
}

function closeVideoModal() {
  document.getElementById('vmodal').classList.remove('show');
  document.getElementById('vmodalFrame').src = '';
}

function closeModal(e) {
  if (e.target === document.getElementById('vmodal')) closeVideoModal();
}

// ----------------------------------------------------------
// 6. FORM SUBMIT TIPS -> simpan ke Supabase, status "pending"
// ----------------------------------------------------------
function toggleSubmit() {
  const sec = document.getElementById('submitSection');
  sec.classList.toggle('show');
  if (sec.classList.contains('show')) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function previewVideo() {
  const val = document.getElementById('tipVideo').value;
  const preview = document.getElementById('videoPreview');
  const match = val.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match) {
    preview.innerHTML = 'Preview: <span>youtube.com/watch?v=' + match[1] + '</span> ✓';
  } else if (val.length > 5) {
    preview.innerHTML = '<span style="color:#f87171;">Link YouTube tidak valid</span>';
  } else {
    preview.innerHTML = 'Masukkan link YouTube';
  }
}

async function submitTip() {
  const title  = document.getElementById('tipTitle').value.trim();
  const map    = document.getElementById('tipMap').value;
  const video  = document.getElementById('tipVideo').value.trim();
  const author = document.getElementById('tipAuthor').value.trim();
  const desc   = document.getElementById('tipDesc').value.trim();

  if (!title || !map || !video || !author || !desc) {
    alert('Semua field wajib diisi!');
    return;
  }
  const match = video.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (!match) { alert('Link YouTube tidak valid!'); return; }
  const videoId = match[1];

  const submitBtn = document.querySelector('.btn-submit-form');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Mengirim...';

  const { error } = await supabaseClient
    .from('tips')
    .insert({
      title,
      map,
      description: desc,
      author,
      video_id: videoId,
      status: 'pending' // wajib pending, ditegakkan juga oleh RLS policy di Supabase
    });

  submitBtn.disabled = false;
  submitBtn.innerHTML = '<i class="ti ti-send" style="font-size:14px;"></i> Kirim untuk Review';

  if (error) {
    console.error(error);
    alert('Gagal mengirim tips. Coba lagi sebentar lagi.');
    return;
  }

  document.getElementById('submitSection').classList.remove('show');
  document.getElementById('tipTitle').value = '';
  document.getElementById('tipMap').value = '';
  document.getElementById('tipVideo').value = '';
  document.getElementById('tipAuthor').value = '';
  document.getElementById('tipDesc').value = '';
  document.getElementById('videoPreview').textContent = 'Masukkan link YouTube';

  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ----------------------------------------------------------
// 7. JALANKAN SAAT HALAMAN PERTAMA KALI DIBUKA
// ----------------------------------------------------------
loadTips();
